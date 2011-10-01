
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
        //client.setRequestHeader("Connection", "close");

        client.onreadystatechange = function() {
            
            //Ti.API.info("onreadystatechange = " + client.readyState + " status = " + client.status);
            
            if (client.readyState==4 && client.status == 200)
            {
                Ti.API.info("Got Response1:" + client.responseText);
                
                var r = JSON.parse(client.responseText);
                Ti.API.info('resp = ' + r);
                
                var response = nil;
                try
                {
                    Ti.API.info('1');
                    response = JSON.parse(client.responseText);
                }
                catch (e)
                {
                    Ti.API.info('2');
                    response = client.responseText;
                }
                
                Ti.API.info('Got Response:' + response);
            }
        };

        client.send(body);
    });// Ti.Geolocation.getCurrentPosition(function(e)


});



























