
/**
 * In the SpotWindow, user can read post online and post new articles
 *
 *
 *
 **/

Ti.include('../talky.js')

var currentWindow = Ti.UI.currentWindow;












var textArea = Titanium.UI.createTextArea({
	editable: true,
	value:'想說什麼嗎？',
	height:50,
	width:200,
	top:10,
    left:10,
	font:{fontSize:20,fontFamily:'Marker Felt', fontWeight:'bold'},
	color:'#888',
	textAlign:'left',
	appearance:Titanium.UI.KEYBOARD_APPEARANCE_ALERT,	
	keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
	returnKeyType:Titanium.UI.RETURNKEY_DONE,
	borderWidth:2,
	borderColor:'#bbb',
	borderRadius:5,
	suppressReturn:false
});

currentWindow.add(textArea);

var shareButton = Ti.UI.createButton({
    title:"分享",
    height:50,
    width:90,
    top:10,
    left:220,
});

currentWindow.add(shareButton);


shareButton.addEventListener('click', function(){

    if (textArea.value.length === 0){
        return;
    }

    var client = Ti.Network.createHTTPClient();

    //var data = {"spotName":Talky.spotName, "content":textArea.value};
    var data = {"userId":Ti.Facebook.uid,"spotName":currentWindow.title, "content":textArea.value};
    var body = JSON.stringify(data);

    client.open('POST', Talky.createPostURL, true);
    client.setRequestHeader("Content-type", "application/json");
    client.setRequestHeader("Content-length", body.length);

    client.onreadystatechange = function() {
        
        if (client.readyState==4 && client.status == 200)
        {
            Ti.API.info('response = ' + client.responseText);
            var result = JSON.parse(client.responseText);
        }
    };

    client.send(body);
});




var postTableView = Ti.UI.createTableView({
    allowsselection:false,
    height:240,
    top:70,
});

currentWindow.add(postTableView);



/**
 * Create a tableViewRow by current post, return a tableViewRow Instance.
 */
var createTableViewRow = function(post) {

    Ti.API.info("Here2");
    var tvRow = Ti.UI.createTableViewRow({
        height:'auto',
        backgroundColor:'#fff'
    });


    var uid = post.userId;
    Ti.API.info("createTableViewRow, uid = " + uid);
    var query = "SELECT pic_square FROM user ";
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

        var imageView = Ti.UI.createImageView({
            image:result.pic_square === null ? '../images/user.png' : result.pic_square,
            left:10,
            width:50,
            height:50
        });

        tvRow.add(imageView);

    }); // End of FB query

    var textArea = Ti.UI.createTextArea({
        value:post.content,
        left:60,
        height:50,
    });

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
        Ti.API.info("Here1");
        rows[i] = createTableViewRow(posts[i]);
    }

    postTableView.setData(rows, { animationStyle:Ti.UI.iPhone.RowAnimationStyle.DOWN });
}




var requestPosts = function() {

    var client = Ti.Network.createHTTPClient();

    var data = {"spot-name":currentWindow.title};
    var body = JSON.stringify(data);

    client.open('GET', Talky.getPostsURL, true);
    client.setRequestHeader("Content-type", "application/json");
    client.setRequestHeader("Content-length", body.length);

    client.onreadystatechange = function() {
        
        if (client.readyState==4 && client.status == 200)
        {
            Ti.API.info('requestPosts:response = ' + client.responseText);
            var posts = JSON.parse(client.responseText);
            onPostsAvailable(posts);
        }
    };

    client.send(body);

}

currentWindow.addEventListener('open', function(e){
    requestPosts();
});

















