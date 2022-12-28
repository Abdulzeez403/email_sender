const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const db = require("./config/config");
const multer = require("multer");
// Googleapis
const { google } = require("googleapis");
const nodemailer = require('nodemailer')


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//multer config
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./attachments");
  },
  filename: (req, file, callback) => {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});
const uploadedImage = multer({ storage: storage }).single("attach");






// Pull out OAuth2 from googleapis
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


app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.post("/send_email", (req, res) => {
  uploadedImage(req, res, async(error) =>{
    if(error){
      return res.send("Error uploading file");
    }else{
      const recipient = req.body.email;
      const mailSubject = req.body.subject;
      const mailBody = req.body.message;
      const attach = req.file?.path;
  
      var mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: recipient,
        subject: mailSubject,
        text: mailBody,
        attachments: [
          {
            path: attach,
          },
        ],
      }
    };

  try {
      // Get response from the createTransport
      let emailTransporter = await createTransporter();

      // Send email
      emailTransporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          // failed block
          console.log(error);
        } else {
          // Success block
          console.log("Email sent: " + info.response);
          return res.redirect("/succes.html");
        }
      });
   
  } catch (err) {
    console.log(err);
    return res.send(err);
  } 
})});

app.listen(PORT, async (err) => {
  console.log(`Server is running on port ${PORT}`);
});
