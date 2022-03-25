import sys
from tornado.web import Application
from tornado.ioloop import IOLoop
# import server.config as config
import config
import handlers
from database import db


def make_app():
    return Application(handlers.routes, autoreload=config.autoreload)


def serve():
    app = make_app()
    print("Starting python HTTP server at http://localhost{port}:".format(port=config.port))
    app.listen(config.port)
    IOLoop.current().start()


if __name__ == '__main__':
    if len(sys.argv) > 1:
        if sys.argv[1] == '--seed':
            print('Seeding database. (tables will be dropped and re-populated).')
            db.seed(True)
        elif sys.argv[1] == '--start':
            serve()
    else:
        print("App loaded. HTTP server not started. Use --start to run server.")
