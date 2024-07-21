import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import User from "../models/auth/userModel.js";

export const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res
        .status(401)
        .json({ message: "Non Autorisé, merci de vous connecter" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Non Autorisé, jeton invalide" });
  }
});

export const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
    return;
  }
  res.status(403).json({ message: "Action réservée aux administrateurs" });
});

export const creatorMiddleware = asyncHandler(async (req, res, next) => {
  if (
    (req.user && req.user.role === "creator") ||
    (req.user && req.user.role === "admin")
  ) {
    next();
    return;
  }
  res.status(403).json({ message: "Action réservée aux créateurs" });
});

export const verifiedMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.verified) {
    next();
    return;
  }
  res.status(403).json({ message: "Merci de vérifier votre adresse email" });
});
