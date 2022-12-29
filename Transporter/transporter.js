
// Pull out OAuth2 from googleapis
const { google } = require("googleapis");
const nodemailer = require('nodemailer')

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
// 1
  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

// 2
  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :( " + err);
      }
      resolve(token);
    });
  });

// 3
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.SENDER_EMAIL,
      accessToken,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });

// 4
  return transporter;
};

module.exports = {createTransporter};

































// const nodemailer = require("nodemailer");

// let transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "abdulazeezsodiq403@gmail.com",
//     pass: "ibtxabozdwmdinzz",
//   },
// });

// const mailOptions = {
//   from: "abdulazeezsodiq403@gmail.com",
//   to: "hery bubakar@gmail.com",
//   subject: "Sending Email using Node.js",
//   text: "That was easy!",
// };

// transporter.sendMail(mailOptions, (error, info) => {
//   error ? console.log(error) : console.log("Email sent: " + info.response);
// });
