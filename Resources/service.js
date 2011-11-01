
(function(){

    talky.service = {
        appURLForAndroidEmu:'http://10.0.2.2:8084',
        appURLForAppleEmu:'http://127.0.0.1:8084',
        appURL:function() {
            return 'http://lets-talky-talky.appspot.com';
            //return Talky.appURLForAndroidEmu
            //return Talky.appURLForAppleEmu;
        },
        loginURL:function() {
            return talky.service.appURL() +'/login';
        },
    };


    talky.service.login = function(callbacks){

        var xhr = Ti.Network.createHTTPClient();
        var data = {
            fb_uid:Ti.Facebook.uid
        };

        //Ti.API.info('loginURL = ' + Talky.loginURL());

        xhr.open('POST', talky.service.loginURL(), true);
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
    };

})()
