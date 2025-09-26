const express = require('express');
const app = express();
const port = 3200;

// ini merupakan import db nya
const {dbMovies, dbDirectors} = require('./database');

app.use(express.json());

// Data Movies
// let movies = [
//     { id: 1, title: 'Inception', director: 'Christopher Nolan', year: 2010 },
//     { id: 2, title: 'The Matrix', director: 'The Wachowskis', year: 1999 },
//     { id: 3, title: 'Interstellar', director: 'Christopher Nolan', year: 2014 }
// ];

// Data Directors
// let directors = [
//     { id: 1, name: 'Christopher Nolan', birthYear: 1970 },
//     { id: 2, name: 'The Wachowskis', birthYear: 1965 },
//     { id: 3, name: 'Quentin Tarantino', birthYear: 1963 }
// ];

// ini digunakan untuk routes movies nya
app.get('/', (req, res) => {
    res.send('Selamat datang di API Film!');
});

app.get('/movies', (req, res) => {
    const sql = "SELECT * FROM movies ORDER BY id ASC";
    dbMovies.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/movies/:id', (req, res) => {
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send('Film tidak ditemukan');
    }
});

app.get('/movies/title/:title', (req, res) => {
    const movie = movies.find(m => m.title.toLowerCase() === req.params.title.toLowerCase());
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send('Film tidak ditemukan');
    }
});

// ini digunakan untuk post pada movies
app.post('/movies', (req, res) => {
    const { title, director, year } = req.body;
    if (!title || !director || !year) {
        return res.status(400).json({ message: "Title, director, dan year harus diisi" });
    }
    const sql = "INSERT INTO movies (title, director, year) VALUES (?, ?, ?)";
    dbMovies.run(sql, [title, director, year], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title, director, year });
    });
});

// digunakan untuk mengupdate data pada movies
app.put('/movies/:id', (req, res) => {
    const { title, director, year } = req.body;
    const sql = "UPDATE movies SET title = ?, director = ?, year = ? WHERE id = ?";
    dbMovies.run(sql, [title, director, year, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
            return res.status(404).json({ message: "Film tidak ditemukan" });
        }
        res.json({ id: req.params.id, title, director, year });
    });
});

// digunakan untuk menghapus data pada movies
app.delete('/movies/:id', (req, res) => {
    const sql = "DELETE FROM movies WHERE id = ?";
    dbMovies.run(sql, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
            return res.status(404).json({ message: "Film tidak ditemukan" });
        }
        res.json({ message: "Film berhasil dihapus" });
    });
});

// Routes Directors

// GET all directors
app.get('/directors', (req, res) => {
   const sql = "SELECT * FROM directors ORDER BY id ASC";
    dbDirectors.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET director by id, jadi ini digunakan untuk melihat directors berdasarkan id nya
app.get('/directors/:id', (req, res) => {
    const sql = "SELECT * FROM directors WHERE id = ?";
    dbDirectors.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) {
            return res.status(404).json({ message: "Sutradara tidak ditemukan" });
        }
        res.json(row);
    });
});

// POST director
app.post('/directors', (req, res) => {
    const { name, birthYear } = req.body;
    if (!name || !birthYear) {
        return res.status(400).json({ message: "Name dan birthYear harus diisi" });
    }
    const sql = "INSERT INTO directors (name, birthYear) VALUES (?, ?)";
    dbDirectors.run(sql, [name, birthYear], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, name, birthYear });
    });
});

// UPDATE director
app.put('/directors/:id', (req, res) => {
    const { name, birthYear } = req.body;
    const sql = "UPDATE directors SET name = ?, birthYear = ? WHERE id = ?";
    dbDirectors.run(sql, [name, birthYear, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
            return res.status(404).json({ message: "Sutradara tidak ditemukan" });
        }
        res.json({ id: req.params.id, name, birthYear });
    });
});

// DELETE director
app.delete('/directors/:id', (req, res) => {
    const sql = "DELETE FROM directors WHERE id = ?";
    dbDirectors.run(sql, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
            return res.status(404).json({ message: "Sutradara tidak ditemukan" });
        }
        res.json({ message: "Sutradara berhasil dihapus" });
    });
});

// Default 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// Jalankan Server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});