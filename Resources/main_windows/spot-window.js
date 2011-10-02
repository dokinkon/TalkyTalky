
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
    var data = {"spotName":currentWindow.title, "content":textArea.value};
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

var requestPosts = function(){

    var client = Ti.Network.createHTTPClient();

    var data = {"spot-name":currentWindow.title};
    var body = JSON.stringify(data);

    client.open('GET', Talky.getPostsURL, true);
    client.setRequestHeader("Content-type", "application/json");
    client.setRequestHeader("Content-length", body.length);

    client.onreadystatechange = function() {
        
        if (client.readyState==4 && client.status == 200)
        {
            Ti.API.info('response = ' + client.responseText);
            var results = JSON.parse(client.responseText);
            var posts = []
            
            for (var i=0;i<results.length;i+=1) {
                posts[i] = {title:results[i].content, hasChild:false};
            }

            postTableView.setData(posts);

        }
    };

    client.send(body);

}

currentWindow.addEventListener('open', function(e){
    requestPosts();
});

















