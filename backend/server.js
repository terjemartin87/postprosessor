require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Sett opp PostgreSQL
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Middleware for autentisering
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Ingen tilgang" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Ugyldig token" });
    req.user = user;
    next();
  });
};

// 📂 Sett opp Multer for filopplasting
const upload = multer({ dest: "uploads/" });

// 📂 Endepunkt for filopplasting
app.post("/api/upload", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    const { filename, originalname } = req.file;
    await pool.query("INSERT INTO files (filename, originalname) VALUES ($1, $2)", [filename, originalname]);
    res.status(201).json({ message: "Fil lastet opp" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// 📂 Endepunkt for å hente filer
app.get("/api/files", authenticateToken, async (req, res) => {
  const result = await pool.query("SELECT * FROM files");
  res.json(result.rows);
});

// 📂 Endepunkt for nedlasting
app.get("/api/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  res.download(filePath);
});

// 📂 Endepunkt for sletting av filer
app.delete("/api/delete/:filename", authenticateToken, async (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  fs.unlink(filePath, async (err) => {
    if (err) return res.status(500).json({ error: "Feil ved sletting" });
    await pool.query("DELETE FROM files WHERE filename = $1", [req.params.filename]);
    res.json({ message: "Fil slettet" });
  });
});

// Start serveren
app.listen(5000, () => console.log("🚀 Server kjører på port 5000"));