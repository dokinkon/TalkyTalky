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

from spot import Spot
from useraccount import UserAccount
from talkyuser import TalkyUser

from userpost import UserPost
from userpost import TestModel
from createspot import CreateSpotHandler

def responseWithError(out, errorMessage):
    response = {'success':False, 'error':errorMessage}
    out.write(simplejson.dumps(response))

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
            responseWithError(self.response.out, 'uid field is required')
            return

        #Get Talkyuser object if it exists or create new one
        query = TalkyUser.all()
        query.filter('fb_uid = ', uid)
        
        if query.count() > 1 : 
            responseWithError(self.response.out, 'Query fb user\'s number > 1')
            return

        userAccount = query.get()

        if userAccount == None:
            logging.info('get result')
            userAccount = TalkyUser(fb_uid = uid)
            userAccount.put()
            logging.info('Create an UserAccoun TalkyUser for fb_string %s...', uid)
        key = userAccount.key()
        tid = key.id()

        response = {'success':True, 'talky_uid':tid}

        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.out.write(simplejson.dumps(response))

class LogoutHandler(webapp.RequestHandler):
    def post(self):
        self.response.out.write('TODO')


class CheckinHandler(webapp.RequestHandler):

    '''
    url:<app-url>/checkin
    '''
    
    def post(self):
        
        logging.info('CheckinHandler...')
        request = simplejson.loads(self.request.body)
        
        talky_uid = int(request['talky_uid'])
        spot_id   = int(request['spot_id'])

        user = TalkyUser.get_by_id(talky_uid)
        spot = Spot.get_by_id(spot_id)
        
        user.spot = spot.key()
        user.put()

        response = {
            'success':True,
            'checkin_times':1,
            'user_list':[]
        }

        self.response.out.write(simplejson.dumps(response))
        logging.info('CHECK-IN ... OK')


class CheckoutHandler(webapp.RequestHandler):
    def post(self):
        self.response.out.write('TODO')
        

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
        talky_uid = int(request['talky_uid'])
        user = TalkyUser.get_by_id(talky_uid)
        if user == None:
            logging.info('user is None')

        logging.info(user.spot.name)

        if user.spot == None:
            logging.info('user.spot is None')

        query = UserPost.all()
        query.filter('spotName = ', user.spot.name)
        posts = query.fetch(limit = 10)

        response = {
            'success':True,
            'posts':[]
        }

        for post in posts:
            postData = {
                'owner':post.owner.fb_uid,
                #'date_time':post.dateTime, <--- JSON can't serializable'
                'content':post.content,
            }
            response['posts'].append(postData)
        self.response.out.write(simplejson.dumps(response))


class CreatePostHandler(webapp.RequestHandler):
    """
    Handle User post actions
    TODO : error handling
    """

    def post(self):

        logging.info('CreatePostHandler...')
        request = simplejson.loads(self.request.body)

        talky_uid = int(request['talky_uid'])
        user = TalkyUser.get_by_id(talky_uid)

        content = request['content']

        post = UserPost(content=content, owner=user, spot=user.spot.key())
        post.spotName = user.spot.name;
        key = post.put()

        response = {
            'success':True,
            'post_id':key.id()
        }

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


#protocol 0002
class Get_spot(webapp.RequestHandler):

    def post(self):

        '''
        #logging.info('request = %s', self.request)
        logging.info('url = %s', self.request.url)
        logging.info('body = %s', self.request.body)
        '''
        queryDict = simplejson.loads(self.request.body)
        
        uid = queryDict['talky_uid']
        lon = queryDict['lon']
        lat = queryDict['lat']

        #logging.info('Receive GetSpot Request. lon = %s, lat = %s', lon, lat)
        
        spots = Spot.query(lat=lat, lon=lon, max_results=2, min_params=(2,0))

        spotList = [];

        for distance, spot in spots:
            user_num = spot.users.count()
            spotList.append({'id':spot.key().id(), 'name':spot.name, 'description':spot.description,'user_num':user_num})

        response = {'success':True, 'spots':spotList }

        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.out.write(simplejson.dumps(response))
 

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

        new_spot = Spot.add(name=name,lat=lat, lon=lon, description=description)
        self.response.out.write('done')


class Query_spot(webapp.RequestHandler): 
    def get(self):
         
        query = db.Query(Spot)  
        #query = Spot.all()
        
        for msg in query:
            self.response.out.write('<b>%s</b> wrote:<br>' % msg.name)
            self.response.out.write('<b>%s</b> wrote:<br>' % msg.description)
            self.response.out.write('<b>%s</b> wrote:<br>' % msg.geoboxes)
            self.response.out.write('<b>%s</b> wrote:<br>' % msg.location)
 
def main():
    sitemap=[('/',MainHandler),
             ('/login', LoginHandler), 
             ('/logout', LogoutHandler),
             ('/checkin', CheckinHandler),
             ('/checkout', CheckoutHandler),
             ('/get-post-list', GetPostHandler),
             ('/create-pic', CreateImageHandler), 
             ('/img', GetImageHandler),
             ('/spot',Record_spot),   
             ('/q-spot',Query_spot),   
             ('/get-spot-list',Get_spot),
             ('/create-spot', CreateSpotHandler),
             ('/create-post', CreatePostHandler),
             ('/del-posts', DeletePostsHandler)]
    
    application = webapp.WSGIApplication(sitemap,debug=True)

    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
