





var Talky = {
    version:"v0.0.1",
    author:["chao-chih.lin", "wei-cheng.liu"],
    copyright:"",
    sharingWithPhoto:true,
    spotName:"unknown",
    appURLForAndroidEmu:'http://10.0.2.2:8084',
    appURLForAppleEmu:'http://127.0.0.1:8084',
    appURL:function() {
        return 'http://lets-talky-talky.appspot.com';
        //return Talky.appURLForAndroidEmu
        //return Talky.appURLForAppleEmu;
    },
    loginURL:function() {
        return Talky.appURL() +'/login';
    },
    logout:function() {
        return Talky.appURL() +'/logout';
    },
    checkinURL:function() {
        return Talky.appURL() + '/checkin';
    },
    checkoutURL:function() {
        return Talky.appURL() + '/checkout';
    },
    getSpotURL:function() {
        return Talky.appURL() +'/get-spot-list';
    },
    createPostURL:function() {
        return Talky.appURL() + '/create-post';
    },
    getPostsURL:function() {
        return Talky.appURL() + '/get-post-list';
    },
    sendReplyURL:function() {
        return Talky.appURL() + '/reply';
    },
    sendImageURL:'http://10.0.2.2:8084/send-image',
    locationTabIndex:0,
};

// Query Screen Size
var width  = Ti.Platform.displayCaps.platformWidth;
var height = Ti.Platform.displayCaps.platformHeight;
Ti.App.SCREEN_WIDTH  = (width > height) ? height : width;
Ti.App.SCREEN_HEIGHT = (width > height) ? width : height;



/**
 * PROTOCOL - 0001
 *
 **/
Talky.login = function(callback) {

    var xhr = Ti.Network.createHTTPClient();

    var data = 
    {
        fb_uid:Ti.Facebook.uid
    };

    //Ti.API.info('loginURL = ' + Talky.loginURL());

    xhr.open('POST', Talky.loginURL(), true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setTimeout(1000);

    xhr.onload = function() {

        //Ti.API.info('response = ' + xhr.responseText);
        var response = JSON.parse(xhr.responseText);

        if (!response.success) {
            alert(response.error);
            return;
        } else {

            Ti.API.info('login Talky successful. Talky-id is ' + response.talky_uid);
            Ti.App.Properties.setString('talky_uid', response.talky_uid);
        }
    };

    xhr.onerror = function(e){
        alert(e.error);
    };

    //Ti.API.info(JSON.stringify(data));
    xhr.send(JSON.stringify(data));
}



Talky.checkin = function(handler) {

    var requestData = 
    {
        talky_uid :Ti.App.Properties.getString('talky_uid'),
        spot_id   :Ti.App.Properties.getString('spot_id'),
    };

    var xhr = Ti.Network.createHTTPClient();

    xhr.open('POST', Talky.checkinURL(), true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setTimeout(1000);

    xhr.onload = function() {

        //Ti.API.info('response = ' + xhr.responseText);
        var response = JSON.parse(xhr.responseText);

        if (!response.success) {
            alert(response.error);
            return;
        } else {

            Ti.App.Properties.setBool('checkin', true);
            if (handler.onsuccess && typeof handler.onsuccess === 'function') {
                handler.onsuccess();
            }
            //Ti.API.info('login Talky successful. Talky-id is ' + response.talky_uid);
        }
    };

    xhr.onerror = function(e){
        alert(e.error);
    };

    //Ti.API.info(JSON.stringify(data));
    xhr.send(JSON.stringify(requestData));
}





/**
 *
 */
Talky.requestPosts = function(callbacks) {

    var requestData =
    {
        talky_uid : Ti.App.Properties.getString('talky_uid'),
    };

    var xhr = Ti.Network.createHTTPClient();
    xhr.open('POST', Talky.getPostsURL(), true);
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onload = function() {
        Ti.API.info('requestPosts:response = ' + xhr.responseText);
        var response = JSON.parse(xhr.responseText);
        if (!response.success)
        {
            alert(response.error);
            return;
        }

        if (callbacks.onPostsAvailable && typeof callbacks.onPostsAvailable === 'function')
        {
            callbacks.onPostsAvailable(response.posts);
        }
    };

    xhr.onerror = function(e) {
        alert(e.error);
    };

    //Ti.API.info(JSON.stringify(requestData));
    xhr.send(JSON.stringify(requestData));
}


/**
 * args = {
 *  content:<content>,
 *  post_id:<post id>
 *  onReplySuccess:<a callback>
 * }
 *
 *
 *
 */
Talky.sendReply = function(args) {

    var requestData = {
        talky_uid:Ti.App.Properties.getString('talky_uid'),
        post_id:args.post_id,
        content:args.content,
        anonymous:false,
    };

    var xhr = Ti.Network.createHTTPClient();
    xhr.open('POST', Talky.sendReplyURL(), true);
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onload = function() {
        Ti.API.info('sendReply:response = ' + xhr.responseText);
        var response = JSON.parse(xhr.responseText);
        if (!response.success)
        {
            alert(response.error);
            return;
        }

        if (args.onReplySuccess && typeof args.onReplySuccess === 'function')
        {
            args.onReplySuccess(content);
        }
    };

    xhr.onerror = function(e) {
        alert(e.error);
    };

    Ti.API.info('send = '+JSON.stringify(requestData));
    xhr.send(JSON.stringify(requestData));


};















