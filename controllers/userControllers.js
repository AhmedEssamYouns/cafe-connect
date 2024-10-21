const User = require("../models/User");
const Post = require("../models/Post");
const PostLike = require("../models/PostLike");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Follow = require("../models/Follow");
const { default: mongoose } = require("mongoose");
 



const getUserDict = (token, user) => {
  return {
    token,
    username: user.username,
    userId: user._id,
    isAdmin: user.isAdmin,
  };
};

const buildToken = (user) => {
  return {
    userId: user._id,
    isAdmin: user.isAdmin,
  };
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(username && email && password)) {
      throw new Error("All input required");
    }

    const normalizedEmail = email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });

    if (existingUser) {
      throw new Error("Email and username must be unique");
    }

    const user = await User.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);

    return res.json(getUserDict(token, user));
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw new Error("All input required");
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new Error("Email or password incorrect");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Email or password incorrect");
    }

    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY);

    return res.json(getUserDict(token, user));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const follow = async (req, res) => {
  try {
    const { userId } = req.body;
    const followingId = req.params.id;

    const existingFollow = await Follow.find({ userId, followingId });

    if (existingFollow) {
      throw new Error("Already following this user");
    }

    const follow = await Follow.create({ userId, followingId });

    return res.status(200).json({ data: follow });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
const Grid = require("gridfs-stream");

const getAllFiles = async (req, res) => {
  try {
    const conn = mongoose.connection;

    if (!conn || conn.readyState !== 1) {
      return res.status(500).json({ error: "Database connection not ready" });
    }

    const gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads'); // Specify custom bucket if files are under 'uploads'

    console.log("Fetching files from GridFS...");

    const files = await gfs.files.find().toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }

    const fileData = files.map((file) => ({
      id: file._id,
      filename: file.filename,
      contentType: file.contentType,
      length: file.length,
      uploadDate: file.uploadDate,
    }));

    return res.status(200).json({ files: fileData });
  } catch (err) {
    console.error("Error fetching files:", err);
    return res.status(500).json({ error: err.message });
  }
};

const getFileById = async (req, res) => {
  try {
    const { id } = req.params; // Get file ID from URL params
    const conn = mongoose.connection;

    if (!conn || conn.readyState !== 1) {
      return res.status(500).json({ error: "Database connection not ready" });
    }

    const gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads'); // Specify bucket name

    console.log(`Fetching file with ID: ${id}`);

    const file = await gfs.files.findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const fileData = {
      id: file._id,
      filename: file.filename,
      contentType: file.contentType,
      length: file.length,
      uploadDate: file.uploadDate,
    };

    return res.status(200).json({ file: fileData });
  } catch (err) {
    console.error("Error fetching file by ID:", err);
    return res.status(500).json({ error: err.message });
  }
};


const updateAvatar = async (req, res) => {
  try {
    const { userId } = req.body; // Get the user ID from the request body

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: `User with ID ${userId} not found` });
    }

    // If a file is uploaded, update the user's avatar
    if (req.file) {
      user.avatar = req.file.id; // Store the file ID from GridFS
    }

    // Save the updated user information
    await user.save();

    return res.status(200).json({ success: true, avatar: user.avatar });
  } catch (err) {
    console.error("Error updating avatar:", err); // Log the error for debugging
    return res.status(500).json({ error: "Internal Server Error" }); // Return a generic error message for unexpected errors
  }
};


const { GridFSBucket } = require('mongodb');

const getAvatar = async (req, res) => {
  try {
    const { id } = req.params; // Get the avatar ID from URL parameters

    const conn = mongoose.connection;

    if (!conn || conn.readyState !== 1) {
      return res.status(500).json({ error: "Database connection not ready" });
    }

    const bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });

    const _id = new mongoose.Types.ObjectId(id);

    // Check if the file exists
    const files = await bucket.find({ _id }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "Avatar not found" });
    }

    const file = files[0];

    if (!file.contentType.startsWith('image/')) {
      return res.status(400).json({ message: "File is not an image" });
    }

    // Set appropriate content type
    res.setHeader('Content-Type', file.contentType);

    // Stream the image to the response
    const readstream = bucket.openDownloadStream(_id);

    readstream.on('error', (err) => {
      console.error('Error streaming file:', err);
      res.status(500).json({ error: 'Error streaming file' });
    });

    readstream.pipe(res);
  } catch (err) {
    console.error('Error fetching avatar:', err);
    res.status(500).json({ error: err.message });
  }
};



const updateUser = async (req, res) => {
  try {
    const { userId, biography } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User does not exist");
    }

    if (typeof biography == "string") {
      user.biography = biography;
    }

    await user.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const unfollow = async (req, res) => {
  try {
    const { userId } = req.body;
    const followingId = req.params.id;

    const existingFollow = await Follow.find({ userId, followingId });

    if (!existingFollow) {
      throw new Error("Not already following user");
    }

    await existingFollow.remove();

    return res.status(200).json({ data: existingFollow });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;

    const followers = await Follow.find({ followingId: userId });

    return res.status(200).json({ data: followers });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getFollowing = async (req, res) => {
  try {
    const userId = req.params.id;

    const following = await Follow.find({ userId });

    return res.status(200).json({ data: following });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      throw new Error("User does not exist");
    }

    const posts = await Post.find({ poster: user._id })
      .populate("poster")
      .sort("-createdAt");

    let likeCount = 0;

    posts.forEach((post) => {
      likeCount += post.likeCount;
    });

    const data = {
      user,
      posts: {
        count: posts.length,
        likeCount,
        data: posts,
      },
    };

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getRandomUsers = async (req, res) => {
  try {
    let { size } = req.query;

    const users = await User.find().select("-password");

    const randomUsers = [];

    if (size > users.length) {
      size = users.length;
    }

    const randomIndices = getRandomIndices(size, users.length);

    for (let i = 0; i < randomIndices.length; i++) {
      const randomUser = users[randomIndices[i]];
      randomUsers.push(randomUser);
    }

    return res.status(200).json(randomUsers);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getRandomIndices = (size, sourceSize) => {
  const randomIndices = [];
  while (randomIndices.length < size) {
    const randomNumber = Math.floor(Math.random() * sourceSize);
    if (!randomIndices.includes(randomNumber)) {
      randomIndices.push(randomNumber);
    }
  }
  return randomIndices;
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
  follow,
  unfollow,
  getFollowers,
  getFollowing,
  getUser,
  getAllUsers,
  getRandomUsers,
  updateUser,
  updateAvatar,
  getFileById,
  getAllFiles,
  getAvatar
};
