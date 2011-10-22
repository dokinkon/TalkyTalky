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
import json

import spot
#from spot import Spot
from userpost import UserPost
from useraccount import UserAccount

from talkyuser import TalkyUser

from django.utils import simplejson

from createspot import CreateSpotHandler

def responseWithError(self, errorMessage):
    response = {status:False, reason:errorMessage}
    self.response.out.write(simplejson.dumps(response))

class MainHandler(webapp.RequestHandler):
    def get(self):
        self.response.out.write('Hello World!')

#Protocol 0001
class LoginHandler(webapp.RequestHandler):
    
    '''
    http:<app-url>/login
    '''
    
    def post(self):
        
        logging.info('LoginHandler...')
        request = simplejson.loads(self.request.body)
        
        uid = request['fb_uid']

        if uid == None:
            self.responseWithError('uid field is required')
            return

        #Get Talkyuser object if it exists or create new one
        query = TalkyUser.all()
        query.filter('fb_uid = ', uid)
        userAccount = query.get()

        if userAccount == None:
            logging.info('get result')
            #userAccount = TalkyUser(uid)
            userAccount = TalkyUser()
            userAccount.fb_uid = uid
            userAccount.put()
            logging.info('Create an UserAccoun TalkyUser for fb_string %s...', uid)
        
        key = userAccount.key()
        tid = key.id()

        response = {'success':True, 'talky_uid':tid}

        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.out.write(simplejson.dumps(response))

        

class CheckinHandler(webapp.RequestHandler):

    def responseWithError(self, errorMessage):
        response = {status:False, reason:errorMessage}
        self.response.out.write(simplejson.dumps(response))

    '''
    http:<app-url>/check-in?uid=<facebook uid>&where=<spot-name>
    '''
    def get(self):
        uid = self.request.get('uid')

        if uid == None:
            self.responseWithError('uid field is required')
            return

        spotName = self.request.get('spot-name')

        if spotName == None:
            self.responseWithError('spot-name is required')
            return

        query = UserAccount.all()
        query.filter('userId = ', uid)
        userAccount = query.get()

        if userAccount == None:
            userAccount = UserAccount(uid)
            userAccount.put()
            logging.info('Create an UserAccount for %s...', uid)
        



class DeletePostsHandler(webapp.RequestHandler):
    def get(self):
        spotName = unicode(self.request.get('spot-name'))

        query = UserPost.all()
        query.filter('spotName = ', spotName)

        results = query.fetch(limit=1000)
        for result in results:
            result.delete()

        self.response.out.write('Done')

class GetPostHandler(webapp.RequestHandler):

    """

    Handle GetPostRequest, return posts in some spot.

    """
    def post(self):
        logging.info('GetPostHandler...')

        request = simplejson.loads(self.request.body)
        
        spotName = request['spot-name']
        
        logging.info('spotName = %s', spotName);

        query = db.Query(UserPost)

        query.filter('spotName = ', spotName)
        #TODO Time sorting
        results = query.fetch(limit=10)

        posts = []

        for result in results:
            posts.append({'userId':result.userId, 'content':result.content})
            
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.out.write(simplejson.dumps(posts))


class CreatePostHandler(webapp.RequestHandler):
    """
    Handle User post actions

    TODO : error handling
    """

    def post(self):

        postDict = simplejson.loads(self.request.body)

        logging.info('Handling UserPost Request...')
        
        userId   = postDict['userId']
        spotName = postDict['spotName']
        content  = postDict['content']

        logging.info('userId = %s', userId)
        logging.info('spotName = %s', spotName)
        logging.info('content  = %s', content)


        # Find Spot Model by name
        spotQuery = db.Query(spot.Spot)
        spotQuery.filter("name =", spotName)

        result = spotQuery.fetch(limit=1)

        logging.info('result = %s', result)


        # create a UserPost object
        userPost = UserPost(userId=userId, spotName=spotName)
        userPost.content = content
        key = userPost.put()

        spot = result[0]
        spot.userPosts.append(key)
        spot.put()

        response = {'result':True}
        
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.out.write(simplejson.dumps(response))

class GetImageHandler(webapp.RequestHandler):

    #Handle GetImageRequest, return image in some spot.
    def get(self):
        self.impl()

    def post(self):
        logging.info('WARNING: calling post in GetImageHandler (Maybe a bug from Titanium)')
        self.impl()

    def impl(self):
        pic = db.get(self.request.get("img_id"))  

        if pic.picture:  
            self.response.headers['Content-Type'] = "image/png" 
            self.response.out.write(obj.picture)   

        
class CreateImageHandler(webapp.RequestHandler):

    #Handle CreateImageRequest, return image in some spot.
    def get(self):
        self.impl()

    def post(self):
        logging.info('WARNING: calling post in CreateImageHandler (Maybe a bug from Titanium)')
        self.impl()

    def impl(self):

        postDict = simplejson.loads(self.request.body)

        logging.info('Handling UserPost Request...')
        

        pic = Image()
        pic.name = postDict['name']
        content  = postDict['content']
 

        # Check if the image upload  
        # if yes, assign pic's content to obj's member 
        if self.request.get('picture'):  
            pic.picture = self.request.get('picture')  
 
        #Write into DB
        pic.put 



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
        
        uid = queryDict['uid']
        lon = queryDict['lon']
        lat = queryDict['lat']

        logging.info('Receive GetSpot Request. lon = %s, lat = %s', lon, lat)
        
        spots = spot.Spot.query(lat=lat, lon=lon, max_results=2, min_params=(2,0))

        spotList = [];

        #need to check users:{spot.users} 
        for distance, spot in spots:
            #spotList.append({'name':spot.name, 'description':spot.description, users:{spot.users} })
            spotList.append({'name':spot.name, 'description':spot.description})

        
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.out.write(simplejson.dumps(spotList))

    def get(self): 
        self.getSpot()


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

        new_spot = spot.Spot.add(name=name,lat=lat, lon=lon, description=description)
        self.response.out.write('done')


class Query_spot(webapp.RequestHandler): 
    def get(self):
         
        query = db.Query(spot.Spot)  
        #query = Spot.all()
        
        for msg in query:
            self.response.out.write('<b>%s</b> wrote:<br>' % msg.name)
            self.response.out.write('<b>%s</b> wrote:<br>' % msg.description)
            self.response.out.write('<b>%s</b> wrote:<br>' % msg.geoboxes)
            self.response.out.write('<b>%s</b> wrote:<br>' % msg.location)
 
def main():
    sitemap=[('/',MainHandler),
             ('/login', LoginHandler), 
             ('/create-pic', CreateImageHandler), 
             ('/img', GetImageHandler),
             ('/spot',Record_spot),   
             ('/q-spot',Query_spot),   
             ('/get-spot-list',Get_spot),
             ('/create-spot', CreateSpotHandler),
             ('/create-post', CreatePostHandler),
             ('/get-post-list', GetPostHandler),
             ('/del-posts', DeletePostsHandler),
             ('/check-in', CheckinHandler)]
    
    application = webapp.WSGIApplication(sitemap,debug=True)

    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
