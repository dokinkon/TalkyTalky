
Ti.include('../talky.js')

Ti.Geolocation.purpose = 'LBS'

var locationWindow = Ti.UI.currentWindow;

Ti.App.addEventListener('querySpotName', function(){
    Ti.App.fireEvent('spotChanged', {spotName:Talky.spotName});
});


var spotData = [];

/**
 * Create a tableView to contain spots
 *
 */

var spotTableView = Ti.UI.createTableView({

    allowsSelection:false,
    height:200,
    top:100,
});


locationWindow.add(spotTableView);






/***
 * A callback when spots available
 *
 * add spot name as tableItem
 *
 * Arg:
 *   spots: a list contains spots
 *
 *
 */
var onSpotsAvailable = function(spots) {

    Ti.API.info("LocationWindow::onSpotAvailable");

    for (var i=0;i<spots.length;i+=1){
        spotData[i] = {title:spots[i].name, hasChild:true};
    }

    spotTableView.setData(spotData);
};




/**
 * A callback when location from mobile device is avalible
 *
 * Arg:
 *  loc.lat // current latitude
 *  loc.lon // current longitude
 *  loc.accuracy // 
 *
 */
var onLocationAvailable = function(loc) {

    // Just use a fix location for testing
    var data = {"lat":25.040846, "lon":121.525396, "accuracy":80};
    var body = JSON.stringify(data);

    var client = Ti.Network.createHTTPClient();

    client.open('GET', Talky.getSpotURL, true);
    client.setRequestHeader("Content-type", "application/json");
    client.setRequestHeader("Content-length", body.length);

    client.onreadystatechange = function() {

        if (client.readyState==4 && client.status == 200)
        {
            Ti.API.info('response = ' + client.responseText);
            var spotList = JSON.parse(client.responseText);

            for (var i=0;i<spotList.length;i+=1)
            {
                Ti.API.info("spotName = " + spotList[i].name);
            }

            onSpotsAvailable(spotList);
        }
    };

    client.send(body);
}







var searchBar = Ti.UI.createSearchBar({
	barColor:'#000',
	showCancel:true,
	height:43,
	top:0
});

locationWindow.add(searchBar);

var relocationButtion = Ti.UI.createButton({
    title:'重新定位',
    top:300,
    width:100,
    left:30
});

locationWindow.add(relocationButtion);


relocationButtion.addEventListener('click', function(){})



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

        onLocationAvailable({lon:e.coords.longitude, lat:e.coords.latitude, accuracy:e.coords.accuracy});

    });// Ti.Geolocation.getCurrentPosition(function(e)


});



























