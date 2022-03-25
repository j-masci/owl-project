import re
import cerberus
from database import db


# would usually have an ORM or some other library for creating models,
# but for simplicity I'll just write my own simple one for now.
class UserModel:

    def __init__(self, id, username, first, last, dob):
        self.id = id
        self.username = username
        self.first_name = first
        self.last_name = last
        self.date_of_birth = dob

    # returns a dict, not a model instance
    @staticmethod
    def get_by_id(user_id):
        sql = "SELECT * FROM users WHERE id = ?"
        results = db.get_results(sql, [str(user_id)])

        return results[0] if len(results) > 0 else False

    # checks that first name, last name, and date of birth are valid.
    def validate(self):
        if not re.match('[1-2][\d]{7}', self.date_of_birth):
            return False, "Date of birth is invalid."

        v = cerberus.Validator({
            'username': {'type': 'string', 'maxlength': 99, 'minlength': 1},
            'first_name': {'type': 'string', 'maxlength': 99, 'minlength': 1},
            'last_name': {'type': 'string', 'maxlength': 99, 'minlength': 1}
        })

        result = v.validate({
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.first_name,
        })

        if not result:
            return False, "First name, last name, and username are required."

        return True, ""

    # make sure to call validate first
    def insert(self):

        sql = '''
        INSERT INTO users(username, first_name, last_name, date_of_birth)
        VALUES(?, ?, ?, ?);
        '''

        cursor = db.conn.execute(sql, (self.username, self.first_name, self.last_name, self.date_of_birth))
        db.conn.commit()

        return UserModel.get_by_id(cursor.lastrowid) if cursor.lastrowid else False

    # make sure to call validate first
    def update(self):

        sql = '''
        UPDATE users SET
        username = ? 
        first_name = ?
        last_name = ?
        date_of_birth = ?
        WHERE id = ?;
        '''

        cursor = db.conn.execute(sql, (self.username, self.first_name, self.last_name, self.date_of_birth, self.id))
        db.conn.commit()

        return UserModel.get_by_id(self.id) if self.id else False
