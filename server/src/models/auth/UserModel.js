import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Merci d'entrer votre nom."],
    },

    email: {
      type: String,
      required: [true, "Merci d'entrer votre email."],
      unique: true,
      trim: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Merci d'entrer une adresse email valide.",
      ],
    },

    password: {
      type: String,
      required: [true, "Merci d'entrer un mot de passe."],
      minLength: 6,
    },

    photo: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/19819005?v=4",
    },

    bio: {
      type: String,
      default: "Je suis un nouveau.",
    },

    role: {
      type: String,
      enum: ["user", "admin", "creator"],
      default: "user",
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    friendRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    lastSeen: {
      type: Date,
      default: Date.now(),
    },

    theme: {
      type: String,
      default: "light",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, minimize: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;

  next();
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
