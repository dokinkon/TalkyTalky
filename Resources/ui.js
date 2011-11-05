(function(){
    
    talky.ui = {}

    var createTableViewRowWithPost = function(post) {
        Ti.API.info('createTableViewRowWithPost, postId = ' + post.id);
        var tvRow = Ti.UI.createTableViewRow({
            height:'auto',
            backgroundColor:'#AAA',
        });
        tvRow.postId = post.id;

        var imageView = Ti.UI.createImageView({
            top:5,
            left:5,
            width:50,
            height:50,
            image:'images/user.png',
        });
        tvRow.add(imageView);

        var contentBody = Ti.UI.createView({
            top:0,
            left:60,
            right:5,
            backgroundColor:'#DDD',
            height:'auto',
            layout:'vertical',
        });
        tvRow.add(contentBody);

        var nameLabel = Ti.UI.createLabel({
            top:5,
            left:0,
            height:'auto',
            width:100,
            font:{fontSize:12, fontWeight:'bold'},
            backgroundColor:'#FFF',
            color:'#576996',
            text:'author',
        });
        contentBody.add(nameLabel);

        var postBody = Ti.UI.createLabel({
            left:0,
            height:'auto',
            font:{fontSize:10},
            text:post.content,
        });
        contentBody.add(postBody);

        talky.service.requestFBNameAndPhoto(post.owner, function(name, photo){
            nameLabel.text = name;
            imageView.image = photo === null ? '/images/user.png' : photo;
        });
        return tvRow;
    };

    var createViewWithReply = function(reply) {
        Ti.API.info('createViewWithReply');
        var view = Ti.UI.createView({
            height:'auto',
            backgroundColor:'#BFB',
        });

        var imageView = Ti.UI.createImageView({
            top:5,
            left:5,
            width:50,
            height:50,
        });
        view.add(imageView);

        var nameLabel = Ti.UI.createLabel({
            top:5,
            left:0,
            height:'auto',
            width:100,
            font:{fontSize:12, fontWeight:'bold'},
            backgroundColor:'#FFF',
            color:'#576996',
            text:'author',
        });
        
        var postBody = Ti.UI.createLabel({
            left:0,
            height:'auto',
            font:{fontSize:10},
            text:reply.content,
        });

        var contentBody = Ti.UI.createView({
            top:0,
            left:60,
            right:5,
            backgroundColor:'#CEC',
            height:'auto',
            layout:'vertical',
        });
        contentBody.add(nameLabel);
        contentBody.add(postBody);
        view.add(contentBody);

        talky.service.requestFBNameAndPhoto(reply.owner, function(name, photo){
            nameLabel.text = name;
            imageView.image = photo === null ? '/images/user.png' : photo;
        });
        return view;
    };

    var createFullPostWindow = function(postId) {
        Ti.API.info('createFullPostWindow, postId = ' + postId);
        var win = Ti.UI.createWindow({
            backgroundColor:'#000',
            layout:'vertical',
        });

        var createPostEditionView = function() {
            var view = Ti.UI.createView({
                backgroundColor:'#BBB',
                height:50,
            });

            var textArea = Ti.UI.createTextArea({
                backgroundColor:'#CCC',
                top:5,
                left:5,
                height:40,
                width:250,
            }); 
            view.add(textArea);

            var button = Ti.UI.createButton({
                backgroundColor:'#DDD',
                title:'Submit',
                top:5,
                left:260,
                height:40,
                width:55,
            });
            view.add(button);
            button.addEventListener('click', function(){
                var testContent = '我的意中人是個蓋世英雄，有一天他會踩著七色的雲彩來娶我，我猜中了前頭，可是我猜不著這結局......';
                talky.service.sendReply(postId, testContent);
            });
            return view;
        };
        win.add(createPostEditionView());

        var tableView = Ti.UI.createTableView({
            backgroundColor:'#BBB',
            top:0,
            height:400,
            width:'100%',
        });
        win.add(tableView);

        var post = talky.data.loadPost(postId);
        tableView.appendRow(createTableViewRowWithPost(post), {animated:true});


        var onReplyListAvailable = function(replyList) {
            Ti.API.info('onReplyListAvailable');
            for (var i=0;i<replyList.length;++i) {
                var tvRow = Ti.UI.createTableViewRow({
                    height:'auto',
                });

                var view = createViewWithReply(replyList[i]);
                tvRow.add(view);
                tableView.appendRow(tvRow, {animated:true});
            }
        };

        talky.service.requestReplyList(postId, {onReplyListAvailable:onReplyListAvailable});
        return win;
    };


    talky.ui.createMainWindow = function() {
        var win = Ti.UI.createWindow({
            title:'首頁',
            backgroundColor:'#fff'
        });

        var fbButton = Ti.Facebook.createLoginButton({
            'style':'wide',
            bottom:10
        });

        win.add(fbButton);

        var hereButton = Ti.UI.createButton({
            top:'10%',
            width:60,
            height:60,
            backgroundImage:'images/here.png',
            backgroundSelectedImage:'images/here-pressed.png',
        });
        win.add(hereButton);

        var optionButton = Ti.UI.createButton({
            top:'30%',
            right:'10%',
            width:60,
            height:60,
            backgroundImage:'images/option.png',
            backgroundSelectedImage:'images/option-pressed.png',

        });
        win.add(optionButton);

        var aboutMeButton = Ti.UI.createButton({
            top:'50%',
            right:'10%',
            width:60,
            height:60,
            backgroundImage:'images/about-me.png',
            backgroundSelectedImage:'images/about-me-pressed.png',
        });
        win.add(aboutMeButton);

        var beautyMapButton = Ti.UI.createButton({
            top:'30%',
            left:'10%',
            width:60,
            height:60,
            backgroundImage:'images/beauty-map.png',
            backgroundSelectedImage:'images/beauty-map-pressed.png',
        });
        win.add(beautyMapButton);

        var favoriteButton = Ti.UI.createButton({
            top:'50%',
            left:'10%',
            width:60,
            height:60,
            backgroundImage:'images/favorite.png',
            backgroundSelectedImage:'images/favorite-pressed.png',
        });
        win.add(favoriteButton);

        var mailBoxButton = Ti.UI.createButton({
            top:'70%',
            left:'25%',
            width:60,
            height:60,
            backgroundImage:'images/mail-box.png',
            backgroundSelectedImage:'images/mail-box-pressed.png',
        });
        win.add(mailBoxButton);

        var responseButton = Ti.UI.createButton({
            top:'70%',
            right:'25%',
            width:60,
            height:60,
            backgroundImage:'images/response.png',
            backgroundSelectedImage:'images/response-pressed.png',
        });
        win.add(responseButton);

        var versionLabel = Ti.UI.createLabel({
            bottom:'2%',
            right:'2%',
            height:20,
            width:64,
            backgroundColor:'#FFF',
            text:talky.version,
        });
        win.add(versionLabel);

        return win
    };

    talky.ui.createMainWindowTab = function() {
        var win = talky.ui.createMainWindow();

        var tab = Ti.UI.createTab({
            icon:'images/home.png',
            title:'首頁',
            window:win
        });

        return tab;
    };


    talky.ui.createSpotWindow = function() {
        var win = Ti.UI.createWindow({
            backgroundColor:'#000',
            layout:'vertical',
        });


        var createPostEditionView = function() {
            var view = Ti.UI.createView({
                backgroundColor:'#BBB',
                height:50,
            });

            var textArea = Ti.UI.createTextArea({
                backgroundColor:'#CCC',
                top:5,
                left:5,
                height:40,
                width:250,
            }); 
            view.add(textArea);

            var button = Ti.UI.createButton({
                backgroundColor:'#DDD',
                title:'Submit',
                top:5,
                left:260,
                height:40,
                width:55,
            });
            view.add(button);
            button.addEventListener('click', function(){
                var testContent = '曾經有一份真誠的愛擺在我的面前，但是我沒有珍惜，等到失去的時候才後悔莫及，塵世間最痛苦的事莫過於此。如果上天可以給我個機會再來一次的話，我會對這個女孩說我愛她，如果非要在這份愛加上一個期限，我希望是一萬年......';
                talky.service.sendPost(testContent);
            });
            return view;
        };

        win.add(createPostEditionView());

        var createPostTableView = function() {

            var tableView = Ti.UI.createTableView({
                allowsselection:false,
                backgroundColor:'#EEE',
                top:0,
                width:'100%',
                height:400
            });

            tableView.addEventListener('scrollEnd', function(e){
                Ti.API.info('ScrollEnd' + e.x);
            });

            tableView.addEventListener('click', function(e){
                var win = createFullPostWindow(e.rowData.postId);
                talky.ui.locationTab.open(win, {animated:true});
            });

            return tableView;
        };
        var postTableView = createPostTableView();
        win.add(postTableView);

        var onPostListAvailable = function(postList) {
            //Ti.API.info('onPostListAvailable, posts = ' + postList.length);
            var rows = [];
            for (var i=0;i<postList.length;i+=1) {
                rows[i] = createTableViewRowWithPost(postList[i]);
            }
            postTableView.setData(rows, { animationStyle:Ti.UI.iPhone.RowAnimationStyle.DOWN });
        };

        var onPostListUnavailable = function(error) {
            alert(error);
        };

        win.addEventListener('open', function(e){
            talky.service.requestPostList({
                onPostListAvailable:onPostListAvailable,
                onPostListUnavailable:onPostListUnavailable,
            });
        });


        return win;
    };



    talky.ui.createLocationWindow = function() {

        var win = Ti.UI.createWindow({
            title:'定位',
            backgroundColor:'#000',
            layout:'vertical',
        });

        var refreshButton = Ti.UI.createButton({
            systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
        });

        win.leftNavButton = refreshButton;

        var searchBar = Ti.UI.createSearchBar({
            barColor:'#000',
            showCancel:true,
            top:0,
            height:40,
        });
        win.add(searchBar);

        var spotTableView = Ti.UI.createTableView({
            allowsselection:false,
            top:0,
            bottom:0,
            height:480,
            width:'100%',
            backgroundColor:'#EEE',
        });
        win.add(spotTableView);

        var onSpotListAvailable = function(spots) {

            //Ti.API.info("LocationWindow::onSpotListAvailable");
            var spotData = [];
            for (var i=0;i<spots.length;i+=1){
                spotData.push({
                    title:spots[i].name,
                    id:spots[i].id,
                    name:spots[i].name,
                    hasChild:true,
                    backgroundColor:'#DDD',
                });
            }

            spotTableView.setData(spotData);
            //activityIndicator.hide();
        };

        var onSpotListUnavailable = function(error) {
            alert(error);
        };

        var onLocationAvailable = function(e) {

            if (!e.success || e.error)
            {
                alert('error:' + e.error.message + '. ' + translateErrorCode(e.error.code));
                return;
            }

            //Ti.API.info("location available:" + e.coords.latitude + ", " + e.coords.longitude);
            talky.service.requestSpotList({latitude:e.coords.latitude, longitude:e.coords.longitude}, 
                    {onSpotListAvailable:onSpotListAvailable,onSpotListUnavailable:onSpotListUnavailable});
        };

        refreshButton.addEventListener('click', function(){
            talky.service.requestGeolocation(onLocationAvailable);
        });


        spotTableView.addEventListener('click', function(e) {

            // Save current Spot to App.Properties
            Ti.App.Properties.setString('spot_name', e.rowData.name);
            Ti.App.Properties.setString('spot_id'  , e.rowData.id);

            talky.service.checkin({
                onsuccess:function() {
                    var msg = 'checkin is successful. name:' + e.rowData.name + " id:" + e.rowData.id;
                    Ti.API.info(msg);
                    var win = talky.ui.createSpotWindow();
                    win.title = e.rowData.title;
                    /*
                    var win = Ti.UI.createWindow({
                        url:'main_windows/spot-window.js',
                        title:e.rowData.title,
                    });
                    */
                    talky.ui.locationTab.open(win, {animated:true});
                },
                onerror:function() {
                    // TODO
                },
            });
        });

        win.addEventListener('open', function(){
            talky.service.requestGeolocation(onLocationAvailable);
        });

        return win;
    };


    talky.ui.createLocationWindowTab = function() {
        var win = talky.ui.createLocationWindow();

        var tab = Titanium.UI.createTab({  
            icon:'images/location.png',
            title:'定位',
            window:win
        });
        talky.ui.locationTab = tab;
        return tab;
    };


    talky.ui.createShareBeautyWindowTab = function() {
        var win = Titanium.UI.createWindow({  
            url:'main_windows/share-beauty-window.js',
            title:'分享正妹',
            backgroundColor:'#fff'
        });


        var tab = Titanium.UI.createTab({  
            icon:'images/sharing-beauty.png',
            title:'分享正妹',
            window:win
        });

        return tab;
    };


    talky.ui.createShareHandsomeWindowTab = function() {
        var win = Ti.UI.createWindow({
            url:'main_windows/share-handsome-window.js',
            title:'分享帥哥'
        });

        var tab = Ti.UI.createTab({
            icon:'images/sharing-handsome.png',
            title:'分享帥哥',
            window:win
        });

        return tab;
    };

    
    talky.ui.createMessageNotifycationWindowTab = function() {
        var win = Ti.UI.createWindow({
            url:'main_windows/message-notification-window.js',
            title:'訊息'
        });

        var tab = Ti.UI.createTab({
            icon:'images/message-notification.png',
            title:'訊息',
            window:win
        });

        return tab;
    };

    talky.ui.createAppTabGroup = function() {
        var tabGroup = Ti.UI.createTabGroup();
        tabGroup.addTab(talky.ui.createMainWindowTab());
        tabGroup.addTab(talky.ui.createLocationWindowTab());
        tabGroup.addTab(talky.ui.createShareBeautyWindowTab());
        tabGroup.addTab(talky.ui.createShareHandsomeWindowTab());
        tabGroup.addTab(talky.ui.createMessageNotifycationWindowTab());
        return tabGroup;
    };

    talky.ui.appTabGroup = talky.ui.createAppTabGroup();
})()











