const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;
const multer = require("multer");
require('dotenv').config(); // Load environment variables from .env file

// Use the MONGO_URI from the environment variable
const storage = new GridFsStorage({
  url: process.env.MONGO_URI, // Use MONGO_URI from the .env file
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: 'uploads' // Specify the name of the bucket in MongoDB
    };
  }
});

const upload = multer({ storage });

module.exports = upload;
