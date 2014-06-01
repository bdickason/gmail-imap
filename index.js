var OAuth2 = require('oauth').OAuth2;

exports = module.exports = Gmail;

function Gmail(cfg) {
  /* **Gmail (constructor)s** - Create a Gmail object
    * Input: cfg (object)
    * Output: none
    * Example: `var gmail = new Gmail({clientId: '1234', clientSecret: '5678'});`
  */
    this.options = {
        clientId: cfg.CLIENT_ID,
        clientSecret: cfg.CLIENT_SECRET
    };

    var server = 'https://accounts.google.com/o/';

    // Initialize oauth2
    this.oauth2 = new OAuth2(this.options.clientId, this.options.clientSecret, server, 'oauth2/auth', 'oauth2/token', null);

    return(null);
}

Gmail.prototype.getAuthUrl = function() {
    /* **getAuthUrl** - Get the authorization URL from google to redirect the user to authenticate
      * Input: none
      * Output: url (string)
      * Example: `var authUrl = gmail.getAuthUrl();`
     */
    var authorizeConfig = {
      response_type: 'code',
      redirect_uri: 'http://localhost:3000/callback',
      scope: 'https://mail.google.com/ https://www.googleapis.com/auth/userinfo.email', // Access user's e-mail and access user's e-mail address
      access_type: 'offline'
    };

    var authUrl = this.oauth2.getAuthorizeUrl(authorizeConfig);

    return(authUrl);
};

Gmail.prototype.getAccessToken = function(code, callback) {
    /*  **getAccessToken** - OAUTH2: Retrieves an access_token and refresh_token.
      * Input: code (from getauthUrl)
      * Output: json `{ access_token: 'aaaaa', refresh_token: 'bbbbb'}`
      * Example: `gmail.getAccessToken(code, function(callback) {});`
    */

    var server = 'https://accounts.google.com/o/';

    accessParams = { 'grant_type': 'authorization_code',
     'redirect_uri': 'http://localhost:3000/callback'
    };

    this.oauth2.getOAuthAccessToken(code, accessParams, function(err, access_token, refresh_token, results) {
      if(err) {
        console.log('Error: ');
        console.log(err);
      }
      
      callback(results);
    });
};

Gmail.prototype.getEmail = function(access_token, callback) {
  /*  **getEmail** - Get the user's e-mail address and profile information (Requires Access Token)
    _Note: call this after getAccessToken!_
    * Input: access_token
    * Output: json `{ 'uid': '124', emails: [ value: 'blah@blah.com' ]}`
    * Example: `gmail.getEmail(access_token, function(callback) {});`
  */

  var endpoint = 'https://www.googleapis.com/plus/v1/people/me';

  this.oauth2.get(endpoint, access_token, function(err, data) {
    if(err) {
      console.log('Error: ');
      console.log(err);
    }
    // console.log(data);
    callback(JSON.parse(data));
  });

};

Gmail.prototype.getXOauth2 = function(email, access_token) {
    /* **getXOauth2** - Authenticate w/ Gmail's IMAP server (Requires Access Token/Email)
      _Note: call this after getEmail!_
      * Input: email, access_token
      * Output: json email object
      * Example: `gmail.getXOauth2(email, access_token, function(data) {});`

    */
    var query_string = 'user=' + email + '\1auth=Bearer ' + access_token + '\1\1';

    var buffer = new Buffer(query_string);
    var encoded_string = buffer.toString('base64');

    return(encoded_string);
};