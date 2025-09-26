require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

// Buat koneksi untuk movies
const dbMovies = new sqlite3.Database(process.env.DB_MOVIES, (err) => {
    if (err) {
        console.error("Gagal konek ke DB Movies:", err.message);
    } else {
        console.log("Connected ke DB Movies:", process.env.DB_MOVIES);

        dbMovies.run(`CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            director TEXT NOT NULL,
            year INTEGER NOT NULL
        )`, (err) => {
            if (!err) {
                // cek apakah masih kosong
                dbMovies.get("SELECT COUNT(*) as count FROM movies", (err, row) => {
                    if (!err && row.count === 0) {
                        console.log("Mengisi data awal movies...");
                        const insert = "INSERT INTO movies (title, director, year) VALUES (?,?,?)";
                        dbMovies.run(insert, ["Inception", "Christopher Nolan", 2010]);
                        dbMovies.run(insert, ["The Matrix", "The Wachowskis", 1999]);
                        dbMovies.run(insert, ["Interstellar", "Christopher Nolan", 2014]);
                    }
                });
            }
        });
    }
});

// Buat koneksi untuk directors
const dbDirectors = new sqlite3.Database(process.env.DB_DIRECTORS, (err) => {
    if (err) {
        console.error("Gagal konek ke DB Directors:", err.message);
    } else {
        console.log("Connected ke DB Directors:", process.env.DB_DIRECTORS);

        dbDirectors.run(`CREATE TABLE IF NOT EXISTS directors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            birthYear INTEGER
        )`, (err) => {
            if (!err) {
                // cek apakah masih kosong
                dbDirectors.get("SELECT COUNT(*) as count FROM directors", (err, row) => {
                    if (!err && row.count === 0) {
                        console.log("Mengisi data awal directors...");
                        const insert = "INSERT INTO directors (name, birthYear) VALUES (?,?)";
                        dbDirectors.run(insert, ["Christopher Nolan", 1970]);
                        dbDirectors.run(insert, ["The Wachowskis", 1965]);
                        dbDirectors.run(insert, ["Quentin Tarantino", 1963]);
                    }
                });
            }
        });
    }
});

module.exports = { dbMovies, dbDirectors };
