
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

import models






class CreateSpotHandler(webapp.RequestHandler):
    def get(self):
        self.response.out.write("""
            <html>
                <body>
                    <form action="/create-spot" method="post">
                        <div>Name:<textarea name="name" rows="1" cols="20"></textarea></div>
                        <div>Longitude:<textarea name="lon" rows="1" cols="20"></textarea></div>
                        <div>Latitude:<textarea name="lat" rows="1" cols="20"></textarea></div>
                        <div><input type="submit" value="submit"></div>
                    <form>
                </body>
            <html>""")

    def post(self):

        name = self.request.get('name', 'spotname-is-missing')
        lon = float(self.request.get('lon', '0'))
        lat = float(self.request.get('lat', '0'))
        description = self.request.get('description')

        models.Spot.add(name=name,lat=lat, lon=lon, description=description)
        self.response.out.write('done')























