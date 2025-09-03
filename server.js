const express = require('express');
const app = express();
const port = 3200;

app.use(express.json());

// Data Movies
let movies = [
    { id: 1, title: 'Inception', director: 'Christopher Nolan', year: 2010 },
    { id: 2, title: 'The Matrix', director: 'The Wachowskis', year: 1999 },
    { id: 3, title: 'Interstellar', director: 'Christopher Nolan', year: 2014 }
];

// Data Directors
let directors = [
    { id: 1, name: 'Christopher Nolan', birthYear: 1970 },
    { id: 2, name: 'The Wachowskis', birthYear: 1965 },
    { id: 3, name: 'Quentin Tarantino', birthYear: 1963 }
];

// Routes Movies
app.get('/', (req, res) => {
    res.send('Selamat datang di API Film!');
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

app.post('/movies', (req, res) => {
    const { title, director, year } = req.body;
    if (!title || !director || !year) {
        return res.status(400).json({ message: "Title, director, dan year harus diisi" });
    }
    const newMovie = {
        id: movies.length + 1,
        title,
        director,
        year
    };
    movies.push(newMovie);
    res.status(201).json(newMovie);
});

// UPDATE movie
app.put('/movies/:id', (req, res) => {
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (!movie) return res.status(404).json({ message: "Film tidak ditemukan" });

    const { title, director, year } = req.body;
    if (title) movie.title = title;
    if (director) movie.director = director;
    if (year) movie.year = year;

    res.json(movie);
});

// DELETE movie
app.delete('/movies/:id', (req, res) => {
    const index = movies.findIndex(m => m.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Film tidak ditemukan" });

    const deleted = movies.splice(index, 1);
    res.json(deleted[0]);
});

// Routes Directors

// GET all directors
app.get('/directors', (req, res) => {
    res.json(directors);
});

// GET director by id
app.get('/directors/:id', (req, res) => {
    const director = directors.find(d => d.id === parseInt(req.params.id));
    if (!director) return res.status(404).json({ message: "Sutradara tidak ditemukan" });
    res.json(director);
});

// POST director
app.post('/directors', (req, res) => {
    const { name, birthYear } = req.body;
    if (!name || !birthYear) {
        return res.status(400).json({ message: "Name dan birthYear harus diisi" });
    }
    const newDirector = {
        id: directors.length + 1,
        name,
        birthYear
    };
    directors.push(newDirector);
    res.status(201).json(newDirector);
});

// UPDATE director
app.put('/directors/:id', (req, res) => {
    const director = directors.find(d => d.id === parseInt(req.params.id));
    if (!director) return res.status(404).json({ message: "Sutradara tidak ditemukan" });

    const { name, birthYear } = req.body;
    if (name) director.name = name;
    if (birthYear) director.birthYear = birthYear;

    res.json(director);
});

// DELETE director
app.delete('/directors/:id', (req, res) => {
    const index = directors.findIndex(d => d.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Sutradara tidak ditemukan" });

    const deleted = directors.splice(index, 1);
    res.json(deleted[0]);
});

// Default 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// Jalankan Server
app.listen(port, () => {
    console.log('Server berjalan di http://localhost:${port}');
});