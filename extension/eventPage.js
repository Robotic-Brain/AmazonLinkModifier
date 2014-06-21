/**
   Copyright (C) 2014  Robotic-Brain <chrome-ext@roboticbrain.de
   
   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.
   
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   
   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
    if ((typeof params) !== "string") {
	return {};
    }
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
	first = false;
    }
    return result;
}

/**
 * This function takes the parameter part of an url
 * and checks if params contains what we want
 *
 * @param object params    parameter part of url in key/value pairs
 * @param object wanted    wanted url parameters
 * @return bool            true if url looks good
 */
function checkIfDone(params, wanted) {
    for (var key in wanted) {
	if (params[key] !== wanted[key]) {
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
    if (!checkIfDone(params, wantedParameters)) {
	for (var key in wantedParameters) {
	    params[key] = wantedParameters[key];
	}
	var newUrl = urlParts[0] + "?" + mapToStr(params);
	return newUrl;
    }
    
    return false;
}

/*******************************************
 *
 * Event Handlers
 *
 *******************************************/

/**
 * Handler function for onBeforeRequest event
 *
 * this function does the actual work of the
 * extension and causes a redirect if necessary
 */
function onBeforeRequestHandler(args) {
    var result = checkRedirection(args.url);
    if (result !== false) {
	return {redirectUrl: result};
    }
}

/**
 * Handler function for onBeforeRedirect event
 *
 * this is only a convenience function to detect extension conflicts
 * if a redirect occured but the new target does not contain our parameters
 * some other mechanism must have overwriten our redirect
 */
function onBeforeRedirectHandler(args) {
    if (args.statusCode < 0) {    // ignore redirects from the server
	if (!checkIfDone(strToMap(args.redirectUrl.split("?", 2)[1]), wantedParameters)) {
	    chrome.notifications.create(
		"semperVideoError",
		{
		    "type": "basic",
		    "priority": 2,
		    "title": chrome.i18n.getMessage("notificationTitle"),
		    "message": chrome.i18n.getMessage("notificationMessage"),
		    "iconUrl": "icons/klappe128.png"
		},
		function(id){}
	    );
	}
    }
}

/**
 * Register the event handlers
 */
var filter = {urls: ["*://*/*"]};   /* urls already filtered by manifest.json */
chrome.webRequest.onBeforeRequest.addListener(
    onBeforeRequestHandler,
    filter,
    ["blocking"]
);

/**
 * Notify the user on extension conflicts
 */
chrome.webRequest.onBeforeRedirect.addListener(
    onBeforeRedirectHandler,
    filter
);
