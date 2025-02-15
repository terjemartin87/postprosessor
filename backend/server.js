require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Koble til PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ✅ Endepunkt for å hente postprosessorer fra databasen
app.get("/api/postprosessorer", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM postprosessorer");
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Endepunkt for å legge til en ny postprosessor
app.post("/api/postprosessorer", async (req, res) => {
  try {
    const { name, version } = req.body;
    if (!name || !version) {
      return res.status(400).json({ error: "Navn og versjon kreves" });
    }

    const result = await pool.query(
      "INSERT INTO postprosessorer (name, version) VALUES ($1, $2) RETURNING *",
      [name, version]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Endepunkt for å slette en postprosessor
app.delete("/api/postprosessorer/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query("DELETE FROM postprosessorer WHERE id = $1 RETURNING *", [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Postprosessor ikke funnet" });
      }
  
      res.json({ message: "Postprosessor slettet", deleted: result.rows[0] });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  // Endepunkt for å oppdatere en postprosessor
app.put("/api/postprosessorer/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, version } = req.body;
  
      if (!name || !version) {
        return res.status(400).json({ error: "Navn og versjon kreves" });
      }
  
      const result = await pool.query(
        "UPDATE postprosessorer SET name = $1, version = $2 WHERE id = $3 RETURNING *",
        [name, version, id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Postprosessor ikke funnet" });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

// ✅ Start serveren
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server kjører på port ${PORT}`);
});