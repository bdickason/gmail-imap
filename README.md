gmail-imap
==========

Easily access your gmail account via node.

Uses oauth 2.0 to auth.

* Gmail API: https://developers.google.com/gmail/
* Github: https://github.com/bdickason/gmail-imap
* Twitter: [@bdickason](http://twitter.com/bdickason)
* E-mail: dickason@gmail.com

# Installation

1. Install npm: `curl http://npmjs.org/install.sh | sh`
1. Grab this module from npm: `npm install gmail-imap`
1. Include it in your program:
 * Coffeescript: `Gmail = require 'gmail-imap'`
 * Javascript: `Gmail = require('gmail-imap');`
1. Create a project to retrieve a Client ID and Client Secret here: https://console.developers.google.com/project
1. Create a configuration object to pass in:
````
var cfg = {
    CLIENT_ID: 'Your_client_id_here',
    CLIENT_SECRET: 'Your_client_secret_here'
};
````
4. create a new instance of the gmail client:
 * Coffeescript: `gmail = new Gmail cfg`
 * Javascript: `gmail = new Gmail(cfg);`


# Usage

1. Get an Auth Url from google (requires clientId and clientSecret): `var authUrl = gmail.getAuthUrl();`
1. Redirect the user to the Auth URL: `res.redirect(authUrl)` (if using Express)
1. Get an access (and refresh) token from Google: `gmail.getAccessToken(code, function(callback) {});`
1. If callback.access_token exists, get the user's e-mail: `gmail.getEmail(callback.access_token, function(data) {});`
1. Create an xoauth2 token to pass to gmail: `var xoauth2 = gmail.getXOauth2(data.email, callback.access_token);`
1. Now you have an xoauth2 token that you can pass to a library such as [MailListener2](https://github.com/chirag04/mail-listener2).

# Example

````
var Gmail = require('gmail-imap');

var cfg = {
    CLIENT_ID: 'Your_client_id_here',
    CLIENT_SECRET: 'Your_client_secret_here'
};

var gmail = new Gmail(cfg);

// Get gmail's authentication URL
var authUrl = gmail.getAuthUrl();

// redirect user to authUrl
res.redirect(authUrl);

gmail.getAccessToken(code, function(callback) {
  if(callback.access_token) {
    gmail.getEmail(callback.access_token, function(data) {
      res.send(data.emails[0].value);
    });
  }
});
````

# Functions

**Gmail (constructor)s** - Create a Gmail object
* Input: cfg (object)
* Output: none
* Example: `var gmail = new Gmail({clientId: '1234', clientSecret: '5678'});`
  
**getAuthUrl** - Get the authorization URL from google to redirect the user to authenticate
* Input: none
* Output: url (string)
* Example: `var authUrl = gmail.getAuthUrl();`

**getAccessToken** - OAUTH2: Retrieves an access_token and refresh_token.
* Input: code (from getauthUrl)
* Output: json `{ access_token: 'aaaaa', refresh_token: 'bbbbb'}`
* Example: `gmail.getAccessToken(code, function(callback) {});`

**getEmail** - Get the user's e-mail address and profile information (Requires Access Token)
_Note: call this after getAccessToken!_
* Input: access_token
* Output: json `{ 'uid': '124', emails: [ value: 'blah@blah.com' ]}`
* Example: `gmail.getEmail(access_token, function(callback) {});`

**getXOauth2** - Authenticate w/ Gmail's IMAP server (Requires Access Token/Email)
_Note: call this after getEmail!_
* Input: email, access_token
* Output: json email object
* Example: `gmail.getXOauth2(email, access_token, function(data) {});`


# Help, I need an adult!

First step: Check out the `/examples` folder. It's decently documented.

If you're still having issues, you can submit them here: https://github.com/bdickason/node-goodreads/issues


# Changelog

**v0.0.1** - First release! Woohoo!!
* Added support for an OAuth2 round trip via access_token and refresh_token
* Added support for generating an xoauth2 token
* Started this ugly manual