/**
 * License...
 */

/* TODO: This is not actually an event page since chrome does not support it
 *       switch to declarativeWebRequest when available
 */

/**
 * This array contains all the needed parameters
 */
var wantedParameters = [
    "tag": "sempervideo-21"
];

/**
 * This function takes the parameter part of an url
 * and checks if params contains what we want
 *
 * @param params    parameter part of url (aka. after "?")
 * @return bool     true if url looks good
 */
function checkIfDone(params) {
    for (var key in wantedParameters) {
	if (getParam(params, key) !== wantedParameters[key]) {
	    return false;
	}
    }
    return true;
}

/**
 * This function takes a url and returns either false if the url is good
 * or the new url where the browser should be redirected to
 *
 * @param string url          current url
 * @return false | string     new url or false
 */
function checkRedirection(url) {
    console.log("url is: "+url);
    var urlParts = url.split("?", 2);
    var params = urlParts[1];
    if (!checkIfDone(params)) {
	for (var key in wantedParameters) {
	    params = setParam(params, key, wantedParameters[key]);
	}
	var newUrl = urlParts[0] + "?" + params;
	console.log(newUrl);
	//return newUrl;
    }
    
    return false;
}

/**
 * Register the event handler
 */
chrome.webRequest.onBeforeRequest.addListener(
    function(args) {
	var result = checkRedirection(args.url);
	if (result !== false) {
	    return {redirectUrl: result};
	}
    },
    {urls: ["<all_urls>"]},   /* urls already filtered by manifest.json */
    ["blocking"]
);
