const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const Controller = require('./controls/control');



app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));




app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.post("/send_email", Controller.postControl);

app.listen(PORT, async (err) => {
  console.log(`Server is running on port ${PORT}`);
});
