
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

















