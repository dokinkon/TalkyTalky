
from google.appengine.ext import db
from talkyuser import TalkyUser
from spot import Spot


class TestModel(db.Model):
    time = db.DateTimeProperty(auto_now_add=True)


class UserPost(db.Model):

    owner    = db.ReferenceProperty(TalkyUser, collection_name='posts')
    dateTime = db.DateTimeProperty(auto_now_add=True)
    content  = db.StringProperty(multiline=True) 
    spot    = db.ReferenceProperty(reference_class=Spot, collection_name='posts')

    '''
    I have no idea why Spot doesn't have posts property?
    This problem waste one all day.
    So I decided add a spotName temporally for later query.
    '''
    spotName = db.StringProperty()

    image = db.BlobProperty()
   
    imageDesciption = db.StringProperty()

    goods = db.IntegerProperty()

    bads = db.IntegerProperty()

    anonymous = db.BooleanProperty()

    """
    implicity properties
    replies:<collection of PostReply>
    """
