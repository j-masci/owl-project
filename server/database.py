import sqlite3
import os
import functools


class Database:

    def __init__(self):
        self.conn = sqlite3.connect('owl-todo-dev.db')

        # get objects back from select queries
        # still need to call dict on returned objects
        self.conn.row_factory = sqlite3.Row

    # execute select statement and get list of dicts
    def get_results(self, sql, replacements=None):
        cursor = self.conn.execute(sql, [] if replacements is None else replacements)
        ret = cursor.fetchall()
        return list(map(dict, ret))

    def seed(self, drop=False):
        if drop:
            self.conn.execute('DROP TABLE IF EXISTS users')

        with open(os.path.join(os.path.dirname(__file__), 'schema.sql'), 'r') as schema_file:
            schema_sql = schema_file.read()

        with open(os.path.join(os.path.dirname(__file__), 'seed.sql'), 'r') as seed_file:
            seed_sql = seed_file.read()

        print('Executing', schema_sql)
        self.conn.executescript(schema_sql)

        print('Executing', seed_sql)
        self.conn.executescript(seed_sql)

        self.conn.commit()


db = Database()
