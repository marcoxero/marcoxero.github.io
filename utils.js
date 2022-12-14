//QueryString
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const redirectUri = document.location.protocol + "//" + document.location.host;

function Log(text) {
    console.log(text);
    $("#log").html($("#log").html() + "<br/>" + text);
}

var googleAccessToken = JSON.parse(sessionStorage.getItem("googleAccessToken"));
var miroAccessToken = JSON.parse(sessionStorage.getItem("miroAccessToken"));

function Ajax(description, parameters, done, retries){
    $.ajax(parameters)
    .done(function (data) {
        Log(description);
        if(done != null) done(data);
    })
    .fail(function(err){
        Log("Retry(" + (retries == null ? 3 : retries) + "): " + description);
        if(retries != 0)
            Ajax(description, parameters, done, (retries == null ? 3 : --retries));
    });
}

function GoogleAuth(force) {
    if (!force && googleAccessToken != null && googleAccessToken.token != null && new Date() < new Date(googleAccessToken.expiration)) {
        Log("Authentication: Token still valid in cache");
        return;
    }

    var authCode = params.code;
    var clientId = "177743990694-c2cmdf0kbm45oopqhaj9squ8srb5qnj2.apps.googleusercontent.com";
    var clientSecret = "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";
    var scope = "https://www.googleapis.com/auth/spreadsheets.readonly";

    if (authCode == null) {
        Log("Authentication: Redirecting to Google authentication page");
        document.location = "https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=" + escape(clientId) + "&scope=" + escape(scope) + "&redirect_uri=" + escape(redirectUri);
    }

    Ajax(
        "Authentication: Token obtained by Google", 
        {
            type: "POST",
            url: "https://oauth2.googleapis.com/token",
            data: "grant_type=authorization_code&code=" + escape(authCode) + "&redirect_uri=" + escape(redirectUri) + "&client_id=" + escape(clientId) + "&client_secret=" + escape(clientSecret),
            contentType: "application/x-www-form-urlencoded"
        }, 
        data => {
            var t = new Date();
            t.setSeconds(t.getSeconds() + data.expires_in);

            googleAccessToken = {
                token: data.access_token,
                expiration: t
            }

            sessionStorage.setItem("googleAccessToken", JSON.stringify(googleAccessToken));
            Log("Authentication: Token obtained by Google");

            document.location = redirectUri;
        }
    );
}
GoogleAuth();

function MiroAuth(force) {
    if (!force && miroAccessToken != null && miroAccessToken.token != null && new Date() < new Date(miroAccessToken.expiration)) {
        Log("Authentication: Token still valid in cache");
        return;
    }

    var authCode = params.code;
    var clientId = "3458764540481522016";
    var clientSecret = "nf4pWlJowUuX10JAVThWJmDMxp0Ve5XR";
    var scope = "boards:write ";

    if (authCode == null) {
        Log("Authentication: Redirecting to Miro authentication page");
        document.location = "https://miro.com/oauth/authorize?response_type=code&client_id=" + escape(clientId) + "&scope=" + escape(scope) + "&redirect_uri=" + escape(redirectUri);
    }

    Ajax(
        "Authentication: Token obtained by Miro", 
        {
            type: "POST",
            url: "https://try.readme.io/https://api.miro.com/v1/oauth/token?grant_type=authorization_code&code=" + escape(authCode) + "&redirect_uri=" + escape(redirectUri) + "&client_id=" + escape(clientId) + "&client_secret=" + escape(clientSecret),
            headers: {
                "Accept": "application/json"
            }
        },
        function (data) {
            var t = new Date();
            t.setSeconds(t.getSeconds() + data.expires_in);

            miroAccessToken = {
                token: data.access_token,
                expiration: t
            }

            sessionStorage.setItem("miroAccessToken", JSON.stringify(miroAccessToken));
            Log("Authentication: Token obtained by Miro");

            document.location = redirectUri;
        }
    );
}
MiroAuth();