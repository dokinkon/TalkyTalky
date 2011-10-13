
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

    var client = Ti.Network.createHTTPClient();

    var data = {"userId":Ti.Facebook.uid,"spotName":currentWindow.title, "content":textArea.value};
    var body = JSON.stringify(data);

    client.open('POST', Talky.createPostURL, true);
    client.setRequestHeader("Content-type", "application/json");

    client.onload = function() {
        Ti.API.info('response = ' + client.responseText);
        var result = JSON.parse(client.responseText);
        // TODO: parse result from GAE server

        requestPosts();
    };


    client.onerror = function(e) {
        alert(e.error);
    };

    client.send(body);
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


    var uid = post.userId;
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




var requestPosts = function() {

    var client = Ti.Network.createHTTPClient();

    var data = {"spot-name":currentWindow.title};
    var body = JSON.stringify(data);

    client.open('POST', Talky.getPostsURL, true);
    client.setRequestHeader("Content-type", "application/json");
    //client.setRequestHeader("Content-length", body.length);

    client.onload = function() {
        
        Ti.API.info('requestPosts:response = ' + client.responseText);
        var posts = JSON.parse(client.responseText);
        onPostsAvailable(posts);
    };

    client.onerror = function(e) {
        alert(e.error);
    };

    client.send(body);

}

currentWindow.addEventListener('open', function(e){
    requestPosts();
});

















