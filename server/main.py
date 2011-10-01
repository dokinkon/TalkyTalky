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

import logging
import models


class MainHandler(webapp.RequestHandler):
    def get(self):
        
        self.response.out.write('Hello World!')

class Get_spot(webapp.RequestHandler):
    def get(self): 
        
        logging.debug('[GET]Start recieve HTTP request')
        #Get Data from HTTP request

        #logging.debug(self.request)
        spot_lon  = float(self.request.get('lon', default_value='0'))
        spot_lat  = float(self.request.get('lat', default_value='0'))
        
        print spot_lon
        print spot_lat

        my_spots = models.Spot.query(lat=spot_lat, 
                                    lon=spot_lon, 
                                    max_results=2, min_params=(2,0))
        print my_spots
        for distance, store in my_spots:
            self.response.out.write(store.name)

        '''
        logging.debug('[GET]Query GAE DB')
        #Query DB
        data = db.GqlQuery('WHERE ', spot_long, spot_lat)

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

        spot_long = self.request.get('longitude')
        spot_lat = self.request.get('latitude')
       
        logging.debug("test1" + str(spot_long))
        logging.debug("test1" + str(spot_lat))
        
        logging.debug('[POST]Query GAE DB')
        
        '''
        #Query DB
        data = db.GqlQuery('WHERE ', spot_long, spot_lat)

        logging.debug('[POST]Transfer to JSON GAE DB')
        #Return JSON object
        self.response.headers['Content-Type'] = 'application/json'
        output = simplejson.dump(data)
        
        self.response.out.write(output)
        ''' 
class Record_spot(webapp.RequestHandler): 
    def get(self):
     
        name = self.request.get('name')
        logging.info(name)
        description = self.request.get('description')
        lat = float(self.request.get('lat'))
        lon = float(self.request.get('lon'))
        
        print name
        print description
        print lat
        print lon


        new_spot = models.Spot.add(name=name,lat=lat, lon=lon, description=description)
        self.response.out.write('done')

        '''
        spot_obj = spot.Spot()
        spot_obj.name = 'Edward'
        spot_obj.location = db.GeoPt(lat=25.00058364868164, lon=121.5192642211914)
        spot_obj.put()
        
        r_key = spot_obj.key()
        #print spot_obj.name
        #print spot_obj.location
        r = db.get(r_key)
        print r.name
        print r.location
        '''



class Query_spot(webapp.RequestHandler): 
    def get(self):
         
        query = db.Query(models.Spot)  
        #query = Spot.all()
        
        for msg in query:
            self.response.out.write('<b>%s</b> wrote:<br>' % msg.name)
            self.response.out.write('<b>%s</b> wrote:<br>' % msg.description)
            self.response.out.write('<b>%s</b> wrote:<br>' % msg.geoboxes)
            self.response.out.write('<b>%s</b> wrote:<br>' % msg.location)
 
def main():
    sitemap=[('/',MainHandler),
             ('/spot',Record_spot),   
             ('/q-spot',Query_spot),   
             ('/get-spot-list',Get_spot)]
    
    application = webapp.WSGIApplication(sitemap,debug=True)

    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
