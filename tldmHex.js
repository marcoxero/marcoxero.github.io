function getParentValue(data, id, column) {
    if (data[id] == null)
        return null;

    if (data[id][column] != null)
        return data[id][column];

    if (data[id].UID == data[id].ParentID)
        return null;

    return getParentValue(data, data[id].ParentID, column);
}

function ParseDataTLDM(rawData) {
    const data = {};
    var lastDomain = {};

    for (rowIndex in rawData) {
        var row = rawData[rowIndex];
        if (!isNaN(row[0])) {
            lastDomain =
            {
                UID: parseInt(row[0]),
                ParentID: parseInt(row[1]),
                CoreDomain: row[2],
                SupportingDomain: row[3],
                ExternalDomain: row[4],
                TechnologyCapability: row[5],
                BusinessArea: row[6] != null && row[6] != "" ? row[6] : getParentValue(data, parseInt(row[1]), "BusinessArea"),
                DomainLevel1: row[7] != null && row[7] != "" ? row[7] : getParentValue(data, parseInt(row[1]), "DomainLevel1"),
                DomainLevel2: row[8] != null && row[8] != "" ? row[8] : getParentValue(data, parseInt(row[1]), "DomainLevel2"),
                DomainLevel3: row[9] != null && row[9] != "" ? row[9] : getParentValue(data, parseInt(row[1]), "DomainLevel3"),
                DomainLevel4: row[10] != null && row[10] != "" ? row[10] : getParentValue(data, parseInt(row[1]), "DomainLevel4"),
            };

            if (lastDomain.DomainLevel4 != null) {
                lastDomain.Level = 4;
                lastDomain.Label = lastDomain.DomainLevel4;
            } else if (lastDomain.DomainLevel3 != null) {
                lastDomain.Level = 3;
                lastDomain.Label = lastDomain.DomainLevel3;
            } else if (lastDomain.DomainLevel2 != null) {
                lastDomain.Level = 2;
                lastDomain.Label = lastDomain.DomainLevel2;
            } else if (lastDomain.DomainLevel1 != null) {
                lastDomain.Level = 1;
                lastDomain.Label = lastDomain.DomainLevel1;
            } else {
                lastDomain.Level = 0;
                lastDomain.Label = lastDomain.BusinessArea;
            }

            if(!isNaN(lastDomain.UID)){
                data[lastDomain.UID] = lastDomain;
            }
        }
    };

    return data;
}

function InitTLDMHexChildren(data, boardId, parentID, parentX, parentY, miroCreateShape) {
    var positionMatrix = [
        { x: 0, y: 0 },
        { x: 130, y: 80 },
        { x: 260, y: 0 },
        { x: 390, y: 80 },
        { x: 520, y: 0 },

        { x: 0, y: 160 },
        { x: 130, y: 240 },
        { x: 260, y: 160 },
        { x: 390, y: 240 },
        { x: 520, y: 160 },

        { x: 130, y: -80 },
        { x: 390, y: -80 },
        { x: 260, y: 320 },

        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
    ];

    var childCount = 0;
    for (childDomainId in data) {
        const childDomain = data[childDomainId]
        if (childDomain.UID != parentID && childDomain.ParentID == parentID) {
            childDomain.X = positionMatrix[childCount].x + parentX - 260;
            childDomain.Y = positionMatrix[childCount].y + parentY - 80;
            childDomain.Shape = miroCreateShape(boardId, childDomain.Label, childDomain.X, childDomain.Y, 160, 140, 16, 'center', 'middle', "hexagon", "#00b9f0", "0.6");
            childCount++;
        }
    };
}

function InitTLDMHex(filter, rawData, boardId, miroCreateShape) {
    var data = ParseDataTLDM(rawData);
    var x = 0;
    var y = 0;
    var count = 0;
    for (domainId in data) {
        const domain = data[domainId];
        if (filter(domain)) {
            domain.X = x;
            domain.Y = y;
            count++;
            domain.Shape = miroCreateShape(boardId, domain.Label, domain.X, domain.Y, 800, 700, 40, 'center', 'top', "hexagon", "#00b9f0", "0.6", function (parentData){
                InitTLDMHexChildren(data, boardId, domain.UID, domain.X, domain.Y, miroCreateShape);
            });

            
            x += 640;
            y += y == 0 || y == 760 ? 380 : -380;

            if (count == 4) {
                x -= 2560;
                y += 760;
            }
        }
    };
}

function CreateBoardTLDM() {
    Log("CLEAR");
    GoogleGetData("1xKq60LGeDQe6X7hdmJ9tYT92tAYJ4Go3EZrEZp7zr74", "'Domains V1.3'!A5:K421", function(data) {
        MiroCreateBoard("Xero TLDM", function(miroData) {
            InitTLDMHex(domain => domain.Level == 0, data.values, miroData.id, MiroCreateShape);
        });
    });
}

$(function () {
    $("#createButtonTLDM").click(CreateBoardTLDM);
});