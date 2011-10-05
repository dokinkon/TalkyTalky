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
import userpost
import json

from django.utils import simplejson

from createspot import CreateSpotHandler


class MainHandler(webapp.RequestHandler):
    def get(self):
        
        self.response.out.write('Hello World!')


class GetPostHandler(webapp.RequestHandler):

    """

    Handle GetPostRequest, return posts in some spot.

    """

    def get(self):
        self.impl()

    def post(self):
        logging.info('WARNING: calling post in GetPostHandler (Maybe a bug from Titanium)')
        self.impl()

    def impl(self):

        logging.info('GetPostHandler...')

        request = simplejson.loads(self.request.body)
        
        spotName = request['spot-name']

        query = db.Query(userpost.UserPost)

        query.filter('spotName = ', spotName)

        results = query.fetch(limit=10)

        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.out.write(json.encode(results))


class CreatePostHandler(webapp.RequestHandler):
    """
    Handle User post actions
    """

    def post(self):

        postDict = simplejson.loads(self.request.body)

        logging.info('Handling UserPost Request...')
        
        spotName = postDict['spotName']
        content  = postDict['content']

        logging.info('spotName = %s', spotName)
        logging.info('content  = %s', content)


        # Find Spot Model by name
        spotQuery = db.Query(models.Spot)
        spotQuery.filter("name =", spotName)

        result = spotQuery.fetch(limit=1)

        logging.info('result = %s', result)


        # create a UserPost object
        userPost = userpost.UserPost(spotName=spotName)
        userPost.content = content
        key = userPost.put()

        spot = result[0]
        spot.userPosts.append(key)
        spot.put()

        response = {'result':True}
        
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.out.write(simplejson.dumps(response))


class Get_spot(webapp.RequestHandler):

    def getSpot(self):

        """
        Because Titanium can't send 'GET' request normally,
        I decided to wrap getSpot function and let get and post to call it directly
        """

        #logging.info('request = %s', self.request)
        logging.info('url = %s', self.request.url)
        logging.info('body = %s', self.request.body)

        queryDict = simplejson.loads(self.request.body)

        lon = queryDict['lon']
        lat = queryDict['lat']

        logging.info('Receive GetSpot Request. lon = %s, lat = %s', lon, lat)
        
        spots = models.Spot.query(lat=lat, lon=lon, max_results=2, min_params=(2,0))

        spotList = [];

        for distance, spot in spots:
            spotList.append({'name':spot.name})




        """
        spotInfo = spots[0]
        distance = spotInfo[0]
        spot = spotInfo[1]
        
        logging.info('spot = %s', spot)
        logging.info('distance = %s', distance)
        

        data = json.encode(spot)

        logging.info('encoded data = %s', data)
        """
        
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        #self.response.out.write(data)
        self.response.out.write(simplejson.dumps(spotList))

    def get(self): 

        """
        25.040846 121.525396
        127.0.0.1:8084/get-spot-list?lat=25.040846&lon=121.525396
        """

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

        data = json.encode(my_spots)
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.out.write(data)

        """
        for distance, store in my_spots:
            self.response.out.write(store.name)
            self.response.out.write(store.location)
        """
            

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
        self.getSpot()
        

class Record_spot(webapp.RequestHandler): 

    """
    25.040846 121.525396

    
    127.0.0.1:8084/spot?name=department-store&description=description&lat=25.040846&lon=121.525396
    127.0.0.1:8084/spot?name=rent-place&description=description&lat=25.000197&lon=121.520215

    """
    def get(self):
     
        name = unicode(self.request.get('name'))

        logging.info(name)
        description = self.request.get('description')
        lat = float(self.request.get('lat'))
        lon = float(self.request.get('lon'))
        
        print name.encode('utf-8')
        print description
        print lat
        print lon

        new_spot = models.Spot.add(name=name,lat=lat, lon=lon, description=description)
        self.response.out.write('done')


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
             ('/get-spot-list',Get_spot),
             ('/create-spot', CreateSpotHandler),
             ('/create-post', CreatePostHandler),
             ('/get-post-list', GetPostHandler)]
    
    application = webapp.WSGIApplication(sitemap,debug=True)

    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
