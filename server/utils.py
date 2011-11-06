
def dateTimeToInterchangeable(datetime):
    interchangeable = {
        'year'  :datetime.year,
        'month' :datetime.month,
        'date'  :datetime.day,
        'hour'  :datetime.hour,
        'minute':datetime.minute,
        'second':datetime.second
    }
    return interchangeable;
