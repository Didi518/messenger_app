import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import User from "../../models/auth/userModel.js";
import Token from "../../models/auth/TokenModel.js";
import generateToken from "../../helpers/generateToken.js";
import hashToken from "../../helpers/hashToken.js";
import sendEmail from "../../helpers/sendEmail.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: "Tous les champs sont requis" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Le mot de passe doit faire au moins 6 caractères" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ message: "Cet email est déjà utilisé, connectez-vous!" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
  });

  if (user) {
    const {
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      theme,
      friendRequest,
      lastSeen,
      friends,
    } = user;
    res.status(201).json({
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token,
      theme,
      friendRequest,
      lastSeen,
      friends,
    });
  } else {
    res.status(400).json({ message: "Données utilisateur invalides" });
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  const userExists = await User.findOne({ email });
  if (!userExists) {
    return res
      .status(404)
      .json({ message: "Cet utilisateur est introuvable, inscrivez-vous!" });
  }

  const isMatch = await bcrypt.compare(password, userExists.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Identifiants invalides" });
  }

  const token = generateToken(userExists._id);

  if (userExists && isMatch) {
    const { _id, name, email, role, photo, bio, isVerified } = userExists;

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    });

    res.status(200).json({
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token,
    });
  } else {
    res.status(400).json({ message: "Email et/ou mot de passe invalide(s)" });
  }
});

export const logoutUser = asyncHandler(async (_req, res) => {
  res.clearCookie("token");

  res.status(200).json({ message: "Compte bien déconnecté" });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "Utilisateur introuvable" });
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.photo = req.body.photo || user.photo;
    user.theme = req.body.theme || user.theme;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      photo: updatedUser.photo,
      bio: updatedUser.bio,
      isVerified: updatedUser.isVerified,
      theme: updatedUser.theme,
      friendRequest: updatedUser.friendRequest,
    });
  } else {
    res.status(404).json({ message: "Utilisateur introuvable" });
  }
});

export const userLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Non Autorisé, merci de vous connecter" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded) {
    res.status(200).json(true);
  } else {
    res.status(401).json(false);
  }
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "Ce compte est déjà vérifié" });
  }

  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  const verificationToken = crypto.randomBytes(64).toString("hex") + user._id;

  const hashedToken = hashToken(verificationToken);

  await new Token({
    userId: user._id,
    verificationToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  }).save();

  const verificationLink = `${process.env.CLIENT_URL}/verifier-email/${verificationToken}`;

  const subject = "Authkit - Vérification de votre compte";
  const send_to = user.email;
  const reply_to = "noreply@gmail.com";
  const template = "emailVerification";
  const send_from = process.env.USER_EMAIL;
  const name = user.name;
  const url = verificationLink;

  try {
    await sendEmail(subject, send_to, send_from, reply_to, template, name, url);
    return res.json({ message: "Un email de vérification vous a été envoyé" });
  } catch (error) {
    console.log("Error sending email: ", error);
    return res.status(500).json({ message: "L'email n'a pas pu être envoyé" });
  }
});

export const verifyUser = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;
  if (!verificationToken) {
    return res.status(400).json({ message: "Jeton d'identification invalide" });
  }
  const hashedToken = hashToken(verificationToken);

  const userToken = await Token.findOne({
    verificationToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return res
      .status(400)
      .json({ message: "Jeton d'identification invalide ou expriré" });
  }

  const user = await User.findById(userToken.userId);
  if (user.isVerified) {
    return res.status(400).json({ message: "Ce compte est déjà vérifié" });
  }

  user.isVerified = true;
  await user.save();
  res.status(200).json({ message: "Compte vérifié avec succès" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "L'email est requise" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "Cet utilisateur n'existe pas" });
  }

  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  const passwordResetToken = crypto.randomBytes(64).toString("hex") + user._id;

  const hashedToken = hashToken(passwordResetToken);

  await new Token({
    userId: user._id,
    passwordResetToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000,
  }).save();

  const resetLink = `${process.env.CLIENT_URL}/reinitialiser-mot-de-passe/${passwordResetToken}`;

  const subject = "Authkit - Réinitialisation de votre mot de passe";
  const send_to = user.email;
  const send_from = process.env.USER_EMAIL;
  const reply_to = "noreply@gmail.com";
  const template = "forgotPassword";
  const name = user.name;
  const url = resetLink;

  try {
    await sendEmail(subject, send_to, send_from, reply_to, template, name, url);
    return res.json({
      message: "Un email de réinitialisation du mot de passe vous a été envoyé",
    });
  } catch (error) {
    console.log("Error sending email: ", error);
    return res.status(500).json({ message: "L'email n'a pas pu être envoyé" });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Le mot de passe est requis" });
  }

  const hashedToken = hashToken(resetPasswordToken);

  const userToken = await Token.findOne({
    passwordResetToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return res
      .status(400)
      .json({ message: "Jeton d'identification invalide ou expiré" });
  }

  const user = await User.findById(userToken.userId);

  user.password = password;
  await user.save();

  res.status(200).json({ message: "Le mot de passe a bien été réinitialisé" });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  const user = await User.findById(req.user._id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Mot de passe invalide" });
  }

  if (isMatch) {
    user.password = newPassword;
    await user.save();
    return res
      .status(200)
      .json({ message: "Le mot de passe a bien été modifié" });
  } else {
    return res
      .status(400)
      .json({ message: "Le mot de passe n'a pas pu être changé" });
  }
});

export const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Erreur avec getUserById", error.message);
    res.status(500).json(error.message);
  }
});

export const searchUsers = asyncHandler(async (req, res) => {
  const query = req.query.q;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const userId = req.user._id;

    const users = await User.find({
      name: { $regex: query, $options: "i" },
      _id: { $ne: userId },
    })
      .select("-password")
      .limit(limit)
      .skip(skip);

    const totalUsers = await User.countDocuments({
      name: { $regex: query, $options: "i" },
      _id: { $ne: userId },
    });

    res.status(200).json({
      data: users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalResults: totalUsers,
    });
  } catch (error) {
    console.log("Erreur avec searchUsers: ", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la recherche d'utilisateurs" });
  }
});

export const friendRequest = asyncHandler(async (req, res) => {
  try {
    const requestingUser = req.user._id;
    const { recipientId } = req.body;
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Receveur introuvable" });
    }

    if (recipient.friends.includes(requestingUser)) {
      return res.status(400).json({ message: "Déjà amis" });
    }

    if (recipient.friendRequest.includes(requestingUser)) {
      return res.status(400).json({ message: "Demande d'ami déjà envoyée" });
    }

    recipient.friendRequest.push(requestingUser);
    await recipient.save();

    res.status(200).json({ message: "Demande d'ami envoyée" });
  } catch (error) {
    console.log("Erreur lors de l'envoi de la demande d'amitié: ", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'envoi de la demande d'amitié" });
  }
});

export const acceptFriendRequest = asyncHandler(async (req, res) => {
  try {
    const recipientId = req.user._id;
    const { requestingUserId } = req.body;

    const recipient = await User.findById(recipientId);
    const requestingUser = await User.findById(requestingUserId);

    if (!recipient || !requestingUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const requestIndex = recipient.friendRequest.indexOf(requestingUserId);
    if (requestIndex === -1) {
      return res.status(400).json({ message: "Demande d'ami non trouvée" });
    }

    recipient.friends.push(requestingUserId);
    requestingUser.friends.push(recipientId);
    recipient.friendRequest.splice(requestIndex, 1);

    await recipient.save();
    await requestingUser.save();

    res.status(200).json({ message: "Demande d'ami acceptée" });
  } catch (error) {
    console.log("Erreur lors de l'acceptation de la demande d'amitié: ", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'acceptation de la demande d'amitié" });
  }
});
