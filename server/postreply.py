
from google.appengine.ext import db
from talkyuser import TalkyUser
from userpost import UserPost
import utils


class PostReply(db.Model):
    owner = db.ReferenceProperty(reference_class=TalkyUser, collection_name='replies')
    post = db.ReferenceProperty(reference_class=UserPost, collection_name='replies')
    dateTime = db.DateTimeProperty(auto_now_add=True)
    content = db.StringProperty(multiline=True)

    def toInterchangeable(self):
        interchangeable = {
            'id':self.key().id(),
            'owner':self.owner.fb_uid,
            'content':self.content,
            'date_time':utils.dateTimeToInterchangeable(self.dateTime),
        }
        return interchangeable


