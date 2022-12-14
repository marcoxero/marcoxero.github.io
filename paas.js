function ParseDataPaaS(rawData, headers){
    var data = {};
    for(var r = 1; r < rawData.length; r++){
        var row = rawData[r];
        var item = { id: r };

        for(var c = 0; c < headers.length; c++){
            item[headers[c].label] = row[headers[c].column];
        }

        data[r] = item;
    }

    var tree = {};

    for(var i in data){
        var item = data[i];
        if(item.capabilityGroup == null) {
            item.capabilityGroup = "TBD";
            item.capability = "TBD";
            item.domain = "TBD";
        };
        
        if(item.domain == null) item.domain = item.capabilityGroup;
        if(item.capability == null) item.capability = item.capabilityGroup;
        
        if(tree[item.domain] == null) {
            tree[item.domain] = { name: item.domain, children: {} };
        }
        var domain = tree[item.domain];

        if(domain.children[item.capabilityGroup] == null) {
            domain.children[item.capabilityGroup] = { name: item.capabilityGroup, children: {} };    
        }
        var capabilityGroup = domain.children[item.capabilityGroup];

        if(capabilityGroup.children[item.capability] == null) {
            capabilityGroup.children[item.capability] = { name: item.capability, children: [] };    
        }
        var capability = capabilityGroup.children[item.capability];

        capability.children.push(item.name);
    }

    return tree;
}


function InitPaaS(filter, rawData, boardId, miroCreateShape) {
    var domains = ParseDataPaaS(rawData, [
        { column: 0, label: "name" },
        { column: 10, label: "capability" },
        { column: 9, label: "capabilityGroup" },
        { column: 8, label: "domain" },
    ]);   

    var x = 0;
    var y = 0;
    var domainsKeys = Object.keys(domains).sort();

    for(d in domainsKeys){
        const domain = domains[domainsKeys[d]];
        domain.x = x;
        domain.y = y;
        domain.width = Object.keys(domain.children).length * 120;
        x += domain.width + 30;

        miroCreateShape(boardId, domain.name, domain.x + domain.width/2, domain.y, 100, 70, 10, "center", "middle", "hexagon", "#E6E6E6", "1.0", function (domainData){            
            var x = domain.x + 60;
            var y = domain.y + 110;     
            var capabilityGroupsKeys = Object.keys(domain.children).sort();

            for(g in capabilityGroupsKeys){
                const capabilityGroup = domain.children[capabilityGroupsKeys[g]];
                capabilityGroup.x = x;
                capabilityGroup.y = y;
                capabilityGroup.width = 120;
                x += capabilityGroup.width + 10;
        
                miroCreateShape(boardId, capabilityGroup.name, capabilityGroup.x, capabilityGroup.y, 110, 100, 10, "center", "middle", "rectangle", "#0CA789", "1.0", function (domainData){
                    var x = capabilityGroup.x;
                    var y = capabilityGroup.y + 80;
                    var capabilitysKeys = Object.keys(capabilityGroup.children).sort();

                    for(c in capabilitysKeys){
                        const capability = capabilityGroup.children[capabilitysKeys[c]];
                        capability.x = x;
                        capability.y = y;
                        capability.width = 120;
                        capability.height = capability.children.length * 110 + 50;
                        y += capability.height + 10;
                
                        miroCreateShape(boardId, capability.name, capability.x, capability.y + capability.height/2, capability.width, capability.height, 10, "center", "top", "rectangle", "#CEE741", "1.0", function (domainData){
                            var x = capability.x;
                            var y = capability.y + 50;

                            for(i in capability.children){
                                const item = { name: capability.children[i] };
                                item.x = x;
                                item.y = y;                            
                                y += 110;
                        
                                miroCreateShape(boardId, item.name, item.x, item.y + 50, 100, 100, 10, "center", "middle", "rectangle", "#FAC710", "1.0", null);
                            }                        
                        });
                    }
                });
            }
        });
    }
}

function CreateBoardPaaS() {
    GoogleGetData("1ZiYs6laIf8PVxkJCuqMwVEQyMNmRRkInVFm6lm2iv4Q", "'tech-2022-11-04T09:19:26.943801'!A1:T300", function(data) {
        MiroCreateBoard("Xero PaaS", function(miroData) {
            InitPaaS(domain => domain.Level == 0, data.values, miroData.id, MiroCreateShape);
        });
    });
}

$(function () {
    $("#createButtonPaaS").click(CreateBoardPaaS);
});