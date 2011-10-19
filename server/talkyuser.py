
from google.appengine.ext import db
from spot import Spot


class TalkyUser(db.Model):
    #Facebook uid
    uid = db.StringProperty()

    #Indicate where am I
    spot = db.ReferenceProperty(reference_class=Spot, collection_name='users')
    """
    #implicity properties
    posts:<collection of UserPost>
    replies:<collection of PostReply>
    outgoingMessages:<collection of Message>
    incomingMessages:<collection of Message>
    outgoingFriendshipRequest:<collection of FriendshipRequest>
    pendingFrinedshipRequest:<collection of FriendshipRequest>
    """
    #TODO
    #User Pereference...
    def __init__(self, uid):
        self.uid = uid
    def get_uid(self):
        return self.uid
