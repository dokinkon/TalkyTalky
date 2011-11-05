
Ti.Facebook.appid = "280459581967624";
Ti.Facebook.permissions = ['publish_stream', 'read_stream'];
Ti.Geolocation.purpose = 'Talky-Talky';
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;

var talky = {}
talky.version = "v0.0.1";
talky.author = ["chao-chih.lin", "wei-cheng.liu"];
talky.copyright = "Lynx Interactive";
talky.app = {};
talky.app.osname = Titanium.Platform.osname;
talky.app.version = Titanium.Platform.version;


Ti.include('ui.js');
Ti.include('service.js')
Ti.include('data.js')
//Ti.include('talky.js');


talky.ui.appTabGroup.open();

Ti.Facebook.addEventListener('login', function(e) {

    if (e.success) {
        Ti.API.info('login Facebook successful');
        talky.service.login();
    }
    else {
        alert(e.error);
    }
});

// 1. check network connection status.
// 2. request user login to FB
if (!Ti.Network.online) {
    alert('No network connections');
}

if (Ti.Facebook.loggedIn) {
    talky.service.login();
}
else {
    // Login the user and authorize our app
    Ti.Facebook.authorize();
}
























