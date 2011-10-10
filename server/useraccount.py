
from google.appengine.ext import db
from models import Spot



class CheckinMeta(db.Model):
    spot = db.ReferenceProperty(Spot)
    count = db.IntegerProperty()
    lastTime = db.DateTimeProperty()


class UserAccount(db.Model):
    checkInMetas = db.ListProperty(db.Key)
    userId = db.StringProperty(required=True)
    where = db.ReferenceProperty()













































