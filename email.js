const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abdulazeezsodiq403@gmail.com",
    pass: "ibtxabozdwmdinzz",
  },
});

const mailOptions = {
  from: "abdulazeezsodiq403@gmail.com",
  to: "hery bubakar@gmail.com",
  subject: "Sending Email using Node.js",
  text: "That was easy!",
};

transporter.sendMail(mailOptions, (error, info) => {
  error ? console.log(error) : console.log("Email sent: " + info.response);
});
