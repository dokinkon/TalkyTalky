
(function(){

    //Ti.include('data.js');
    Ti.include('utils.js');

    // talky.service.login 
    // talky.service.checkin 
    // talky.service.requestPostList
    // talky.service.requestSpotList
    // talky.service.requestReplyList
    // talky.service.sendPost
    // talky.service.sendReply
    // talky.service.requestGeolocation
    // talky.service.requestFBNameAndPhoto
    // talky.service.pickImageFromDevice

    talky.service = {
        appURLForAndroidEmu:'http://10.0.2.2:8084',
        appURLForAppleEmu:'http://127.0.0.1:8084',
        appURL:function() {
            //return 'http://lets-talky-talky.appspot.com';
            //return talky.service.appURLForAndroidEmu
            return talky.service.appURLForAppleEmu;
        },
        loginURL:function() {
            return talky.service.appURL() +'/login';
        },
        checkinURL:function() {
            return talky.service.appURL() + '/checkin';
        },
        getSpotURL:function() {
            return talky.service.appURL() +'/get-spot-list';
        },
        getPostsURL:function() {
            return talky.service.appURL() + '/get-post-list';
        },
        sendPostURL:function() {
            return talky.service.appURL() + '/create-post';
        },
        sendReplyURL:function() {
            return talky.service.appURL() + '/reply';
        },
        getReplyURL:function() {
            return talky.service.appURL() + '/get-reply-list';
        },
    };



    var generalRequest = function(requestURL, requestData, callbacks){

        var xhr = Ti.Network.createHTTPClient();

        xhr.open('POST', requestURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setTimeout(1000);

        xhr.onload = function() {

            Ti.API.info('ResponseFrom:'+requestURL+', '+ xhr.responseText);
            var response = JSON.parse(xhr.responseText);

            if (response.success===true) {
                if (callbacks.onsuccess && typeof callbacks.onsuccess) {
                    callbacks.onsuccess(response);
                }
            } else {
                alert(response.error);
            }
        };

        xhr.onerror = function(e){
            alert(e.error);
        };

        Ti.API.info('SendTo:'+ requestURL + ", " + JSON.stringify(requestData));
        xhr.send(JSON.stringify(requestData));
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

                Ti.API.info('LOGIN Talky Successful. Talky-uid is ' + response.talky_uid);
                //Ti.App.Properties.setString('talky_uid', response.talky_uid);
                talky.data.setMyTalkyId(response.talky_uid);
            }
        };

        xhr.onerror = function(e){
            alert(e.error);
        };

        //Ti.API.info(JSON.stringify(data));
        xhr.send(JSON.stringify(data));
    };


    talky.service.checkin = function(callbacks) {
        var requestData = {
            talky_uid:talky.data.getMyTalkyId(),//Ti.App.Properties.getString('talky_uid'),
            spot_id:Ti.App.Properties.getString('spot_id'),
        };

        var xhr = Ti.Network.createHTTPClient();

        xhr.open('POST', talky.service.checkinURL(), true);
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
                if (callbacks.onsuccess && typeof callbacks.onsuccess === 'function') {
                    callbacks.onsuccess();
                }
                //Ti.API.info('login Talky successful. Talky-id is ' + response.talky_uid);
            }
        };

        xhr.onerror = function(e) {
            alert(e.error);
        };

        //Ti.API.info(JSON.stringify(data));
        xhr.send(JSON.stringify(requestData));
    };


    talky.service.requestSpotList = function(geolocation, callbacks) {

        var data = {
            talky_uid:talky.data.getMyTalkyId(),//Ti.App.Properties.getString('talky_uid'),
            lat:geolocation.latitude,
            lon:geolocation.longitude,
        };

        var xhr = Ti.Network.createHTTPClient();

        xhr.open('POST', talky.service.getSpotURL(), true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setTimeout(1000);

        xhr.onload = function() {

            //Ti.API.info('response = ' + xhr.responseText);

            var response = JSON.parse(xhr.responseText);

            if (response.success)
            {
                for (var i=0;i<response.spots.length;i++) {
                    talky.data.saveSpot(response.spots[i].id, response.spots[i]);
                }

                if (callbacks.onSpotListAvailable && typeof callbacks.onSpotListAvailable === 'function') {
                    callbacks.onSpotListAvailable(response.spots)
                }
            }
            else
            {
                if (callbacks.onSpotListUnavailable && typeof callbacks.onSpotListUnavailable === 'function') {
                    callbacks.onSpotListUnavailable(response.error);
                }
            }
        };


        xhr.onerror = function(e) {
            if (callbacks.onSpotListAvailable && typeof callbacks.onSpotListAvailable === 'function') {
                callbacks.onSpotListAvailable(response.spots)
            }
        };
        //Ti.API.info(Talky.getSpotURL());
        //Ti.API.info(JSON.stringify(data));
        xhr.send(JSON.stringify(data));

    };


    talky.service.requestReplyList = function(postId, callbacks) {

        var requestData = {
            talky_uid:talky.data.getMyTalkyId(),
            post_id:postId,
        };

        var xhr = Ti.Network.createHTTPClient();

        xhr.open('POST', talky.service.getReplyURL(), true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setTimeout(1000);

        xhr.onload = function() {

            //Ti.API.info('talky.service.requestReplyList, response = ' + xhr.responseText);

            var response = JSON.parse(xhr.responseText);

            if (response.success)
            {
                for (var i=0;i<response.replies.length;i++) {
                    response.replies[i].date_time = talky.utils.dateFromInterchangeable(response.replies[i].date_time);
                }

                if (callbacks.onReplyListAvailable && typeof callbacks.onReplyListAvailable === 'function') {
                    callbacks.onReplyListAvailable(response.replies)
                }
            }
            else
            {
                if (callbacks.onReplyListUnavailable && typeof callbacks.onReplyListUnavailable === 'function') {
                    callbacks.onReplyListUnavailable(response.error);
                }
            }
        };


        xhr.onerror = function(e) {
            if (callbacks.onReplyListUnavailable && typeof callbacks.onReplyListUnavailable === 'function') {
                callbacks.onReplyListUnavailable(response.spots)
            }
        };
        //Ti.API.info('talky.service.requestReplyList: send = '+JSON.stringify(requestData));
        xhr.send(JSON.stringify(requestData));
    };


    talky.service.requestGeolocation = function(onLocationAvailable) {

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


    talky.service.sendPost = function(content, callbacks) {

        var xhr = Ti.Network.createHTTPClient();

        var requestData = {
            "talky_uid":talky.data.getMyTalkyId(),
            "content":content,
        };

        xhr.open('POST', talky.service.sendPostURL(), true);
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onload = function() {
            //Ti.API.info('talky.service.sendPost: response = ' + xhr.responseText);
            var response = JSON.parse(xhr.responseText);
            if (!response.success) {
                alert(response.error);
                return;
            } else {

                if (callbacks.onsuccess && typeof callbacks.onsuccess ==='function') {
                    callbacks.onsuccess(response.post_id);
                }
            }
        };

        xhr.onerror = function(e) {
            alert(e.error);
        };

        //Ti.API.info(JSON.stringify(requestData));
        xhr.send(JSON.stringify(requestData));
    };


    talky.service.sendReply = function(postId, content, callbacks) {

        var requestData = {
            talky_uid:talky.data.getMyTalkyId(),
            post_id:postId,
            content:content,
            anonymous:false,
        };

        generalRequest(talky.service.sendReplyURL(), requestData,{onsuccess:function(response){
            if (callbacks.onsuccess && typeof callbacks.onsuccess === 'function') {
                callbacks.onsuccess(response.reply_id);
            }
            }, 
        });

        /*
        var xhr = Ti.Network.createHTTPClient();
        xhr.open('POST', talky.service.sendReplyURL(), true);
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onload = function() {
            Ti.API.info('sendReply:response = ' + xhr.responseText);
            var response = JSON.parse(xhr.responseText);
            if (!response.success)
            {
                alert(response.error);
                return;
            }

            if (callbacks.onsuccess && typeof callbacks.onsuccess === 'function')
            {
                callbacks.onsuccess(content);
            }
        };

        xhr.onerror = function(e) {
            alert(e.error);
        };

        Ti.API.info('talky.service.sendReply, send = '+JSON.stringify(requestData));
        xhr.send(JSON.stringify(requestData));
        */
    };

    talky.service.requestPostList = function(callbacks) {
        var requestData = {
            talky_uid:talky.data.getMyTalkyId(),
        };

        var xhr = Ti.Network.createHTTPClient();
        xhr.open('POST', talky.service.getPostsURL(), true);
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onload = function() {
            Ti.API.info('requestPostList:response = ' + xhr.responseText);
            var response = JSON.parse(xhr.responseText);
            if (!response.success) {
                if (callbacks.onPostListUnavailable && typeof callbacks.onPostListUnavailable === 'function') {
                    callbacks.onPostListUnavailable(response.error);
                } else {
                    alert(response.error);
                }
            } else {

                // Since the datetime format are different between client side(JS) and server side (Python)
                // We have to do a convertion here.
                for (var i=0;i<response.posts.length;i++) {
                    response.posts[i].date_time = talky.utils.dateFromInterchangeable(response.posts[i].date_time);
                }

                talky.utils.sortPostListByDateTime(response.posts);

                if (callbacks.onPostListAvailable && typeof callbacks.onPostListAvailable === 'function') {
                    callbacks.onPostListAvailable(response.posts);

                    for (var i=0;i<response.posts.length;i++) {
                        talky.data.savePost(response.posts[i].id, response.posts[i]);
                    }
                }
            }
        };

        xhr.onerror = function(e) {
            alert(e.error);
        };

        Ti.API.info('requestPostList:request = ' + JSON.stringify(requestData));
        xhr.send(JSON.stringify(requestData));
    };


    talky.service.requestFBNameAndPhoto = function(fbUId, callback) {

        var user = talky.data.loadUser(fbUId);
        if (user===undefined) {
            var query = "SELECT pic_square, name FROM user WHERE uid = " + fbUId;
            //Ti.API.info('talky.service.requestFBNameAndPhoto, query = ' + query);

            Ti.Facebook.request('fql.query', {query:query}, function(r){
                if (!r.success) {
                    if (r.error) {
                        Ti.API.info(r.error);
                        alert(r.error);
                    } else {
                        Ti.API.info('call waw unsuccessful');
                        alert('call was unsuccessful.');
                    }
                    return;
                }

                var results = JSON.parse(r.result);
                var result = results[0];
                user = {
                    name:result.name,
                    photo:result.pic_square,
                };
                talky.data.saveUser(fbUId, user);
                //Ti.API.info('talky.service.requestFBNameAndPhoto, FB Query successful');

                if (callback && typeof callback === 'function') {
                    callback(result.name, result.pic_square);
                }
            });
        } else {
            if (callback && typeof callback === 'function') {
                callback(user.name, user.photo);
                //Ti.API.info('talky.service.requestFBNameAndPhoto use cache');
            }
        }

        //Ti.API.info('talky.service.requestFBNameAndPhoto, fbUId = ' + fbUId);
    };

    var pickPhotoFromGallery = function(callbacks) {

        Ti.Media.openPhotoGallery({
            success:function(e)
            {
                var image = e.media;
                if (e.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
                {
                    Ti.API.info("1");
                    if (callbacks.onPickPhotoSuccess && typeof callbacks.onPickPhotoSuccess === 'function')
                    {
                        Ti.API.info("2");
                        callbacks.onPickPhotoSuccess(e.media);
                    }

                    //postContent(image, 'test');
                }
                else
                {
                    alert('MediaType is not a PHOTO!');
                }
            },
            cancel:function(e)
            {
            
            },
            error:function(e)
            {

            },
            allowEditing:true,
            mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO],
        });
    };

    /**
     * callback = function(image)
     *
     */
    talky.service.pickImageFromDevice = function(callback) {

        var dialog = Ti.UI.createOptionDialog({
            title:'是否拍照分享',
            options:['確定', '取消'],
            cancel:-1
        });

        dialog.addEventListener('click', function(e){
            if (e.index === 0) {
                //Ti.API.info('Enable sharing with photo');
                Ti.App.Properties.setBool('share-with-photo', true);
                Ti.Media.openPhotoGallery({
                    success:function(e)
                    {
                        var image = e.media;
                        if (e.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
                        {
                            if (callback && typeof callback === 'function')
                            {
                                callback(e.media);
                            }
                        }
                        else
                        {
                            alert('MediaType is not a PHOTO!');
                        }
                    },
                    cancel:function(e)
                    {
                    
                    },
                    error:function(e)
                    {

                    },
                    allowEditing:true,
                    mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO],
                });
            }
            else if (e.index === 1) {
                Ti.API.info('Disable sharing with photo');
                Ti.App.Properties.setBool('share-with-photo', false);
            }
        });
        dialog.show();
    };

})()


















