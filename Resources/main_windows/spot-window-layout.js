



var Layout480x320 = 
{
    saySomething:
    {
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
    },
    submitButton:
    {
        title:"分享",
        height:50,
        width:90,
        top:10,
        left:220,
    },
    postTableView:
    {
        allowsselection:false,
        height:240,
        top:70,
    },
    postContent:
    {
        editable:false,
        left:60,
        top:30,
        height:50,
    },
    nameLabel:
    {
        font:{fontSize:16, fontWeight:'bold'},
        left:70,
        top:5,
        right:5,
        height:20,
        color:'#576996',
    },
    userPhoto:
    {
        left:10,
        width:50,
        height:50
    },
}



var Layout854x480 = 
{
    saySomething:
    {
        editable: true,
        value:'想說什麼嗎？',
        height:90,
        width:360,
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
    },
    submitButton:
    {
        title:"分享",
        height:90,
        width:90,
        top:10,
        right:10,
    },
    postTableView:
    {
        allowsselection:false,
        height:400,
        top:110,
    },
    postContent:
    {
        editable:false,
        left:100,
        top:50,
        width:300,
        height:100,
        borderWidth:0,
        borderColor:'#fff',
        backgroundColor:'#fff',
        borderRadius:0,
        font:{fontSize:18,fontFamily:'Marker Felt'},
    },
    nameLabel:
    {
        font:{fontSize:24, fontWeight:'bold'},
        left:90,
        top:5,
        right:5,
        height:25,
        color:'#576996',
    },
    userPhoto:
    {
        top:5,
        left:5,
        width:80,
        height:80
    },
}


var Layout = {};

if (Ti.App.SCREEN_WIDTH===320 && Ti.App.SCREEN_HEIGHT===480)
{
    Layout = Layout480x320;
    //Ti.API.info('layout = 480x320');
}
else if (Ti.App.SCREEN_WIDTH===480 && Ti.App.SCREEN_HEIGHT===854)
{
    Layout = Layout854x480;
    //Ti.API.info('layout = 854x480');
}










