
<script type="text/javascript" src="/Docs/javascript/js/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="/Docs/javascript/js/jquery-ui-1.8.21.custom.min.js"></script>

<script language="javascript">

// JScript source code
// A hook into AJAX's Sys.Application.load event, raised after all scripts 
// have been loaded and the objects in the application have been created 
// and initialized.
Sys.Application.add_load(onApplicationLoad)
   
// Function Name:   onApplicationLoad()
// Parameters:      None
// Description:     This function handles the AJAX's Sys.Application.load event 
//                  When this event fires the function captures references to 
//                  the Visio Web Access web part object and registers 
//                  the following Visio Web Access specific event handlers: 
//
//                  1. diagramcomplete: raised when the request for a web
//                                      drawing page finishes.
function onApplicationLoad() {
    try
    {
            alert("Page has been loaded");
    }
    catch(err){
    }
}
</script>

<h1>This is a test</h1>