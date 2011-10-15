import logging
import math
from google.appengine.ext import db
#from google.appengine.ext.db import djangoforms

import geobox
#import userpost

RADIUS = 6378100

GEOBOX_CONFIGS = (
  (4, 5, True),
  (3, 2, True),
  (3, 8, False),
  (3, 16, False),
  (2, 5, False),
)


def _earth_distance(lat1, lon1, lat2, lon2):
  lat1, lon1 = math.radians(float(lat1)), math.radians(float(lon1))
  lat2, lon2 = math.radians(float(lat2)), math.radians(float(lon2))
  return RADIUS * math.acos(math.sin(lat1) * math.sin(lat2) +
      math.cos(lat1) * math.cos(lat2) * math.cos(lon2 - lon1))

class Spot(db.Model):
  name = db.StringProperty()
  description = db.StringProperty()
  location = db.GeoPtProperty()
  geoboxes = db.StringListProperty()

  """
  implicity properties
  users:<collection of TalkyUser>
  posts:<collection of UserPost>

  """ 
    


  @classmethod
  def add(self, **kwargs):
    lat = kwargs.pop('lat')
    lon = kwargs.pop('lon')
    location = db.GeoPt(lat, lon)
    name = kwargs['name']
    new_spot = Spot(name=name, location=location)
    all_boxes = []
    #new_spot.pretty_address = kwargs['address']
    for (resolution, slice, use_set) in GEOBOX_CONFIGS:
      if use_set:
        all_boxes.extend(geobox.compute_set(lat, lon, resolution, slice))
      else:
        all_boxes.append(geobox.compute(lat, lon, resolution, slice))
    new_spot.geoboxes = all_boxes
    
    new_spot.description = kwargs['description']
    print new_spot.geoboxes 
    print new_spot.description 
    new_spot.put()

  @classmethod
  def query(self, lat, lon, max_results, min_params):
    """Queries for Muni stops repeatedly until max results or scope is reached.
    Args:
      system: The transit system to query.
      lat, lon: Coordinates of the agent querying.
      max_results: Maximum number of stops to find.
      min_params: Tuple (resolution, slice) of the minimum resolution to allow.

    Returns:
      List of (distance, MuniStop) tuples, ordered by minimum distance first.
      There will be no duplicates in these results. Distance is in meters.
    """
    # Maps stop_ids to MuniStop instances.
    found_spots = {}

    # Do concentric queries until the max number of results is reached.
    #dow_query_string = _DAY_DICTIONARY[dow] + ' ='
    
    for params in GEOBOX_CONFIGS:
      if len(found_spots) >= max_results:
        break
      if params < min_params:
        break

      resolution, slice, unused = params
      box = geobox.compute(lat, lon, resolution, slice)
      logging.info("Searching for box=%s at resolution=%s, slice=%s",
                    box, resolution, slice)
      query = self.all().filter("geoboxes =", box)
      results = query.fetch(50)
      logging.info("Found %d results", len(results))

      # De-dupe results.
      for result in results:
        if result.name not in found_spots:
          found_spots[result.name] = result

    # Now compute distances and sort by distance.
    spots_by_distance = []
    for spot in found_spots.itervalues():
      distance = _earth_distance(lat, lon, spot.location.lat, spot.location.lon)
      spots_by_distance.append((distance, spot))
    spots_by_distance.sort()

    return spots_by_distance




