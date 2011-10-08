
from google.appengine.ext import db


class UserPost(db.Model):

    # UserID from Facebook
    userId = db.StringProperty(required=True)

    date = db.DateTimeProperty(auto_now_add=True)
    content = db.StringProperty(multiline=True)
    spotName = db.StringProperty(required=True)
    #replies  = db.ListProperty(db.Key)

