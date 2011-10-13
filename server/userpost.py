
from google.appengine.ext import db


class UserPost(db.Model):
    #Has one to many relation?

    owner = db.ReferenceProperty(reference_class=TalkyUser, collection_name=posts)
    dateTime = db.DateTimeProperty(auto_now_add=True)
    content = db.StringProperty(multiline=True) 
    spot = db.ReferenceProperty(reference_class=Spot, collection_name=posts)

    image = db.BlobProperty()
   
    imageDesciption = db.StringProperty()

    goods = db.IntegerProperty()

    bads = db.IntegerProperty()

    anonymous = db.BooleanProperty()

    """
    implicity properties
    replies:<collection of PostReply>
    """
