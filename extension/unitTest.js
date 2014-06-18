/**
 * This file contains unit test code for the extension
 * it is not needed and should be disabled in the manifest.json
 * when releasing the extension
 */

/**
 * This function compares two assoziative arrays
 *
 * @param object lh    first array
 * @param object rh    second array
 * @return boll        true if equal
 */
function arrCmp(lh, rh) {
    if ((typeof lh) !== (typeof rh)) {
	return false;
    }
    if (lh === rh) {
	return true;
    }
    if ((typeof lh) === "object") {
	for (var key in lh) {
	    if (!arrCmp(lh[key], rh[key])) {
		return false;
	    }
	}
	for (var key in rh) {
	    if (!arrCmp(lh[key], rh[key])) {
		return false;
	    }
	}
	return true;
    }
    return false;
}

/**
 * This function just prettyfies assertion output
 *
 * @param any actual      result of some expression/function
 * @param any expect      expected value
 */
function assert(actual, expect) {
    var trace = (new Error()).stack;
    if ((typeof actual) !== (typeof expect)) {
	console.warn("Assertion type mismatch!\n\tStack: " + trace);
	console.warn("\tActual: ");
	console.warn(typeof actual);
	console.warn("\tExpected: ");
	console.warn(typeof expect);
    } else if(!arrCmp(actual, expect)) {
	console.error("Assertion failed:\n\tStack: " + trace);
	console.warn("\tActual: ");
	console.warn(actual);
	console.warn("\tExpected: ");
	console.warn(expect);
    } else {
	console.info("Assert Passed.");
    }
}

/***********************************************************
 *
 * Testcases start here
 *
 ***********************************************************/

function SelfTest() {
    assert(true, true);    // Should pass
    assert("true", true);  // Should type mismatch
    assert(true, false);   // Should fail
    
    assert({"foo":"bar"}, {"foo":"bar"});   // Should pass
    assert({"bar":"foo"}, {"foo":"bar"});   // Should fail
    
    assert({"bar":true}, {"bar":true});     // Should pass
    assert({"bar":true}, {"foo":"bar"});    // Should fail
}

function TestStrToMap() {
    // single
    assert(strToMap("foo=bar"), {"foo":"bar"});
    // multi
    assert(strToMap("test=lol&foo=bar"), {"test": "lol", "foo": "bar"});
}

function TestMapToStr() {
    var val = {"foo":"bar"};
    assert(strToMap(mapToStr(val)), val);
    val = {"test":"lol", "foo":"bar"};
    assert(strToMap(mapToStr(val)), val);
    val = {"test":"lol", "foo":"bar", "bla":"blub"};
    assert(strToMap(mapToStr(val)), val);
}

function main() {
    //SelfTest();
    TestStrToMap();
    TestMapToStr();
}

window.onload = function(){main();};
