<link type="text/css" href="/rd/dpt/chem/cms/Shared Documents/dev/jquery-ui/css/start/jquery-ui-1.8.21.custom.css" rel="stylesheet"/>
<link type="text/css" href="/rd/dpt/chem/cms/Shared Documents/dev/jquery-treeview/jquery.treeview.css" rel="stylesheet"/>
<link type="text/css" href="/rd/dpt/chem/cms/Shared Documents/dev/project-browser.css" rel="stylesheet"/>

<script type="text/javascript" src="/rd/dpt/chem/cms/Shared Documents/dev/jquery/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="/rd/dpt/chem/cms/Shared Documents/dev/jquery.SPServices/jquery.SPServices-0.7.1a.min.js"></script>
<script type="text/javascript" src="/rd/dpt/chem/cms/Shared Documents/dev/jquery-treeview/jquery.treeview.js"></script>
<script type="text/javascript" src="/rd/dpt/chem/cms/Shared Documents/dev/ppweb.js"></script>
<script language="javascript">

$(document).ready(function(){
    try{
        $(function () {
            $('#ppLogin').html('Login in progress, please wait....');
            login();
        });

    }catch(err){
        alert(err);
    }
});

var ppServer = null;
var remoteServerUrl = 'http://ir11242a.allergan.com:8532';
var clientType = "Allergan.Sharepoint.PipelinePilot.Connection";
var clientMachine = document.location.hostname;
var sessionId = null;
var spName = null;
var spUserName = null;
var spGroups = null;
var spGroupCount = 0;

function login() {

/*
    spName = $().SPServices.SPGetCurrentUser({
    	fieldName: "Name",
    	debug: false
    });

    spUserName = $().SPServices.SPGetCurrentUser({
        	fieldName: "UserName",
        	debug: false
    });

    $().SPServices({
            operation: "GetGroupCollectionFromUser",
            userLoginName: $().SPServices.SPGetCurrentUser(),
            async: false,
            completefunc: function (xData, Status) {
                var groups = $(xData.responseXML).find("Group");
                spGroupCount = groups.length;
            }
    });*/

    if (ppServer == null) {

	alert("PP server is null, let's try to do WIA login.");
        ppServer = new PipelinePilotServer(serverAvailable, undefined, clientType, clientMachine, remoteServerUrl);

    } else {

        var session = ppServer.getSession();
        updateLoginInfo(session);
        buildTree(ppServer);
    }
}

function serverAvailable(serverInitializedOk, serverInitializationMessage, sessionOk) {

alert("is session OK? "+sessionOk);
alert("is Logged in? "+ppServer.isLoggedIn());

    if (!serverInitializedOk) {
        $('#ppLogin').html('Unable to contact Pipeline Pilot server.');
        return;
    }

var sessionId = ppServer.getSession().getSessionId();
alert("my session ID: "+sessionId);
if(sessionId != ''){

  alert("session username: "+ppServer.getSession().getUser());
  loginSuccess();
}

}

function loginSuccess() {

    var session = ppServer.getSession();
    sessionId = session.getSessionId();

    updateLoginInfo(session);
    buildTree(ppServer);
}

function updateLoginInfo(session){
    $('#ppLogin').html("Logged into Pipeline Pilot server on "+remoteServerUrl+" with "+
        "<br>Username: "+session.getUser()+
        "<br>User folder: "+session.getUserFolder()+
        "<br>Auth Method: "+session.getAuthMethod()+
        "<br>SharePoint user name: "+spName +
        "<br>SharePoint group count: "+spGroupCount);
}
function loginFailed(msg) {
    $('#ppLogin').html('Login failed: '+msg + ' with remote server: '+remoteServerUrl);
}

function buildTree(server) {

    var foldername = "Protocols/Web Services";

    var db = server.getComponentDatabase();

    var root = $('<div/>');
    delegateBuildTree(db, foldername, root, true);

    $("#protocolTree").append(root.html());
    $("#browser").treeview({
        persist: "location",
    	collapsed: true
    });

    $("#browser span").mouseover(function(){
       $(this).css('color', 'red');
    });

    $("#browser span").mouseout(function(){
           $(this).css('color', 'black');
    });

    $("#browser span").click(function(){

       var clz = $(this).attr('class');
       if(clz == 'file'){
            alert('clicked on protocol: '+$(this).text());
       }
    });
}

function delegateBuildTree(db, folderName, root, isFirstLevel){

    var fNames = db.getFolderNamesInFolder(folderName);

    var _root = $('<ul/>');
    if(isFirstLevel){
        _root = $('<ul id="browser" class="filetree"></ul>');
    }

    for (var i=0; i<fNames.length; i++){

        var _folderName = fNames[i];
        var _folder = $('<li><span class="folder">'+_folderName+'</span></li>');
        delegateBuildTree(db, folderName+'/'+_folderName, _folder, false);
        _root.append(_folder);
     }

     var pNames = db.getComponentNamesInFolder(folderName);
     for (var i=0; i<pNames.length; i++){

        var _protocolName = pNames[i];
        var _protocol = $('<li><span class="file">'+_protocolName+'</span></li>');
        _root.append(_protocol);
    }

    root.append(_root);
}
</script>

<div id="ppLogin"></div>
<div id="protocolTree"></div>