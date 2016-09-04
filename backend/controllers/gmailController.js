var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var conf = require("../helpers/conf");

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/gmail-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

exports.getMail = function (req, res) {
  authorize(conf.gmcs, getLastMail, res);
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, res) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  oauth2Client.credentials = conf.gmt;
  callback(oauth2Client, res);
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getLastMail(auth, res) {
  var gmail = google.gmail('v1');
  gmail.users.messages.list({
    auth: auth,
    userId: 'me',
    labelIds: 'UNREAD',
    maxResults: 1
  }, function (err, response) {
    if (err) {
      console.log(err);
    } else {
      if (response.messages.length < 1) {
        res.send("No new email..");
        return;
      }
      gmail.users.messages.get({
        auth: auth,
        userId: 'me',
        id: response.messages[0].id
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        res.send({
          date: response.payload.headers[9],
          from: response.payload.headers[10],
          subject: response.payload.headers[12]
        });
      });
    }
  });
};
