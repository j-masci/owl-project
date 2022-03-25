import json
from tornado.web import RequestHandler
from database import db
from models import UserModel


# other handlers should extend this one.
# this (should) allow cross origin requests from our client
# thanks to: https://stackoverflow.com/a/40431557/7220351
class Handler(RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with, Content-Type, Cache-Control")
        self.set_header('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS')

    def options(self):
        # no body
        self.set_status(204)
        self.finish()


def send_error(handler, status, msg):
    handler.write({
        'error': msg
    })
    handler.set_status(status)


# route at "/"
class Base(Handler):
    def get(self):
        self.write("API is running.")


class GetUsers(Handler):
    def get(self):
        users = db.get_results("SELECT * FROM users ORDER BY id")
        self.write({"payload": users})


class AddUser(Handler):
    def post(self):

        # not a good way to handle json request data,
        # but not sure how to set it up correctly in tornado
        body = json.loads(self.request.body)

        user = UserModel(
            None,
            body.get('username', ''),
            body.get('first_name', ''),
            body.get('last_name', ''),
            body.get('date_of_birth', ''),
        )

        # handling no username is done below
        if user.username:

            sql = "SELECT * FROM users WHERE username = ?"
            results = db.get_results(sql, [str(user.username)])

            if len(results):
                send_error(self, 200, "Username is already taken.")
                return

        # check req fields etc.
        valid, msg = user.validate()

        if not valid:
            send_error(self, 200, msg)
            return

        try:
            result = user.insert()
        except:
            send_error(self, 200, "Unknown Error.")
            return

        self.write({
            "success": True,
            "payload": result
        })


class UpdateUser(Handler):
    def post(self):

        body = json.loads(self.request.body)

        userDict = UserModel.get_by_id(body.id)

        if userDict is False:
            send_error(self, 200, "User not found.")

        user = UserModel(
            userDict.get('id'),
            body.get('username', ''),
            body.get('first_name', ''),
            body.get('last_name', ''),
            body.get('date_of_birth', ''),
        )

        valid, msg = user.validate()

        if not valid:
            send_error(self, 200, msg)
            return

        try:
            result = user.update()
        except:
            send_error(self, 200, "Unknown Error.")
            return

        self.write({
            "success": True,
            "payload": result
        })


class DeleteUsers(Handler):

    # deletes multiple users by ID
    def delete(self):
        # ie. ?ids=2,5,20
        ids = self.get_query_argument('ids', '').split(',')
        ids = map(lambda x: int(x) if x.isdigit() else False, ids)
        ids = filter(bool, ids)
        ids = list(ids)

        # no need to treat this as error IMO. Nothing needs to be done.
        if not len(ids):
            self.write({
                "success": True,
            })
            return

        # ie. "?, ?, ?"
        placeholders = ",".join(map(lambda x: '?', ids))

        # ie. "... where id IN (?, ?, ?)"
        sql = '''
               DELETE FROM users WHERE
               id IN ({str})
               '''.format(str=placeholders)

        # not bothering with try/catch for now.
        cursor = db.conn.execute(sql, ids)
        db.conn.commit()

        self.write({
            "success": True
        })


routes = [
    ("/", Base),
    ("/api/users", GetUsers),
    ("/api/users/add", AddUser),
    ("/api/users/update", UpdateUser),
    ("/api/users/delete", DeleteUsers),
]
