
from google.appengine.ext import db
from talkyuser import TalkyUser
from spot import Spot


class UserPost(db.Model):
    #Has one to many relation?

<<<<<<< HEAD
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
=======
    owner    = db.ReferenceProperty(reference_class=TalkyUser, collection_name='posts')
    dateTime = db.DateTimeProperty(auto_now_add=True)
    content  = db.StringProperty(multiline=True) 
    spot = db.ReferenceProperty(reference_class=Spot, collection_name='posts')

    image = db.BlobProperty()
   
    imageDesciption = db.StringProperty()
>>>>>>> 8e9863b18a2c753b3e0c09d34c0c94bd79ab50c5

    goods = db.IntegerProperty()

    bads = db.IntegerProperty()

    anonymous = db.BooleanProperty()

    """
    implicity properties
    replies:<collection of PostReply>
    """
