import express from "express";

import {
  acceptFriendRequest,
  changePassword,
  forgotPassword,
  friendRequest,
  getUser,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  searchUsers,
  updateUser,
  userLoginStatus,
  verifyEmail,
  verifyUser,
} from "../controllers/auth/userController.js";
import {
  deleteUser,
  getAllUsers,
} from "../controllers/auth/adminController.js";
import {
  adminMiddleware,
  creatorMiddleware,
  protect,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", protect, verifyEmail);
router.post("/verify-user/:verificationToken", verifyUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetPasswordToken", resetPassword);
router.post("/friend-request", protect, friendRequest);
router.post("/friends/accept", protect, acceptFriendRequest);

router.route("/user").get(protect, getUser).patch(protect, updateUser);

router.get("/logout", logoutUser);
router.get("/login-status", userLoginStatus);
router.get("/user/:id", protect, getUserById);
router.get("/search-users", protect, searchUsers);

router.patch("/change-password", protect, changePassword);

router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

router.get("/admin/users", protect, creatorMiddleware, getAllUsers);

export default router;
