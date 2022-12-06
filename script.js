function MiroCreateShape(boardId, text, x, y, width, height, fontSize, textAlign, textAlignVertical) {
    Log("Creating shape in Miro");
    const options = {
        data: { content: text, shape: "hexagon" },
        position: { origin: "center", x: x, y: y },
        geometry: { height: height, width: width },
        style: {
            fontSize: fontSize,
            textAlign: textAlign,
            textAlignVertical: textAlignVertical,
            fillColor: "#00b9f0",
            borderColor: "#1a1a1a"

        }
    };

    $.ajax({
        type: "POST",
        url: "https://api.miro.com/v2/boards/" + boardId + "/shapes",
        data: JSON.stringify(options),
        async: false,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + miroAccessToken.token
        }
    }).done(function (data) {
        Log("Success: Shapre created (" + text + ")");
    });
}

function MiroCreateBoard(googleData) {
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
        InitTLDMHex(domain => domain.Level == 0, googleData.values, data.id, MiroCreateShape);
    });
}

function GoogleGetData() {
    Log("Loading data from Google");
    var apiKey = "AIzaSyDHAS8PUtvMEdUVfkZIpxFFnI5thGn4WwQ";
    var spreadsheetId = "1xKq60LGeDQe6X7hdmJ9tYT92tAYJ4Go3EZrEZp7zr74";
    var valueRange = "'Domains V1.3'!A5:K421";

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
        MiroCreateBoard(data);
    });
}

function CreateBoard() {
    GoogleGetData();
}


$(function () {
    $("#createButton").click(CreateBoard);
});