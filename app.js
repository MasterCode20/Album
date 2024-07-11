require('dotenv').config();
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const path = require("path");
const albumRoutes = require("./routes/album.routes");

const app = express();

// Connexion à MongoDB
mongoose.connect("mongodb://localhost/phototheque") // connect

app.get("/", (req, res) => {
  res.redirect("/albums");
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Configuration de session
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// Routes
app.use("/", albumRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404);
  res.send("Page non trouvée");
});

// Gestion des erreurs serveur
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500);
  res.send("Erreur interne du serveur");
});

// Démarrage du serveur
app.listen(3000, () => {
  console.log("Appli lancée sur le port 3000");
});
