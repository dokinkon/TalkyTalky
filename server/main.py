#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

from google.appengine.ext import db  
from django.utils import simplejson

import room
import logging

#class Room(db.Model):   
    #name = db.StringProperty(required=True)   
    #location = db.GeoPtProperty(required=True)
    #long = db.FloatProperty(required=True)
    #lat  = db.FloatProperty(required=True)

    #Using user_key_valu 
    #user_id = db.IntegerProperty(required=True)   
    

class MainHandler(webapp.RequestHandler):
    def get(self):
        
        self.response.out.write('Hello World!')

class Get_room(webapp.RequestHandler):
    def get(self): 
        
        logging.debug('[GET]Start recieve HTTP request')
        #Get Data from HTTP request

        #logging.debug(self.request)
        room_long = float(self.request.get('longitude', default_value='0'))
        room_lat  = float(self.request.get('latitude', default_value='0'))
        
        my_room = models.Room.query(lat=room_lat, 
                                    lon=room_lon, 
                                    max_results=2, min_params=(2,0))


        '''       
        params = self.request.arguments()
        for p in params:
            self.response.out.write(self.request.get(p))
            #logging.debug(p)
            #logging.debug(self.request.get(p))

        '''
        print room_long
        print room_lat

        '''
        logging.debug('[GET]Query GAE DB')
        #Query DB
        data = db.GqlQuery('WHERE ', room_long, room_lat)

        logging.debug('[GET]Transfer to JSON GAE DB')
        #Return JSON object
        self.response.headers['Content-Type'] = 'application/json'
        output = simplejson.dump(data)
        
        self.response.out.write(output)
        ''' 
    def post(self): 
        
        logging.debug('[POST]Start recieve HTTP request')
        #Get Data from HTTP request
        params = self.request.arguments()
        for p in params:
            self.response.out.write(self.request.get(p))
            logging.debug(p)
            logging.debug(self.request.get(p))


        logging.debug("test0")
        logging.debug("test0")
       
        logging.debug(self.request)

        room_long = self.request.get('longitude')
        room_lat = self.request.get('latitude')
       
        logging.debug("test1" + str(room_long))
        logging.debug("test1" + str(room_lat))
        
        logging.debug('[POST]Query GAE DB')
        
        '''
        #Query DB
        data = db.GqlQuery('WHERE ', room_long, room_lat)

        logging.debug('[POST]Transfer to JSON GAE DB')
        #Return JSON object
        self.response.headers['Content-Type'] = 'application/json'
        output = simplejson.dump(data)
        
        self.response.out.write(output)
        ''' 
class Record_room(webapp.RequestHandler): 
    def get(self):
     
        #Write data into DB
        #room_obj = room.Room()
        #room_obj.name = 'Edward'
        #room_obj.location = db.GeoPt(lat=25, lon=121)
        room_obj = room.Room()
        room_obj.name = 'Edward'
        room_obj.location = db.GeoPt(lat=25.00058364868164, lon=121.5192642211914)
        room_obj.put()
        '''
        r_key = room_obj.key()
        #print room_obj.name
        #print room_obj.location
        r = db.get(r_key)
        print r.name
        print r.location
        '''

class Query_room(webapp.RequestHandler): 
    def get(self):
         
        query = db.Query(room.Room)  
        #query = Room.all()
        
        for msg in query:
            self.response.out.write('<b>%s</b> wrote:<br>' % msg.name)
            self.response.out.write('<b>%s</b> wrote:<br>' % msg.location)
 
def main():
    sitemap=[('/',MainHandler),
             ('/room',Record_room),   
             ('/q-room',Query_room),   
             ('/get-room-list',Get_room)]
    
    application = webapp.WSGIApplication(sitemap,debug=True)

    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
