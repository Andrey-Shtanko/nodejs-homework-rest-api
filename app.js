const express = require("express");
const logger = require("morgan");
const cors = require("cors");
// const multer = require("multer");
// const path = require("path");


const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/users");
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// const tmpDir = path.join(__dirname, "tmp")

// const multerConfig = multer.diskStorage({
//   destination: (req, file, cb) => { 
//     cb(null, tmpDir)
//   },
//   filename: (req, file, cb) => { 
//     cb(null, file.originalname);
//   },
//   limits: {
//     fileSize: 4096
//   }
// });
// const upload = multer({
//   storage: multerConfig,
// })

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});



app.use((err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).json({ message: err.message });
  } else if (err.status === 409) {
    res.status(409).json({ message: err.message });
  } else { 
    res.status(500).json({ message: err.message });
  }
  
});

module.exports = app;
