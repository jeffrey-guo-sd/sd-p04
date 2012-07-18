<link type="text/css" href="/Docs/javascript/jquery-ui/css/start/jquery-ui-1.8.21.custom.css" rel="stylesheet"/>
<link type="text/css" href="/Docs/javascript/jquery-treeview/jquery.treeview.css" rel="stylesheet"/>
<link type="text/css" href="/Docs/javascript/project-browser.css" rel="stylesheet"/>

<script type="text/javascript" src="/Docs/javascript/jquery/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="/Docs/javascript/jquery.SPServices/jquery.SPServices-0.7.1a.min.js"></script>
<script type="text/javascript" src="/Docs/javascript/jquery-treeview/jquery.treeview.js"></script>
<script type="text/javascript" src="/Docs/javascript/ppweb.js"></script>
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
var clientType = "Allergan.Sharepoint.PipelinePilot.Connection";
var clientMachine = document.location.hostname;
var sessionId = null;
var spName = null;
var spUserName = null;

function login() {

    spName = $().SPServices.SPGetCurrentUser({
    	fieldName: "Name",
    	debug: false
    });

    spUserName = $().SPServices.SPGetCurrentUser({
        	fieldName: "UserName",
        	debug: false
    });

    var remoteServerUrl = 'http://localhost:9944';

    if (ppServer == null) {

        ppServer = new PipelinePilotServer(serverAvailable, sessionId, clientType, clientMachine, remoteServerUrl);

    } else {

        var session = ppServer.getSession();
        updateLoginInfo(session);
        buildTree(ppServer);
    }
}

function serverAvailable(serverInitializedOk, serverInitializationMessage, sessionOk) {

    if (!serverInitializedOk) {
        $('#ppLogin').html('Unable to contact Pipeline Pilot server.');
        return;
    }

    //get username from SharePoint context
    var username = "mySrvcAccount";
    var password = "";

    //from user name, we need to retrieve group information from AD
    //use corresponding group service account to login to PLP
    var password = "";

    ppServer.login(username, password, clientType, clientMachine, loginSuccess, loginFailed);
}

function loginSuccess() {

    var session = ppServer.getSession();
    sessionId = session.getSessionId();

    updateLoginInfo(session);
    buildTree(ppServer);
}

function updateLoginInfo(session){
    $('#ppLogin').html("Logged in with "+
        "<br>Username: "+session.getUser()+
        "<br>User folder: "+session.getUserFolder()+
        "<br>Auth Method: "+session.getAuthMethod()+
        "<br>SharePoint user name: "+spName);
}
function loginFailed(msg) {
    $('#ppLogin').html('Login failed: '+msg);
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