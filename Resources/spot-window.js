(function(){

    Ti.include('utils.js');
    Ti.include('service.js');
    Ti.include('data.js');

    var createTableViewRowWithPost = function(post, withReplies) {
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
            top:0,
            left:0,
            height:'auto',
            width:100,
            font:{fontSize:12, fontWeight:'bold'},
            backgroundColor:'#FFF',
            color:'#576996',
            text:'author',
            textAlign:'left',
        });

        var timeLabel = Ti.UI.createLabel({
            top:0,
            right:0,
            height:'auto',
            width:100,
            font:{fontSize:12},
            backgroundColor:'#EFE',
            text:talky.utils.getTimeLabelString(post.date_time),
            textAlign:'right',
        });

        var nameAndTimeView = Ti.UI.createView({
            top:5,
            width:'100%',
            height:'auto',
            backgroundColor:'#EEF',
        });
        nameAndTimeView.add(nameLabel);
        nameAndTimeView.add(timeLabel);
        contentBody.add(nameAndTimeView);

        var postBody = Ti.UI.createLabel({
            left:0,
            height:'auto',
            font:{fontSize:10},
            text:post.content,
        });
        contentBody.add(postBody);

        var ratingView = Ti.UI.createView({
            top:0,
            height:'auto',
            width:'100%',
            backgroundColor:'#BCD',
        });

        var goodButton = Ti.UI.createButton({
            title:'推',
            width:16,
            height:16,
            left:10,
        });

        var badButton = Ti.UI.createButton({
            title:'噓',
            width:16,
            height:16,
            left:36,
        });

        ratingView.add(goodButton);
        ratingView.add(badButton);
        contentBody.add(ratingView);


        talky.service.requestFBNameAndPhoto(post.owner, function(name, photo){
            nameLabel.text = name;
            imageView.image = photo === null ? '/images/user.png' : photo;
        });

        // append latest 2 replies...
        if (withReplies) {

            var onReplyListAvailable = function(replies) {

                var count = 0;
                if (replies.length > 2) {
                    count = 2;
                } else {
                    count = replies.length;
                }

                if (count > 0) {
                    var repliesView = Ti.UI.createView({
                        backgroundColor:'#DBC',
                        width:'100%',
                        height:'auto',
                        layout:'vertical',
                    });
                    contentBody.add(repliesView);

                    for (var i=0;i<count;i++) {
                        var replyView = createViewWithReply(replies[i]);
                        repliesView.add(replyView);
                    }
                }
            };

            talky.service.requestReplyList(post.id, {onReplyListAvailable:onReplyListAvailable});
        }

        Ti.API.info('3');
        return tvRow;
    };

    var createViewWithReply = function(reply) {
        //Ti.API.info('createViewWithReply');
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
            top:0,
            left:0,
            height:'auto',
            width:100,
            font:{fontSize:12, fontWeight:'bold'},
            backgroundColor:'#FFF',
            color:'#576996',
            text:'author',
        });

        var timeLabel = Ti.UI.createLabel({
            top:0,
            right:0,
            height:'auto',
            width:100,
            font:{fontSize:12},
            backgroundColor:'#EFE',
            text:talky.utils.getTimeLabelString(reply.date_time),
            textAlign:'right',
        });
        
        var nameAndTimeView = Ti.UI.createView({
            top:5,
            width:'100%',
            height:'auto',
            backgroundColor:'#EEF',
        });
        nameAndTimeView.add(nameLabel);
        nameAndTimeView.add(timeLabel);

        var postBody = Ti.UI.createLabel({
            left:0,
            height:'auto',
            font:{fontSize:10},
            text:reply.content,
        });

        var ratingView = Ti.UI.createView({
            top:0,
            height:'auto',
            width:'100%',
            backgroundColor:'#BCD',
        });

        var goodButton = Ti.UI.createButton({
            title:'推',
            width:16,
            height:16,
            left:10,
        });

        var badButton = Ti.UI.createButton({
            title:'噓',
            width:16,
            height:16,
            left:36,
        });

        ratingView.add(goodButton);
        ratingView.add(badButton);

        var contentBody = Ti.UI.createView({
            top:0,
            left:60,
            right:5,
            backgroundColor:'#CEC',
            height:'auto',
            layout:'vertical',
        });
        contentBody.add(nameAndTimeView);
        contentBody.add(postBody);
        contentBody.add(ratingView);
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

            var testContent = '我的意中人是個蓋世英雄，有一天他會踩著七色的雲彩來娶我，我猜中了前頭，可是我猜不著這結局......';
            var onSendReplySuccessful = function(replyId) {
                var tvRow = Ti.UI.createTableViewRow({
                    height:'auto',
                });

                var content = undefined;

                if (textArea.value.length === 0) {
                    content = testContent;
                } else {
                    content = textArea.value;
                }

                var reply = {
                    owner:Ti.Facebook.uid,
                    content:content,
                    postId:postId,
                    dateTime:new Date()
                };

                // cache reply data
                talky.data.saveReply(replyId, reply);

                // TODO: append this replay to previous post view

                var view = createViewWithReply(reply);
                tvRow.add(view);
                talky.ui.fullPostTableView.insertRowAfter(0, tvRow, {animated:true});
            };

            button.addEventListener('click', function(){
                talky.service.sendReply(postId, testContent, {onsuccess:onSendReplySuccessful});
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
        talky.ui.fullPostTableView = tableView;

        var post = talky.data.loadPost(postId);
        tableView.appendRow(createTableViewRowWithPost(post, false), {animated:true});


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

    talky.ui.createSpotWindow = function() {
        var win = Ti.UI.createWindow({
            backgroundColor:'#000',
            layout:'vertical',
        });


        var createPostEditionView = function() {
            var view = Ti.UI.createView({
                backgroundColor:'#BBB',
                //height:'auto',
                height:50,
                top:0,
                //height:250,
            });

            var pickImageButton = Ti.UI.createButton({
                backgroundColor:'#EEE',
                title:'Image',
                top:5,
                left:5,
                height:40,
                width:50,
            });

            var textArea = Ti.UI.createTextArea({
                backgroundColor:'#CCC',
                top:5,
                left:60,
                height:40,
                width:195,
            }); 

            var submitButton = Ti.UI.createButton({
                backgroundColor:'#DDD',
                title:'Submit',
                top:5,
                left:260,
                height:40,
                width:55,
            });

            view.add(pickImageButton);
            view.add(textArea);
            view.add(submitButton);

            var testContent = '曾經有一份真誠的愛擺在我的面前，但是我沒有珍惜，等到失去的時候才後悔莫及，塵世間最痛苦的事莫過於此。如果上天可以給我個機會再來一次的話，我會對這個女孩說我愛她，如果非要在這份愛加上一個期限，我希望是一萬年......';
            var onSendPostSuccessful = function(postId) {
                Ti.API.info('onSendPostSuccessful, id = ' + postId);

                var post = {
                    id:postId,
                    owner:Ti.Facebook.uid,
                    content:testContent,
                    date_time:new Date(),
                };
                talky.ui.postTableView.insertRowBefore(0, createTableViewRowWithPost(post, false), {animated:true});
                talky.data.savePost(postId, post);
            };

            submitButton.addEventListener('click', function(){
                Ti.API.info('submitButton:clicked');
                /*
                var content = undefined;
                if (textArea.value.length > 0) {
                    content = textArea.value;
                } else {
                    content = testContent;
                }testContent
                */
                talky.service.sendPost(testContent, {onsuccess:onSendPostSuccessful});
            });


            pickImageButton.addEventListener('click', function(){
                talky.service.pickImageFromDevice(function(image){
                    //Ti.API.info('HERE');
                    var imageView = Ti.UI.createImageView({
                        top:50,
                        left:60,
                        width:200,
                        //height:1,
                        height:100,
                        image:image,
                    });
                    view.add(imageView);

                    var animation1 = Ti.UI.createAnimation({
                        duration:1000,
                        height:100,
                    });
                    var animation2 = Ti.UI.createAnimation({
                        duration:1000,
                        height:150,
                    });

                    //imageView.animate(animation1);
                    view.animate(animation2);

                    //view.animate(animation);
                });
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
        talky.ui.postTableView = postTableView;
        win.add(postTableView);

        var onPostListAvailable = function(postList) {
            //Ti.API.info('onPostListAvailable, posts = ' + postList.length);
            var rows = [];
            for (var i=0;i<postList.length;i+=1) {
                rows[i] = createTableViewRowWithPost(postList[i], true);
            }
            postTableView.setData(rows, { animationStyle:Ti.UI.iPhone.RowAnimationStyle.DOWN });
        };

        var onPostListUnavailable = function(error) {
            alert(error);
        };

        win.addEventListener('open', function(e){
            Ti.API.info('spot-window:opened');
            talky.service.requestPostList({
                onPostListAvailable:onPostListAvailable,
                onPostListUnavailable:onPostListUnavailable,
            });
        });

        win.addEventListener('close', function(){
            Ti.API.info('spot-window:closed');
        });
        return win;
    };
})()

