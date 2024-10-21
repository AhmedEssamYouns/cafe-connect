const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");

const { check } = require("express-validator");
const { verifyToken } = require("../middleware/auth");
const upload = require("../middleware/upload"); 
router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.get("/random", userControllers.getRandomUsers);
router.get("/files", userControllers.getAllFiles);
router.get("/:username", userControllers.getUser);
router.get('/avatar/image/:id', userControllers.getAvatar);
router.patch("/:id", verifyToken, userControllers.updateUser);
router.get("/", userControllers.getAllUsers);
router.patch("/avatar/:id", upload.single("avatar"), userControllers.updateAvatar);
router.get("/files/:id", userControllers.getFileById);
router.post("/follow/:id", verifyToken, userControllers.follow);
router.delete("/unfollow/:id", verifyToken, userControllers.unfollow);
router.get("/followers/:id", userControllers.getFollowers);
router.get("/following/:id", userControllers.getFollowing);

module.exports = router;
