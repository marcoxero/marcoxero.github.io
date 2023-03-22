function MiroCreateCard(boardId, parent, title, description, x, y, width, height, style, done) {
    Log("Creating a card in Miro");   
    x = x + width / 2;
    y = y + height / 2;
    style.fontSize = style.fontSize ?? 10;
    style.textAlign = style.textAlign ?? "center";
    style.textAlignVertical = style.textAlignVertical ?? "middle";
    style.color = style.color ?? "#1a1a1a";
    style.fillColor = style.fillColor ?? "#ffffff";
    style.fillOpacity = style.fillOpacity ?? "1.0";
    style.borderColor = style.borderColor ?? "#1a1a1a";
    style.borderOpacity = style.borderOpacity ?? "1.0";

    const options = {
        data: { title: title, description: description },
        position: { origin: "center", x: x, y: y },
        geometry: { height: height, width: width }
    };

    Ajax(
        "Success: Card created (" + title + ")",
        {
            type: "POST",
            url: "https://api.miro.com/v2/boards/" + boardId + "/cards",
            data: JSON.stringify(options),
            //async: async ?? true,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + miroAccessToken.token
            }
        }, 
        done
    );
}

function MiroCreateShape(boardId, parent, text, x, y, width, height, shape, style, done, parent) {
    Log("Creating shape in Miro");   
    style.fontSize = style.fontSize ?? 10;
    style.textAlign = style.textAlign ?? "center";
    style.textAlignVertical = style.textAlignVertical ?? "middle";
    style.color = style.color ?? "#1a1a1a";
    style.fillColor = style.fillColor ?? "#ffffff";
    style.fillOpacity = style.fillOpacity ?? "1.0";
    style.borderColor = style.borderColor ?? "#1a1a1a";
    style.borderOpacity = style.borderOpacity ?? "1.0";

    const options = {
        data: { content: text, shape: shape },
        position: { origin: "center", x: x, y: y },
        geometry: { height: height, width: width },
        style: style,
    };

    if(parent != null && parent.id != null)
        options.parent = parent;

    Ajax(
        "Success: Shape created (" + text + ")",
        {
            type: "POST",
            url: "https://api.miro.com/v2/boards/" + boardId + "/shapes",
            data: JSON.stringify(options),
            //async: async ?? true,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + miroAccessToken.token
            }
        }, 
        done
    );
}

function MiroCreateConnector(boardId, startItem, endItem, shape, x, y, width, height, shape, style, done, parent) {
    Log("Creating connector in Miro");   
    shape = shape ?? "curved";
    //style.fontSize = style.fontSize ?? 10;
    //style.textAlign = style.textAlign ?? "center";
    //style.textAlignVertical = style.textAlignVertical ?? "middle";
    //style.color = style.color ?? "#1a1a1a";
    //style.fillColor = style.fillColor ?? "#ffffff";
    //style.fillOpacity = style.fillOpacity ?? "1.0";
    //style.borderColor = style.borderColor ?? "#1a1a1a";
    //style.borderOpacity = style.borderOpacity ?? "1.0";

    const options = {
        startItem: startItem,
        endItem: endItem,
        style: style,
    };

    Ajax(
        "Success: Connector created (" + startItem + ", " + endItem + ")",
        {
            type: "POST",
            url: "https://api.miro.com/v2/boards/" + boardId + "/connectors",
            data: JSON.stringify(options),
            //async: async ?? true,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + miroAccessToken.token
            }
        }, 
        done
    );
}

function MiroCreateShapeTopLeft(boardId, parent, text, x, y, width, height, shape, style, done) {
    MiroCreateShape(boardId, parent, text, x + width / 2, y + height / 2, width, height, shape, style, done);
}

function MiroCreateBoard(boardName, done) {
    Log("Creating empty Miro board");
    const options = {
        name: boardName,
        policy: {
            permissionsPolicy: {
                collaborationToolsStartAccess: 'all_editors',
                copyAccess: 'anyone',
                sharingAccess: 'team_members_with_editing_rights'
            },
            sharingPolicy: {
                access: 'private',
                inviteToAccountAndBoardLinkAccess: 'no_access',
                organizationAccess: 'private',
                teamAccess: 'private'
            }
        }
    };

    Ajax(
        "",
        {
            type: "POST",
            url: "https://api.miro.com/v2/boards",
            data: JSON.stringify(options),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + miroAccessToken.token
            }
        },
        data => {         
            Log("Success: Miro board creatred <a target='_blank' href='https://miro.com/app/board/" + data.id + "'>https://miro.com/app/board/" + data.id + "</a>");
            if(done != null) done(data);
        }        
    );
}

function GoogleGetData(spreadsheetId, valueRange, done) {
    Log("Loading data from Google");
    var apiKey = "AIzaSyDHAS8PUtvMEdUVfkZIpxFFnI5thGn4WwQ";

    Ajax(
        "Success: Data obtained from Google Spreadsheet",
        {
            type: "GET",
            url: "https://sheets.googleapis.com/v4/spreadsheets/" + escape(spreadsheetId) + "/values/" + escape(valueRange) + "?key=" + escape(apiKey),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + googleAccessToken.token
            }
        },
        done
    );
}