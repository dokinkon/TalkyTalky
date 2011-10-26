
from google.appengine.ext import db
from talkyuser import TalkyUser
from userpost import UserPost


class PostReply(db.Model):
    owner = db.ReferenceProperty(reference_class=TalkyUser, collection_name='replies')
    post = db.ReferenceProperty(reference_class=UserPost, collection_name='replies')
    dateTime = db.DateTimeProperty(auto_now_add=True)
    content = db.StringProperty(multiline=True)


    #TODO : goods and bads

