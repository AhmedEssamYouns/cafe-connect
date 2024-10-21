const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { authSocket, socketServer } = require("./socketServer");
const posts = require("./routes/posts");
const users = require("./routes/users");
const comments = require("./routes/comments");
const messages = require("./routes/messages");
const PostLike = require("./models/PostLike");
const Post = require("./models/Post");
const Grid = require("gridfs-stream");

dotenv.config();

const app = express();
let gfs;

// Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
})
.then((conn) => {
  // Initialize GridFS after connection
  gfs = Grid(conn.connection.db, mongoose.mongo);
  console.log("MongoDB connected and GridFS initialized");
})
.catch(err => {
  console.error("MongoDB connection error:", err);
});

const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://post-it-heroku.herokuapp.com"],
  },
});

// Socket.IO configuration
io.use(authSocket);
io.on("connection", (socket) => socketServer(socket));

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/comments", comments);
app.use("/api/messages", messages);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Cafe Connect API! Use the following endpoints: /api/posts, /api/users, /api/comments, /api/messages" });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// Start the server
httpServer.listen(process.env.PORT || 4000, () => {
  console.log("Server listening on port", process.env.PORT || 4000);
});

// Export gfs for use in routes/controllers
module.exports = { gfs };
