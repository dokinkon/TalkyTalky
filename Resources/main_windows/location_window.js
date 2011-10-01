
Ti.Geolocation.purpose = 'LBS'

var locationWindow = Ti.UI.currentWindow;

var searchBar = Ti.UI.createSearchBar({
	barColor:'#000',
	showCancel:true,
	height:43,
	top:0
});

locationWindow.add(searchBar);



locationWindow.addEventListener('open', function()
{
    Ti.API.log('open event');
    // query current position from device...

    if (Ti.Geolocation.locationServicesEnabled == false)
    {
        Ti.UI.createAlertDialog({title:'Talky-Talky', message:'Your device has geo turned off'}).show();
    }
    else
    {
        if (Ti.Platform.name != 'android')
        {
            var authorization = Ti.Geolocation.locationServicesAuthorization;
            Ti.API.info('Authorization: ' + authorization);
            if (authorization == Ti.Geolocation.AUTHORIZATION_DENIED)
            {
                Ti.UI.createAlertDialog({
                    title:'Talky-Talky',
                    message:'You have disallowed Titanium from running geolocation service'
                }).show();
            }
            else if (authorization == Ti.Geolocation.AUTHORIZATION_RESTRICTED)
            {
                Ti.UI.createAlertDialog({
                    title:'Talky-Talky',
                    message:'Your system has disallowed Titanium from running geolocation service'
                }).show();
            }
        }
    }

    Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;

    Ti.Geolocation.getCurrentPosition(function(e)
    {
        if (!e.success || e.error)
        {
            alert('error ' + JSON.stringify(e.error));
            return;
        }

        var lon = e.coords.longitude;
        var lat = e.coords.latitude;
        var accuracy = e.coords.accuracy;

        Ti.API.info('long:' + lon + ' lat:' + lat + ' accuracy:' + accuracy);

        var data = {"lat":25.040846, "lon":121.525396, "accuracy":80};
        var body = JSON.stringify(data);

        var client = Ti.Network.createHTTPClient();

        //var url = 'http://lets-talky-talky.appspot.com/get-room-list';
        var url = 'http://127.0.0.1:8084/get-spot-list';
        client.open('GET', url, true);
        client.setRequestHeader("Content-type", "application/json");
        client.setRequestHeader("Content-length", body.length);

        client.onreadystatechange = function() {
            
            if (client.readyState==4 && client.status == 200)
            {
                Ti.API.info('response = ' + client.responseText);
                var spot = JSON.parse(client.responseText);

                //Ti.API.info('spot = ', spot);
                Ti.API.info('name = ' + spot.name);
                Ti.API.info('latitude = ' + spot.location.lat);
                Ti.API.info('longitude = ' + spot.location.lon);
            }
        };

        client.send(body);
    });// Ti.Geolocation.getCurrentPosition(function(e)


});



























