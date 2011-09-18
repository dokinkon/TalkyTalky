#!/usr/bin/env python
from google.appengine.ext import db 

class Room(db.Model):   
    name = db.StringProperty()   
    location = db.GeoPtProperty()

