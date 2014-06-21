###########################################
# General Notes
###########################################
This extension was developed by Robotic-Brain for www.sempervideo.de
and released under the GPLv3. (see LICENSE.txt)

Included artwork may be subject to different licenses.

Features
    Adds "tag=sempervideo-21" to all amazon URLs
    Displays a notification if another extension tries to set "tag"

###########################################
# Images
###########################################
Sources for used images:
 * icons/klappe128.png          modified version of http://www.sempervideo.de/klappe.png
 * icons/klappe128-warn.png     overlay by Robotic-Brain

###########################################
# Compatibility
###########################################
Although this extension was developed against chrome 28+
the core functionality only has a minimum requirement of chrome 17+
If you're using an old version of chrome contact <chrome-ext@roboticbrain.de>

Used chrome.* APIs:
     chrome.webRequest          (requires Chrome 17)
     chrome.notifications       (requires Chrome 28)
     chrome.i18n                (requires Chrome 5)
