/**
   Copyright (C) 2014  Robotic-Brain <chrome-ext@roboticbrain.de>
   
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

function TestCheckIfDone() {
    var wanted = {
        "test": "lol",
        "foo": "bar"
    };
    var params = {
        "test": "lol",
        "foo": "bar"
    };
    assert(checkIfDone(params, wanted), true);
    wanted["extra"] = "new";
    assert(checkIfDone(params, wanted), false);
}

function TestCheckRedirection() {
    var testData = [
        ["http://www.amazon.de/", "http://www.amazon.de/?tag=sempervideo-21"],
        ["https://www.amazon.de/", "https://www.amazon.de/?tag=sempervideo-21"],
        ["http://www.amazon.com/", "http://www.amazon.com/?tag=sempervideo-21"],
        ["https://www.amazon.com/", "https://www.amazon.com/?tag=sempervideo-21"],
        
        ["http://www.amazon.de/test", "http://www.amazon.de/test?tag=sempervideo-21"],
        ["https://www.amazon.de/test", "https://www.amazon.de/test?tag=sempervideo-21"],
        ["http://www.amazon.com/test", "http://www.amazon.com/test?tag=sempervideo-21"],
        ["https://www.amazon.com/test", "https://www.amazon.com/test?tag=sempervideo-21"],
        
        ["http://www.amazon.de/blub?tag=false", "http://www.amazon.de/blub?tag=sempervideo-21"],
        ["https://www.amazon.de/blub?tag=false", "https://www.amazon.de/blub?tag=sempervideo-21"],
        ["http://www.amazon.com/blub?tag=false", "http://www.amazon.com/blub?tag=sempervideo-21"],
        ["https://www.amazon.com/blub?tag=false", "https://www.amazon.com/blub?tag=sempervideo-21"],
        
        ["http://www.amazon.de/blub?something=fo&tag=false", "http://www.amazon.de/blub?something=fo&tag=sempervideo-21"],
        ["https://www.amazon.de/blub?something=fo&tag=false", "https://www.amazon.de/blub?something=fo&tag=sempervideo-21"],
        ["http://www.amazon.com/blub?something=fo&tag=false", "http://www.amazon.com/blub?something=fo&tag=sempervideo-21"],
        ["https://www.amazon.com/blub?something=fo&tag=false", "https://www.amazon.com/blub?something=fo&tag=sempervideo-21"],
    ];
    for (var i=0; i < testData.length; ++i) {
        assert(checkRedirection(testData[i][0]), testData[i][1]);
    }
}

function main() {
    //SelfTest();
    TestStrToMap();
    TestMapToStr();
    TestCheckIfDone();
    TestCheckRedirection();
}

window.onload = function(){main();};
