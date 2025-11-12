require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const DBSOURCE = process.env.DB_SOURCE || "movies.db";

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("✅ Connected to the SQLite database.");

    db.serialize(() => {
      console.log("⚙️ Running database setup...");

      // ============================
      // TABEL MOVIES
      // ============================
      db.run(
        `CREATE TABLE IF NOT EXISTS movies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          director TEXT NOT NULL,
          year INTEGER NOT NULL
        )`,
        (err) => {
          if (err) {
            console.error("Error creating movies table:", err.message);
          } else {
            console.log('🎬 Table "movies" is ready.');

            const sql_check = `SELECT COUNT(*) as count FROM movies`;
            db.get(sql_check, (err, row) => {
              if (err) return console.error("Error checking movies:", err.message);

              if (row.count === 0) {
                console.log("📀 Seeding initial movies data...");
                const sql_insert = `INSERT INTO movies (title, director, year) VALUES (?,?,?)`;
                db.run(sql_insert, ["Parasite", "Bong Joon-ho", 2019]);
                db.run(sql_insert, ["The Dark Knight", "Christopher Nolan", 2008]);
                db.run(sql_insert, ["Man of Steel", "Zack Snyder", 2013]);
                db.run(sql_insert, ["Superman Returns", "Bryan Singer", 2006]);
              }
            });
          }
        }
      );

      // ============================
      // TABEL USERS
      // ============================
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        )`,
        (err) => {
          if (err) {
            console.error("Error creating users table:", err.message);
          } else {
            console.log('👤 Table "users" is ready.');
          }
        }
      );

      // ============================
      // TABEL DIRECTORS
      // ============================
      db.run(
        `CREATE TABLE IF NOT EXISTS directors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          country TEXT NOT NULL
        )`,
        (err) => {
          if (err) {
            console.error("Error creating directors table:", err.message);
          } else {
            console.log('🎥 Table "directors" is ready.');

            const sql_check_dir = `SELECT COUNT(*) as count FROM directors`;
            db.get(sql_check_dir, (err, row) => {
              if (err) return console.error("Error checking directors:", err.message);

              if (row.count === 0) {
                console.log("🎞️ Seeding initial directors data...");
                const sql_insert_dir = `INSERT INTO directors (name, country) VALUES (?, ?)`;
                db.run(sql_insert_dir, ["Christopher Nolan", "United Kingdom"]);
                db.run(sql_insert_dir, ["Bong Joon-ho", "South Korea"]);
                db.run(sql_insert_dir, ["Zack Snyder", "USA"]);
              }
            });
          }
        }
      );
    });
  }
});

module.exports = db;
