
<script type="text/javascript" src="/_layouts/1033/jquery-1.7.1.min.js"></script>
<script language="javascript">

// JScript source code
// A hook into AJAX's Sys.Application.load event, raised after all scripts 
// have been loaded and the objects in the application have been created 
// and initialized.
Sys.Application.add_load(onApplicationLoad)
  
// Global variables for the application
var webPartElementID = "WebPartWPQ3"; //Change this to the appropriate web part ID. 
var vwaControl;
var vwaPage;
var vwaShapes;
   
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
            vwaControl= new Vwa.VwaControl(webPartElementID)
            vwaControl.addHandler("diagramcomplete", onDiagramComplete);
    }
    catch(err){
    }
}
    
// Function Name:   onDiagramComplete
// Parameters:      None
// Description:     This function handles the onDiagramComplete event which is
//                  raised when a request for a web drawing page completes.
//                  When the event fires, this function captures references
//                  to script's global variables such as the current page, the
//                  collection of shapes on the page. It also sets the page zoom to 
//                  "fit page to view" to give a full view of the page to 
//                  users and registers the following Visio Web Access specific 
//                  event handlers:
//
//                  1. shapemouseleave: raised when the mouse enters a shape.
//                  
//                  2. shapemouseenter: raised when the mouse leaves a shape.
//
//                  3. shapeselectionchanged:   raised when the active selection
//                                              is changed from one shape 
//                                              to another.
function onDiagramComplete() {
    try {
        vwaPage = vwaControl.getActivePage();

        var inputShapeName = document.getElementById('shapeName');
        inputShapeName.value = "Diagram is loaded...";
                
        vwaPage.setZoom(80);
        vwaShapes = vwaPage.getShapes();
        vwaControl.addHandler("shapeselectionchanged", onShapeSelectionChanged);
        vwaControl.addHandler("shapemouseenter", onShapeMouseEnter);
        vwaControl.addHandler("shapemouseleave", onShapeMouseLeave);    
    }    
    catch(err) {
    }
}

function onShapeSelectionChanged(source, args){    
    var shape = vwaShapes.getItemById(args);
    //$("#status").text("selected: "+ shape.getName());       
    var shapeData = shape.getShapeData();    
    $("#status").text("selected: "+  Sys.Serialization.JavaScriptSerializer.serialize(shapeData));          
}

// Function Name: shapeMouseLeave
// Parameters:        
//    source -- a reference to the base HTML element of the vwaControl.
//    args -- the shape ID of the shape the mouse just left.
// Description:
//    On leaving a shelf shape (a shape that contains a "Best Seller" shape 
//    data), this function removes the existing overlay on that shape.
function onShapeMouseLeave(source, args)
{
    //Get the name of the shape that was just entered
    var shape = vwaShapes.getItemById(args)
 
    //And remove the overlay
    shape.removeOverlay("myOverlay");
}

// Function Name: shapeMouseEnter
// Parameters:         
//    source -- a reference to the base HTML element of the vwaControl.
//    args -- the shape ID of the shape the mouse entered.
// Description:        
//    On entering a shelf shape (a shape that contains a "Best Seller" shape 
//    data), this function extracts that shape data then overlays the 
//    corresponding image on the shape.
function onShapeMouseEnter(source, args)
{
    //Get the name of the shape that was just entered
    var shape = vwaShapes.getItemById(args);

    var inputShapeName = document.getElementById('shapeName');
    inputShapeName.value = "Diagram is loaded..."+shape.getName();
    
    //alert("shape mouse enter...");
    //Determine the best seller for that shelf. This information is stored in a shape data     //named “Best Seller” item that updates over time.
    var bestSeller; 
    var shapeData = shape.getShapeData();
    for (var j=0; j<shapeData.length; j++) {              
        if (shapeData[j].label = "Best Seller") {
            bestSeller = shapeData[j].value;
        }
    }
 
    //Depending on which shape this is, draw the correct overlay.
    switch(bestSeller)
    {
        case "productA":
        shape.addOverlay(
            "myOverlay" ,
                "<Image Source=\"productA.jpg\" Width=\"50\" Height=\"70\"><\/Image>",        
            vwaVerticalAlignment.Top, 
                vwaHorizontalAlignment.Left, 
            shape.getBounds().width,
                shape.getBounds().height);
        break;
  
        //If the best seller is product B, then display an overlay with product B.
        case "productB":
            shape.addOverlay(
                "myOverlay" ,
                "<Image Source=\"productB.jpg\" Width=\"50\" Height=\"70\"><\/Image>",        
                vwaVerticalAlignment.Top, 
            vwaHorizontalAlignment.Left, 
                shape.getBounds().width,
                shape.getBounds().height);
        break;
         
    //You can add more cases below as needed for different shelves.
        default:
    }
}
</script>

Status: <div id="status"></div>
Name:<br>
<input id="shapeName" name="Shape name" style="width: 284px" type="text" />