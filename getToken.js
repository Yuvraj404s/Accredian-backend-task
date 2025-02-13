import { google } from "googleapis";
import fs from "fs";
import readline from "readline";

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
const CREDENTIALS = JSON.parse(fs.readFileSync("credentials.json"));

const { client_secret, client_id, redirect_uris } = CREDENTIALS.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[2]);

// Generate auth URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});

console.log("Authorize this app by visiting this URL:", authUrl);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Enter the code from the URL: ", (code) => {
  oAuth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error("Error retrieving access token", err);
      return;
    }
    console.log("Your Refresh Token:", token.refresh_token);
    rl.close();
  });
});
