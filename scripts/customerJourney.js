function ParseDataCustomerJourney(rawData, headers){
    var data = [];
    var lastCategory = null;
    var categories = {};

    for(var r = 0; r < rawData.length; r++){
        var row = rawData[r];

        if(lastCategory == null || row[0][0] != "L"){        
            lastCategory = row[0];
            var categoryId = Object.keys(categories).length;
            categories[lastCategory] = { id: categoryId, title: lastCategory, groups: {} };
            continue;
        }

        var item = { id: r, category: lastCategory , isGroup: row[0][1] == "0", groupId: row[0][3] + (isNaN(row[0][4]) || row[0][4] == ' ' ? "" : row[0][4]) };
        for(var c = 0; c < headers.length; c++){
            item[headers[c].label] = row[headers[c].column];
        }

        data.push(item);
    }
    
    for(var g = 0; g < data.length; g++){
        if(!data[g].isGroup) 
            continue;

        var group = data[g];
        group.items = [];

        for(var i = g+1; i < data.length; i++){
            if(data[i].groupId != group.groupId) 
                break;

            group.items.push(data[i])            
            g++;
        }        
    
        categories[group.category].groups[group.groupId] = group;
    }

    return categories;
}


function InitCustomerJourney(filter, rawData, boardId, miroCreateShape) {
    var categories = ParseDataCustomerJourney(rawData, [
        { column: 0, label: "title" },
        { column: 1, label: "description" },
        { column: 3, label: "tagsUS" },
        { column: 4, label: "tagsUK" },
        { column: 4, label: "tagsNZ" },
        { column: 4, label: "tagsAU" },
        { column: 4, label: "tagsCA" },
        { column: 4, label: "division" },
        { column: 4, label: "relatedResearch" },
        { column: 4, label: "segmentationSB" },
        { column: 4, label: "segmentationAB" },
    ]);   

    var x = 0;
    var y = 0;
    var categoryKeys = Object.keys(categories);
    const indentation = 50;
    
    for(var c in categoryKeys){
        const category = categories[categoryKeys[c]];
        category.title = categoryKeys[c];
        category.x = x;
        category.y = y;
        category.width = 1200;
        category.height = 200;
        x += category.width + 30;        

        miroCreateShape(boardId, null, category.title, category.x, category.y, category.width, category.height, "rectangle", { fontSize: 36, color: "#ffffff", fillColor: "#1E323E", fillOpacity: "1.0", borderColor: "#1E323E" }, function (miroData){            
            var xG = category.x + indentation;
            var yG = category.y + category.height + 50;
            var groupKeys = Object.keys(category.groups);

            for(var g in groupKeys){
                const group = category.groups[groupKeys[g]];
                group.id = group.title.substring(0, group.title.indexOf(' '));
                group.title = group.title.substring(group.id.length + 1);
                group.x = xG;
                group.y = yG;
                group.width = category.width - indentation;
                group.height = 50;
                var idWidth = 80;
                var lineHeight = 8;

                miroCreateShape(boardId, null, group.id, group.x, group.y, idWidth, group.height, "rectangle", { fontSize: 24, color: "#ffffff", fillColor: "#1E323E", fillOpacity: "1.0", borderColor: "#1E323E" }, function (miroData){
                    miroCreateShape(boardId, miroData, group.title, group.x + idWidth + 10, group.y, group.width - idWidth, group.height, "rectangle", { fontSize: 36, textAlign: "left", textAlignVertical: "top", color: "#1E323E", fillOpacity: "0.001", borderOpacity: "0.001" });            
                    miroCreateShape(boardId, miroData, "", group.x, group.y + group.height, category.width - indentation, lineHeight, "rectangle", { fillColor: "#1E323E", fillOpacity: "1.0", borderColor: "#1E323E" }, function (miroData){            
                        for(var i in group.items){
                            const item = group.items[i];
                            item.x = group.x + indentation;
                            item.y = group.y + group.height + 20 + i * 130;
                            item.width = group.width - indentation;
                            item.height = 110;

                            MiroCreateCard(boardId, miroData, item.title, item.description, item.x, item.y, item.width, item.height, { fontSize: 24, color: "#ffffff", fillColor: "#1E323E", fillOpacity: "1.0", borderColor: "#1E323E" }, function (miroData){});
                        }
                    });    
                });            

                yG += 100 + group.items.length * 130;
            }
        });
    }
}

function CreateBoardCustomerJourney() {
    Log("CLEAR");
    GoogleGetData("10kF5C_B-QWZP4n6fIvmF2vbRlfkE3nwyAQbZ-23IZMU", "'L0, 1, 2 Jobs and Journeys in one column'!A4:M113", function(data) {
        MiroCreateBoard("Xero Customer Journey", function(miroData) {
            InitCustomerJourney(domain => domain.Level == 0, data.values, miroData.id, MiroCreateShapeTopLeft);
        });
    });
}

$(function () {
    $("#createButtonCustomerJourney").click(CreateBoardCustomerJourney);
});