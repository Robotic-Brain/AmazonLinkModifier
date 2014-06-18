/**
 * License...
 */

/* TODO: This is not actually an event page since chrome does not support it
 *       switch to declarativeWebRequest when available
 */

/**
 * This array contains all the needed parameters
 */
var wantedParameters = {
    "tag": "sempervideo-21"
};

/**
 * This function turns the paramter part of an url (after "?")
 * into a key/value map
 * 
 * @param string params     the url after "?"
 * @return object           key/value map of GET parameters
 */
function strToMap(params) {
    var pairs = params.split("&");
    var result = {};
    for (var i=0; i < pairs.length; ++i) {
	var kv = pairs[i].split("=");
	result[kv[0]] = kv[1];
    }
    return result;
}

/**
 * This function does the reverse of strToMap
 * and rebulds a string out of the given key/value map
 *
 * @param object params     the key/value map of all parameters
 * @return string           the string of GET parameters
 */
function mapToStr(params) {
    var result = "";
    var first = true;
    for (var key in params) {
	if (!first) {
	    result += "&";
	}
	result += key + "=" + params[key];
    }
    return result;
}

/**
 * This function takes the parameter part of an url
 * and checks if params contains what we want
 *
 * @param object params    parameter part of url in key/value pairs
 * @return bool            true if url looks good
 */
function checkIfDone(params) {
    for (var key in wantedParameters) {
	if (params[key] !== wantedParameters[key]) {
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
    var urlParts = url.split("?", 2);
    var params = strToMap(urlParts[1]);
    if (!checkIfDone(params)) {
	for (var key in wantedParameters) {
	    params[key] = wantedParameters[key];
	}
	var newUrl = urlParts[0] + "?" + mapToStr(params);
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
