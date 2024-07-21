import asyncHandler from "express-async-handler";

import User from "../../models/auth/userModel.js";

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.status(200).json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.status(404).json({ message: "Aucun utilisateur retrouvé" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});
