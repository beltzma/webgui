#!LS_env/bin/python

import os

from app import create_app, db
#from flask import Flask

from flask.ext.script import Manager, Shell
#from flask.ext.migrate import Migrate, MigrateCimmand

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
#app = Flask(__name__)

manager = Manager(app)
#migrate = Migrate(app)

def make_shell_context():
    return dict(app=app,db=db)

manager.add_command("shell", Shell(make_context=make_shell_context))
#manager.add_command("db", MigrateCommand)

if __name__ == '__main__':
    manager.run()

