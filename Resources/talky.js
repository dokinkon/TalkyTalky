





var Talky = {
    version:"v0.0.1",
    author:["chao-chih.lin", "wei-cheng.liu"],
    copyright:"",
    sharingWithPhoto:true,
    spotName:"unknown",
    //getSpotURL:   'http://lets-talky-talky.appspot.com/get-spot-list',
    //createPostURL:'http://lets-talky-talky.appspot.com/create-post',
    //getPostsURL:  'http://lets-talky-talky.appspot.com/get-post-list',
    loginURL:'http://127.0.0.1:8084/login',
    getSpotURL:'http://127.0.0.1:8084/get-spot-list',
    createPostURL:'http://127.0.0.1:8084/create-post',
    getPostsURL:'http://127.0.0.1:8084/get-post-list',
    sendImageURL:'http://127.0.0.1:8084/send-image',
    locationTabIndex:0,
};

// Query Screen Size
var width  = Ti.Platform.displayCaps.platformWidth;
var height = Ti.Platform.displayCaps.platformHeight;
Ti.App.SCREEN_WIDTH  = (width > height) ? height : width;
Ti.App.SCREEN_HEIGHT = (width > height) ? width : height;


Talky.login = function(callback) {

    var xhr = Ti.Network.createHTTPClient();

    var data = 
    {
        fb_uid:Ti.Facebook.uid
    };

    xhr.open('POST', Talky.loginURL, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setTimeout(1000);

    xhr.onload = function() {

        Ti.API.info('response = ' + xhr.responseText);
        var response = JSON.parse(xhr.responseText);

        if (!response.success)
        {
            alert(response.error);
            return;
        }

        Ti.API.info('login successful');
        Ti.App.Properties.setString('talky_uid',response.talky_uid);
    };

    xhr.onerror = function(e){
        alert(e.error);
    };

    Ti.API.info(JSON.stringify(data));

    xhr.send(JSON.stringify(data));
}





















