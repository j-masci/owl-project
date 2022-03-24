# Load tornado module
from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop
import json
import os
from pprint import pprint

import sqlite3

conn = sqlite3.connect('owl-todo-dev.db')
conn.row_factory = sqlite3.Row


class Db:

    @staticmethod
    def getResults(sql, parameters=None):
        cursor = conn.execute(sql, parameters)
        ret = cursor.fetchall()
        return map(dict, ret)

    @staticmethod
    def seed(drop=False):
        if drop:
            conn.execute('DROP TABLE IF EXISTS users')

        with open(os.path.join(os.path.dirname(__file__), 'schema.sql'), 'r') as schema_file:
            schema_sql = schema_file.read()

        with open(os.path.join(os.path.dirname(__file__), 'seed.sql'), 'r') as seed_file:
            seed_sql = seed_file.read()

        print('Executing', schema_sql, seed_sql)

        conn.executescript(schema_sql)
        conn.executescript(seed_sql)
        conn.commit()


# URL request handler
class HelloHandler(RequestHandler):
    def get(self):
        self.write({'message': 'asd', 'idk': 123})


class UsersHandler(RequestHandler):
    def get(self):
        users = getResults("SELECT * FROM users ORDER BY last_name, first_name")
        print(users)
        self.write({"hi": 123})


# define end points
def make_app():
    urls = [
        ("/", HelloHandler),
        ("/api/users", UsersHandler),
    ]
    return Application(urls, autoreload=True)


def serve():
    app = make_app()
    print("Starting python HTTP server at http://localhost:3003")
    app.listen(3003)
    IOLoop.current().start()
