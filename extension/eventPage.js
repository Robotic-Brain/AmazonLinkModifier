/**
 * License...
 */

/**
 * This function takes a url and returns either false if the url is good
 * or the new url where the browser should be redirected to
 *
 * @param string url          current url
 * @return false | string     new url or false
 */
function checkRedirection(url) {
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
    {urls: ["<all_urls>"]},
    ["blocking"]
);
