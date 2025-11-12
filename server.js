require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./database.js");
const authenticateToken = require("./middleware/auth.js");

const app = express();
const PORT = process.env.PORT || 3200;
const JWT_SECRET = process.env.JWT_SECRET || "rahasia_super_aman";

// Middleware utama
app.use(cors());
app.use(express.json());

// Status server
app.get("/status", (req, res) => {
  res.json({ ok: true, status: "Server is running", service: "Movie API" });
});

// AUTH SECTION 

// REGISTER
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || password.length < 6) {
    return res.status(400).json({ error: "Username dan password tidak valid" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: "Gagal memproses pendaftaran" });
    }

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.run(sql, [username.toLowerCase(), hashedPassword], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint")) {
          return res.status(409).json({ error: "Username sudah terdaftar" });
        }
        return res.status(500).json({ error: "Gagal menyimpan pengguna" });
      }
      res.status(201).json({
        message: "Registrasi berhasil",
        userId: this.lastID,
      });
    });
  });
});

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username dan password wajib diisi" });

  const sql = "SELECT * FROM users WHERE username = ?";
  db.get(sql, [username.toLowerCase()], (err, user) => {
    if (err || !user)
      return res.status(401).json({ error: "Username atau password salah" });

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch)
        return res.status(401).json({ error: "Username atau password salah" });

      const payload = { id: user.id, username: user.username };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
      res.json({ message: "Login sukses", token });
    });
  });
});

//MOVIES SECTION

// GET semua film
app.get("/movies", (req, res) => {
  const sql = "SELECT * FROM movies ORDER BY id ASC";
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "success", data: rows });
  });
});

// GET film berdasarkan ID
app.get("/movies/:id", (req, res) => {
  const sql = "SELECT * FROM movies WHERE id = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "success", data: row });
  });
});

// POST tambah film (dengan autentikasi)
app.post("/movies", authenticateToken, (req, res) => {
  const { title, director, year } = req.body;
  if (!title || !director || !year)
    return res
      .status(400)
      .json({ message: "Judul, sutradara, dan tahun wajib diisi" });

  const sql = "INSERT INTO movies (title, director, year) VALUES (?, ?, ?)";
  db.run(sql, [title, director, year], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Movie berhasil ditambahkan", id: this.lastID });
  });
});

//DIRECTORS SECTION 

// GET semua sutradara
app.get("/directors", (req, res) => {
  const sql = "SELECT * FROM directors ORDER BY id ASC";
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "success", data: rows });
  });
});

// GET sutradara berdasarkan nama
app.get("/directors/:name", (req, res) => {
  const sql = "SELECT * FROM directors WHERE name = ?";
  db.all(sql, [req.params.name], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    if (rows.length === 0)
      return res.status(404).json({ message: "Director not found" });
    res.json({ message: "success", data: rows });
  });
});

// POST tambah sutradara
app.post("/directors", authenticateToken, (req, res) => {
  const { name, country } = req.body;
  if (!name || !country)
    return res
      .status(400)
      .json({ message: "Nama dan negara sutradara wajib diisi" });

  const sql = "INSERT INTO directors (name, country) VALUES (?, ?)";
  db.run(sql, [name, country], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Director berhasil ditambahkan", id: this.lastID });
  });
});

// PUT ubah sutradara
app.put("/directors/:id", authenticateToken, (req, res) => {
  const { name, country } = req.body;
  const { id } = req.params;

  if (!name || !country)
    return res
      .status(400)
      .json({ message: "Nama dan negara sutradara wajib diisi" });

  const sql = "UPDATE directors SET name = ?, country = ? WHERE id = ?";
  db.run(sql, [name, country, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Director tidak ditemukan" });
    res.json({ message: "Director berhasil diperbarui" });
  });
});

// DELETE hapus sutradara
app.delete("/directors/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM directors WHERE id = ?";
  db.run(sql, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Director tidak ditemukan" });
    res.json({ message: "Director berhasil dihapus" });
  });
});

//START SERVER
app.listen(PORT, () => {
  console.log(`✅ Server aktif di http://localhost:${PORT}`);
});
