<link type="text/css" href="/Docs/javascript/jquery-ui/css/start/jquery-ui-1.8.21.custom.css" rel="stylesheet"/>
<link type="text/css" href="/Docs/javascript/jquery.treeview.css" rel="stylesheet"/>
<link type="text/css" href="/Docs/javascript/project-browser.css" rel="stylesheet"/>

<script type="text/javascript" src="/Docs/javascript/jquery.js"></script>
<script type="text/javascript" src="/Docs/javascript/jquery.treeview.js"></script>
<script language="javascript">

$(document).ready(function(){
    try{
        $(function () {

            // first example
        	$("#browser").treeview();

            /*$("#demo1").jstree({
                "json_data" : {
                    "data" : [
                        {
                            "data" : "A node",
                            "metadata" : { id : 23 },
                            "children" : [ "Child 1", "A Child 2" ]
                        },
                        {
                            "attr" : { "id" : "li.node.id1" },
                            "data" : {
                                "title" : "Long format demo",
                                "attr" : { "href" : "#" }
                            }
                        }
                    ]
                },
                "plugins" : [ "themes", "json_data", "ui" ]
            }).bind("select_node.jstree", function (e, data) { alert(data.rslt.obj.data("id")); });*/
        });

    }catch(err){
        alert(err);
    }
});
</script>

<div>
    <ul id="browser" class="filetree">
		<li><span class="folder">Folder 1</span>
			<ul>
				<li><span class="file">Item 1.1</span></li>
			</ul>
		</li>
		<li><span class="folder">Folder 2</span>
			<ul>
				<li><span class="folder">Subfolder 2.1</span>
					<ul id="folder21">
						<li><span class="file">File 2.1.1</span></li>
						<li><span class="file">File 2.1.2</span></li>
					</ul>
				</li>
				<li><span class="file">File 2.2</span></li>
			</ul>
		</li>
		<li class="closed"><span class="folder">Folder 3 (closed at start)</span>
			<ul>
				<li><span class="file">File 3.1</span></li>
			</ul>
		</li>
		<li><span class="file">File 4</span></li>
    </ul>
</div>