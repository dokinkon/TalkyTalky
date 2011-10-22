
from google.appengine.ext import db


class UserPost(db.Model):

    # UserID from Facebook
    # Should change to db.ReferenceProperty
    userId = db.StringProperty(required=True)

    date = db.DateTimeProperty(auto_now_add=True)
    content = db.StringProperty(multiline=True)

    # spotName, should change to db.ReferenceProperty
    spotName = db.StringProperty(required=True)

    # image
    image = db.BlobProperty(default=None)


    #replies  = db.ListProperty(db.Key)

