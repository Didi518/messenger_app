import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import fs from "node:fs";
import { createServer } from "node:http";

import connect from "./src/db/connect.js";
import errorHandler from "./src/helpers/errorHandler.js";
import User from "./src/models/auth/UserModel.js";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();
const httpServer = new createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(errorHandler);

let users = [];

const addUser = (userId, socketId) => {
  return (
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId })
  );
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const removeUser = async (socketId) => {
  const user = users.find((user) => user.socketId === socketId);

  if (user) {
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { lastSeen: new Date() },
      { new: true }
    );

    users = users.filter((user) => user.socketId !== socketId);

    io.emit("user disconnected", updatedUser);
  }
};

io.on("connection", (socket) => {
  console.log("utilisateur connecté", socket.id);

  socket.on("add user", (userId) => {
    addUser(userId, socket.id);

    io.emit("get users", users);
  });

  socket.on("send message", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);

    if (user) {
      io.to(user.socketId).emit("get message", {
        senderId,
        text,
      });
    } else {
      console.log("Utilisateur introuvable");
    }
  });

  socket.on("disconnect", async () => {
    console.log("utilisateur déconnecté", socket.id);
    await removeUser(socket.id);
    io.emit("get users", users);
  });
});

const routeFiles = fs.readdirSync("./src/routes");

routeFiles.forEach((file) => {
  import(`./src/routes/${file}`)
    .then((route) => {
      app.use("/api/v1", route.default);
    })
    .catch((error) => {
      console.log("Echec du chargement du fichier router", error);
    });
});

const server = async () => {
  try {
    await connect();
    httpServer.listen(port, () => {
      console.log(`Serveur connecté sur le port ${port}`);
    });
  } catch (error) {
    console.log("Echec lors du démarrage du serveur", error.message);
    process.exit(1);
  }
};

server();
