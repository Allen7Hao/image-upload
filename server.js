const express = require("express");
const fileUpload = require("express-fileupload");
const { v4: uuid } = require("uuid");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(fileUpload());
app.use((err, req, res, next) => {
  res.status(500).send("Server Error");
});

app.post("/upload", (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  const file = req.files.file;
  const maxSize = 1024 * 1024 * 10;
  if (file.size > maxSize) {
    return res.status(400).json({ msg: "File size is too large" });
  }
  const fileName = uuid() + path.extname(file.name);
  const upload_dir = `${__dirname}/client/public/uploads`;
  file.mv(`${upload_dir}/${fileName}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "Server Error" });
    }
    res.json({ fileName, filePath: `/uploads/${fileName}` });
  });
});

app.listen(80, () => console.log("server is running on port 80"));
