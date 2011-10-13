
Ti.include('../talky.js')

Ti.Geolocation.purpose = 'Talky';
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;


// set layout
//

var Layout854x480 = 
{
    searchBar:
    {
        height:80
    },
    spotTableView:
    {
        top:80,
        height:500,
    },
}


var Layout480x320 = 
{
    searchBar:
    {
        height:40
    },
    spotTableView:
    {
        top:40,
        height:300,
    },
}


var Layout = {};

if (Ti.App.SCREEN_WIDTH===320 && Ti.App.SCREEN_HEIGHT===480)
{
    Layout = Layout480x320;
    Ti.API.info('layout = 480x320');
}
else if (Ti.App.SCREEN_WIDTH===480 && Ti.App.SCREEN_HEIGHT===854)
{
    Layout = Layout854x480;
    Ti.API.info('layout = 854x480');
}




function translateErrorCode(code) {
	if (code == null) {
		return null;
	}
	switch (code) {
		case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
			return "Location unknown";
		case Ti.Geolocation.ERROR_DENIED:
			return "Access denied";
		case Ti.Geolocation.ERROR_NETWORK:
			return "Network error";
		case Ti.Geolocation.ERROR_HEADING_FAILURE:
			return "Failure to detect heading";
		case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
			return "Region monitoring access denied";
		case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
			return "Region monitoring access failure";
		case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
			return "Region monitoring setup delayed";
	}
}



var currentWindow = Ti.UI.currentWindow;


var activityIndicator = Ti.UI.createActivityIndicator({
    message:'Loading...',
});


Ti.App.addEventListener('querySpotName', function(){
    Ti.App.fireEvent('spotChanged', {spotName:Talky.spotName});
});



if (Ti.Platform.name == 'android') {
}







var spotData = [];

/**
 * Create a tableView to contain spots
 *
 */

var spotTableView = Ti.UI.createTableView({

    allowsselection:false,
    height:Layout.spotTableView.height,
    top:Layout.spotTableView.top,
});

var latitudeLabel = Ti.UI.createLabel({
    text:'latitude',
    top:250,
    width:150,
    left:5,
    font:{fontSize:11},
	color:'#444',
	left:10,
	height:15,
});

var longitudeLabel = Ti.UI.createLabel({
    top:250,
    text:'longitude',
    width:150,
    font:{fontSize:11},
	color:'#444',
    height:15,
    right:5,
});

var statusLabel = Ti.UI.createLabel({
    top:270,
    left:10,
    font:{fontSize:11},
    color:'#222',
    height:15,
    width:400,
});


currentWindow.add(latitudeLabel);
currentWindow.add(longitudeLabel);
currentWindow.add(statusLabel);


currentWindow.add(spotTableView);

spotTableView.addEventListener('click', function(e) {

    // Save current Spot to App.Properties
    Ti.App.Properties.setString('current-spot', e.rowData.title);

    var win = Ti.UI.createWindow({
        url:'spot-window.js',
        title:e.rowData.title,
    });

    Ti.UI.currentTab.open(win, {animated:true});
});



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
    statusLabel.text = 'Spots Available Now';

    for (var i=0;i<spots.length;i+=1){
        spotData[i] = {title:spots[i].name, hasChild:true};
    }

    spotTableView.setData(spotData);
    activityIndicator.hide();
};




/**
 * A callback when location from mobile device is avalible
 *
 * Arg:
 *
 */
var onLocationAvailable = function(e) {

    if (!e.success || e.error)
    {
        alert('error:' + e.error.message + '. ' + translateErrorCode(e.error.code));
        return;
    }


    Ti.API.info("location available:" + e.coords.latitude + ", " + e.coords.longitude);
    latitudeLabel.text = e.coords.latitude;
    longitudeLabel.text = e.coords.longitude;

    var data = {"lat":e.coords.latitude, "lon":e.coords.longitude, "accuracy":e.coords.accuracy};
    var body = JSON.stringify(data);

    var client = Ti.Network.createHTTPClient();

    client.open('POST', Talky.getSpotURL, true);
    client.setRequestHeader("Content-type", "application/json");
    client.setTimeout(1000);

    client.onload = function() {

        Ti.API.info('response = ' + client.responseText);
        var spotList = JSON.parse(client.responseText);
        statusLabel.text = 'Received Response';

        for (var i=0;i<spotList.length;i+=1)
        {
            Ti.API.info("spotName = " + spotList[i].name);
        }

        onSpotsAvailable(spotList);
    };


    client.onerror = function(e) {
        activityIndicator.hide();
        Ti.API.info('onerror: ' + body);
        alert(e.error);

    };

    client.send(body);
    statusLabel.text = 'Just Send Request:' + Talky.getSpotURL;
}


Ti.Geolocation.addEventListener('location', onLocationAvailable);





var searchBar = Ti.UI.createSearchBar({
	barColor:'#000',
	showCancel:true,
	top:0,
    height:Layout.searchBar.height,
});

currentWindow.add(searchBar);





var requestGeolocation = function() {

    activityIndicator.show();


    if (Ti.Geolocation.locationServicesEnabled === false)
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


    Ti.Geolocation.getCurrentPosition(onLocationAvailable);

};


currentWindow.addEventListener('open', function() {

    var width  = Ti.Platform.displayCaps.platformWidth;
    var height = Ti.Platform.displayCaps.platformHeight;
    Ti.API.info('scree width = ' + width);
    Ti.API.info('scree height = ' + height);

    requestGeolocation();
});

var relocationButtion = Ti.UI.createButton({
    title:'重新定位',
    top:300,
    width:100,
    left:30
});

currentWindow.add(relocationButtion);
relocationButtion.addEventListener('click', requestGeolocation);



























