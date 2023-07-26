// server.js these are all the packages we used in this app
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

// Connection to MongoDB
// mongoose.connect(
//   "mongodb url here",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );

//schema have all the required fields we need
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  email: String,
  residentialAddress: {
    street1: String,
    street2: String,
  },
  permanentAddress: {
    street1: String,
    street2: String,
  },
  fileDetails: {
    fileName: String,
    fileType: String,
    uploadDocument: String,
  },
});

const User = mongoose.model("User", userSchema);

// File upload configuration using multer package it will upload file into the upload folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  //by this code below file name will be the original name which the user will upload
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Route for posting the information collected into the mongodb database
app.post("/register", upload.array("uploadDocument"), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      residentialAddress: {
        street1: residentialStreet1,
        street2: residentialStreet2,
      },
      permanentAddress: {
        street1: permanentStreet1,
        street2: permanentStreet2,
      },
      fileDetails:fileDetails,
    } = req.body;

    const files = req.files.map((file) => file.filename);

    //below code will create a new document or user we can say in database
    const user = new User({
      firstName,
      lastName,
      dateOfBirth,
      email,
      residentialAddress: {
        street1: residentialStreet1,
        street2: residentialStreet2,
      },
      permanentAddress: {
        street1: permanentStreet1,
        street2: permanentStreet2,
      },
      fileDetails: {
        ...fileDetails,
        uploadDocuments: files,
      },
    });

    //below code will save the information into the database and if there is some error found then it will show error message
    await user.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed." });
  }
});

//server will run at the porn we give at the top of the code named const port : --
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
