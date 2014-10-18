AmazonLinkModifier
==================

This Chrome extension adds the `tag=<MY_LINK_TAG>` parameter to every Amazon URL and was originally developed for http://sempervideo.de

#### Features
* Adds `tag` parameter to all Amazon URLs
* Displays notification if parameter could not be set
* Full localization support

#### How to use it with my own tag?
* Modify line 26 of `./extension/eventPage.js`  
  from: `"tag": "sempervideo-21"`  
  to: `"tag": "<INSERT YOUR TAG HERE>"`
* Change images and localization files
* Install it in Chrome
* Send me a message, if you like it!

### Project Directory Structure

       Path | Description
----------------------- | ------------------------------------------------
./                      | General supporting files
./release               | Released versions supplied by update.xml file
./extension             | Actual content, which gets packed into .crx file
./extension/unitTest.js | Tests for extesion functionality (disabled in packed version)
