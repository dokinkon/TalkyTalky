(function(){

    Ti.include('utils.js');
    
    talky.data = {};


    talky.data.setMyTalkyId = function(talkyId) {
        Ti.App.Properties.setString('talky:uid', talkyId);
    };

    talky.data.getMyTalkyId = function() {
        return Ti.App.Properties.getString('talky:uid'),
    };


    talky.data.saveSpot = function(spotId, spot) {
        var key = 'spotId:'+spotId;

        if (!spot.hasOwnProperty('starred')) {
            spot.starred = false;
        }
        Ti.API.info('talky.data.saveSpot:' + JSON.stringify(spot));
        Ti.App.Properties.setString(key, JSON.stringify(spot));
    };

    talky.data.loadSpot = function(spotId) {
        var key = 'spotId:'+spotId;
        var spot = Ti.App.Properties.getString(key, '{}');
        if (spot==='{}') {
            return undefined;
        } else {
            return JSON.parse(spot);
        }
    };


    talky.data.saveUser = function(fbUId, user) {
        
        Ti.App.Properties.setString('fbUId:'+fbUId, JSON.stringify(user));
        //Ti.API.info('Save User:' + fbUId + ', ' + JSON.stringify(user));
    };

    talky.data.loadUser = function(fbUId) {
        var user = Ti.App.Properties.getString('fbUId'+fbUId, '{}');
        if (user==='{}') {
            //Ti.API.info('User:' + fbUId + ' not found');
            return undefined;
        } else {
            //Ti.API.info('User:' + fbUId + ' found');
            return JSON.parse(user);
        }
    };

    talky.data.savePost = function(postId, post) {
        var key = 'postId:'+postId;
        post.date_time = talky.utils.dateToInterchangeable(post.date_time);
        Ti.App.Properties.setString(key, JSON.stringify(post));
        Ti.API.info('talky.data.savePost, ID = ' + postId + ', ' + JSON.stringify(post));
        //Ti.API.info('testload: ' + Ti.App.Properties.getString(key));
    };

    talky.data.loadPost = function(postId) {
        var key = 'postId:'+postId;
        Ti.API.info('loadPost: '+key);
        var post = Ti.App.Properties.getString(key, '{}');
        if (post==='{}') {

            Ti.API.info('talky.data.loadPost: failed to load post ' + postId);
            return undefined;
        } else {
            var post = JSON.parse(post);
            post.date_time = talky.utils.dateFromInterchangeable(post.date_time);
            return post;
        }
    };

    talky.data.saveReply = function(replyId, reply) {
        var key = 'replyId:'+replyId;
        reply.date_time = talky.utils.dateToInterchangeable(reply.date_time);
        Ti.App.Properties.setString(key, JSON.stringify(reply));
        Ti.API.info('saveReply. replyId:' + replyId + ', ' + JSON.stringify(reply));
    };


    talky.data.loadReply = function(replyId) {
        var key = 'replyId:'+replyId;
        var reply = Ti.App.Properties.getString(key, '{}');
        if (reply==='{}') {
            return undefined;
        } else {
            var re = JSON.parse(reply);
            re.date_time = talky.utils.dateFromInterchangeable(re.date_time);
        }
    };


















})()
