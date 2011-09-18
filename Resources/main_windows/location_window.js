
var locationWindow = Ti.UI.currentWindow;

var searchBar = Ti.UI.createSearchBar({
	barColor:'#000',
	showCancel:true,
	height:43,
	top:0
});

locationWindow.add(searchBar);



/*
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

        var longitude = e.coords.longitude;
        var latitude  = e.coords.latitude;
        var accuracy  = e.coords.accuracy;

        Ti.API.info('long:' + longitude + ' lat:' + latitude + ' accuracy:' + accuracy);
    });
});
*/


