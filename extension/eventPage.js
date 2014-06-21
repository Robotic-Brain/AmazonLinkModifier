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
    "tag": "sempervideo-24"
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

/**
 * Register the event handlers
 */
var filter = {urls: ["<all_urls>"]};   /* urls already filtered by manifest.json */
chrome.webRequest.onBeforeRequest.addListener(
    function(args) {
	var result = checkRedirection(args.url);
	if (result !== false) {
	    return {redirectUrl: result};
	}
    },
    filter,
    ["blocking"]
);

/**
 * Notify the user on extension conflicts
 */
chrome.webRequest.onErrorOccurred.addListener(
    function(err) {
	chrome.notifications.create(
	    "semperVideoError",
	    {
		"type": "basic",
		"title": chrome.i18n.getMessage("notificationTitle"),
		"message": chrome.i18n.getMessage("notificationMessage"),
		"iconUrl": "icons/klappe128.png"
	    },
	    function(id){}
	);
    },
    filter
);

/**
 * Clear our Notification when done
 */
chrome.notifications.onClosed.addListener(
    function(id, byUser){
	chrome.notifications.clear(id, function(cleared){});
    }
);
