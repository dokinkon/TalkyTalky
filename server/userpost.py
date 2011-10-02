
from google.appengine.ext import db


class UserPost(db.Model):

    date = db.DateTimeProperty(auto_now_add=True)
    content = db.StringProperty(multiline=True)

