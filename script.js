function MiroCreateShape(boardId, text, x, y, width, height, fontSize, textAlign, textAlignVertical, shape, color, opacity, done) {
    Log("Creating shape in Miro");    
    const options = {
        data: { content: text, shape: shape },
        position: { origin: "center", x: x, y: y },
        geometry: { height: height, width: width },
        style: {
            fontSize: fontSize,
            textAlign: textAlign,
            textAlignVertical: textAlignVertical,
            fillColor: color,
            fillOpacity: opacity,
            borderColor: "#555555"

        }
    };

    Ajax(
        "Success: Shapre created (" + text + ")",
        {
            type: "POST",
            url: "https://api.miro.com/v2/boards/" + boardId + "/shapes",
            data: JSON.stringify(options),
            //async: false,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + miroAccessToken.token
            }
        }, 
        done
    );
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
                "Accept": "application/json",
                "Authorization": "Bearer " + googleAccessToken.token
            }
        },
        done
    );
}