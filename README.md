node-gmail
==========

Easily access your gmail account via node.

Uses oauth 2.0 to auth.

# Installation

1. Install from npm: `npm install node-gmail`

# Usage

````
var Gmail = require('node-gmail');

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

