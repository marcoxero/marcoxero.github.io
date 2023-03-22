function ParseDataHubdocDependencies(rawData){
    var graph = {};
 
    for(var r = 0; r < rawData.length; r++){
        var row = rawData[r];
        var nodeFrom = row[0].replaceAll('"', '').replaceAll(' ', '');
        var nodeTo = row[1].replaceAll('"', '').replaceAll(' ', '');

        if(graph[nodeFrom] == null) graph[nodeFrom] = { in: [], out: [] };
        if(graph[nodeTo] == null) graph[nodeTo] = { in: [], out: [] };

        graph[nodeFrom].out.push(nodeTo);
        graph[nodeTo].in.push(nodeFrom);
    }
    return graph;
}

function InitConnector(boardId, current, total, graph, parent){
    if(current != total) return;
    
    var graphKeys = Object.keys(graph); 
    
    for(var n in graphKeys){
        const node = graph[graphKeys[n]];
       
        for(var o = 0; o < node.out.length; o++)
        {
            const nodeTo = graph[node.out[o]];
            MiroCreateConnector(boardId, { id: node.shape.id }, { id: nodeTo.shape.id });
        }
    }
}

function InitHubdocDependencies(filter, rawData, boardId, miroCreateShape) {
    var graph = ParseDataHubdocDependencies(rawData);

    var positions = [{ x:0, y:0 }, { x:0, y:200 }, { x:0, y:400 }];
    var graphKeys = Object.keys(graph);
    var spacing = 30;
    var count = 1;
    
    for(var n in graphKeys){
        const node = graph[graphKeys[n]];
        var type = 1;
        if(node.out.length > 0 && node.in.length == 0)
            type = 0;
        if(node.in.length > 0 && node.out.length == 0)
            type = 2;
        node.title = graphKeys[n];
        node.x = positions[type].x;
        node.y = positions[type].y;
        node.width = 300;         
        node.height = 70; 

        positions[type].x += node.width + spacing;
        miroCreateShape(boardId, null, node.title, node.x, node.y, node.width, node.height, "rectangle", { fontSize: 16, color: "#ffffff", fillColor: "#1E323E", fillOpacity: "1.0", borderColor: "#1E323E" }, function (miroData){
            node.shape = miroData;
            InitConnector(boardId, count++, graphKeys.length, graph);
        });
    }
}

function CreateButtonHubdocDependencies() {
    Log("CLEAR");
    GoogleGetData("1PpSkLhSkWlNV-7VaMvxitUQQPoLr4rhBFX676gLEYeo", "'Sheet1'!D1:F187", function(data) {
        MiroCreateBoard("Hubdoc Dependecies", function(miroData) {
            InitHubdocDependencies(domain => domain.Level == 0, data.values, miroData.id, MiroCreateShapeTopLeft);
        });
    });
}

$(function () {
    $("#createButtonHubdocDependencies").click(CreateButtonHubdocDependencies);
});