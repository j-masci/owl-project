import sys
from server import app

if __name__ == '__main__':

    if len(sys.argv) > 1 and sys.argv[1] == '--seed':
        print('Seeding database. Dropping tables and inserting new ones.')
        app.Db.seed(True)
    else:
        app.serve()
