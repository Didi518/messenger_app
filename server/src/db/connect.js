import mongoose from "mongoose";

const connect = async () => {
  try {
    console.log("Tentative de connexion à la base de données....");
    const conn = await mongoose.connect(
      process.env.MONGODB_URL.replace(
        "<password>",
        process.env.MONGODB_PASSWORD
      )
    );
    console.log(
      `Base de données ${conn.connection.name} connectée avec succès!, ${conn.connection.host}`
    );
  } catch (error) {
    console.log(
      "Echec de la connexion à la base de données....",
      error.message
    );
    process.exit(1);
  }
};

export default connect;
