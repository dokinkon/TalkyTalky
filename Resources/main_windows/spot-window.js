
/**
 * In the SpotWindow, user can read post online and post new articles
 *
 *
 *
 **/

Ti.include('../talky.js');
Ti.include('spot-window-layout.js');

var currentWindow = Ti.UI.currentWindow;
currentWindow.backgroundColor = '#fff';












var textArea = Titanium.UI.createTextArea(
    Layout.saySomething
);

currentWindow.add(textArea);

var shareButton = Ti.UI.createButton(
    Layout.submitButton
);

currentWindow.add(shareButton);


shareButton.addEventListener('click', function(){

    if (textArea.value.length === 0){
        return;
    }

    var xhr = Ti.Network.createHTTPClient();

    var requestData = 
    {
        "talky_uid":Ti.App.Properties.getString('talky_uid'),
        "content":textArea.value
    };

    xhr.open('POST', Talky.createPostURL(), true);
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onload = function() {
        Ti.API.info('response = ' + xhr.responseText);
        var response = JSON.parse(xhr.responseText);
        if (!response.success) {
            alert(response.error);
            return;
        }
        //requestPosts();
        Ti.API.info('CreatePostSuccessful');
    };

    xhr.onerror = function(e) {
        alert(e.error);
    };

    xhr.send(JSON.stringify(requestData));
});




var postTableView = Ti.UI.createTableView(Layout.postTableView);
currentWindow.add(postTableView);




postTableView.addEventListener('click', function(e) {

    var win = Ti.UI.createWindow({
        title:'test',
        backgroundColor:'#FFF',
    });


    var nameLabel = Ti.UI.createLabel(Layout.nameLabel)
    nameLabel.text = e.rowData.userName;
    win.add(nameLabel);

    var imageView = Ti.UI.createImageView(Layout.userPhoto);
    imageView.image = e.rowData.userImage;
    win.add(imageView);

    Ti.API.info('word count = ' + e.rowData.postContent.length);

    //http://developer.appcelerator.com/question/120924/a-workable-solution-to-textarea-auto-height
    // calculate the height of text area
    var linecount = 0;
    var splitresult = e.rowData.postContent.split("\n");
 
    for (var x=0;x<splitresult.length;x++){
        linecount += Math.ceil(splitresult[x].length / 18 );  
    }

    Ti.API.info('linecount = ' + linecount);
 
    var height = (linecount + 1) * 18;

    // post content
    var postContentView = Ti.UI.createTextArea({
        top:30,
        left:70,
        right:10,
        height:height,
        editable:false,
        focusable:false,
        //font:{fontSize:10,fontFamily:'Heiti TC'},
        font:{fontSize:10,fontFamily:'Courier New'},
        backgroundColor:'#AAA',// for debug
        value:e.rowData.postContent,
    });
    win.add(postContentView);

    // edit reply area...
    var replyTextArea = Ti.UI.createTextArea({
        bottom:5,
        left:5,
        right:30,
        height:30,
        backgroundColor:'#AFA',
    });

    win.add(replyTextArea);

    // post reply button
    var sendReplyButton = Ti.UI.createButton({
        bottom:5,
        right:5,
        width:20,
        height:20,
        title:"送出",
    });

    win.add(sendReplyButton);

    sendReplyButton.addEventListener('click', function(){

        // Send a reply to current post;

        Talky.sendReply({
            content:replyTextArea.value,
            post_id:e.rowData.postId,
            anonymous:false,
        });
    });

    Ti.UI.currentTab.open(win, {animated:true});

    // If this textarea got focus, move it up, otherwise it would be covered by virtual keyboard.
    replyTextArea.addEventListener('focus', function() {
        replyTextArea.bottom='50%';
    });

    replyTextArea.addEventListener('blur', function() {
        replyTextArea.bottom='0%';
    });
});



/**
 * Create a tableViewRow by current post, return a tableViewRow Instance.
 */
var createTableViewRow = function(post) {

    var tvRow = Ti.UI.createTableViewRow({
        height:'auto',
        backgroundColor:'#fff'
    });


    var uid = post.owner;
    Ti.API.info("createTableViewRow, uid = " + uid);
    var query = "SELECT pic_square, name FROM user ";
    query += "WHERE uid = " + uid;

    Ti.Facebook.request('fql.query', {query:query}, function(r){
        if (!r.success) {
            if (r.error) {
                alert(r.error);
            } else {
                alert('call was unsuccessful.');
            }

            return;
        }

        var results = JSON.parse(r.result);
        var result = results[0];

        var imageView = Ti.UI.createImageView(Layout.userPhoto);
        imageView.image = result.pic_square === null ? '../images/user.png' : result.pic_square;

        tvRow.add(imageView);

        var nameLabel = Ti.UI.createLabel(Layout.nameLabel);
        nameLabel.text = result.name;
        tvRow.add(nameLabel);

        tvRow.userName = result.name;
        tvRow.userImage = imageView.image;
        tvRow.postContent = post.content;
        tvRow.postId = post.id;

    }); // End of FB query

    var textArea = Ti.UI.createTextArea(Layout.postContent);
    textArea.value = post.content;
    tvRow.add(textArea);
    return tvRow;
}


/**
 * input: posts
 *
 */
var onPostsAvailable = function(posts) {

    Ti.API.info('onPostsAvailable');
    Ti.API.info('posts length = ' + posts.length);

    var rows = [];

    for (var i=0;i<posts.length;i+=1) {
        rows[i] = createTableViewRow(posts[i]);
    }

    postTableView.setData(rows, { animationStyle:Ti.UI.iPhone.RowAnimationStyle.DOWN });
}



currentWindow.addEventListener('open', function(e){

    Talky.requestPosts({
        onPostsAvailable:onPostsAvailable,
    });
});

















