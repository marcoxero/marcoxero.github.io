function MiroCreateShape(boardId, text, x, y, width, height, fontSize, textAlign, textAlignVertical, shape, done) {
    Log("Creating shape in Miro");
    const options = {
        data: { content: text, shape: shape },
        position: { origin: "center", x: x, y: y },
        geometry: { height: height, width: width },
        style: {
            fontSize: fontSize,
            textAlign: textAlign,
            textAlignVertical: textAlignVertical,
            fillColor: "#00b9f0",
            fillOpacity: "0.6",
            borderColor: "#555555"

        }
    };

    $.ajax({
        type: "POST",
        url: "https://api.miro.com/v2/boards/" + boardId + "/shapes",
        data: JSON.stringify(options),
        //async: false,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + miroAccessToken.token
        }
    }).done(function (data) {
        Log("Success: Shapre created (" + text + ")");
        if(done != null) done(data);
    });
}

function MiroCreateBoard(done) {
    Log("Creating empty Miro board");
    const options = {
        name: 'Untitled TLDM',
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

    $.ajax({
        type: "POST",
        url: "https://api.miro.com/v2/boards",
        data: JSON.stringify(options),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + miroAccessToken.token
        }
    }).done(function (data) {
        Log("Success: Miro board creatred <a target='_blank' href='https://miro.com/app/board/" + data.id + "'>https://miro.com/app/board/" + data.id + "</a>");
        if(done != null) done(data);        
    });
}

function GoogleGetData(spreadsheetId, valueRange, done) {
    Log("Loading data from Google");
    var apiKey = "AIzaSyDHAS8PUtvMEdUVfkZIpxFFnI5thGn4WwQ";

    $.ajax({
        type: "GET",
        url: "https://sheets.googleapis.com/v4/spreadsheets/" + escape(spreadsheetId) + "/values/" + escape(valueRange) + "?key=" + escape(apiKey),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + googleAccessToken.token
        }
    }).done(function (data) {
        Log("Success: Data obtained from Google Spreadsheet");
        if(done != null) done(data);        
    });
}