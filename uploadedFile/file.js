//multer config
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "./attachments");
    },
    filename: (req, file, callback) => {
      callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    },
  });
  const uploadedImage = multer({ storage: storage }).single("attach");
  
  module.exports = uploadedImage;