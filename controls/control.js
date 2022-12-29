const createTransporter =
  require("../Transporter/transporter").createTransporter;
  const uploadedImage =require('../uploadedFile/file')

const postControl = (req, res) => {
  uploadedImage(req, res, async (error) => {
    if (error) {
      return res.send("Error uploading file");
    } else {
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
      };
    }

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
  });
};
module.exports = {postControl};
