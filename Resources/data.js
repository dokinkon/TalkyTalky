(function(){
    talky.data = {};


    talky.data.setMyTalkyId = function(talkyId) {
        Ti.App.Properties.setString('talky:uid', talkyId);
    };

    talky.data.getMyTalkyId = function() {
        return Ti.App.Properties.getString('talky:uid'),
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
        Ti.App.Properties.setString(key, JSON.stringify(post));
        //Ti.API.info('talky.data.savePost, ID = ' + postId + ', ' + JSON.stringify(post));
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
            return JSON.parse(post);
        }
    };

})()
