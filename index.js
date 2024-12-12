// Importeren van de express module in node_modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('./classes/database.js');

// Aanmaken van een express app
const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3306', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// Middleware om JSON-requests te parsen
app.use(bodyParser.json());

// Endpoints
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Endpoints voor USER ACCOUNTS
    //1. Nieuwe user registreren
app.post('/api/users', (req, res) => {
    console.log(req.body);
    const { name } = req.body;
    const db = new Database();
    console.log(name);
    db.getQuery('INSERT INTO User (UserType, Username, DateOfBirth, Email, Password, PhoneNumber, ProfilePicture) VALUES(?, ?, ?, ?, ?, ?, ?)'
      , [name])
        .then(() => res.status(201).send({ message: 'Account created succesfully' }))
        .catch((error) => res.status(500).send({ error: 'Failed to create account', details: error }));
  });

// Endpoints voor CAMPINGSPOTS
    //1. Create campingspot
app.post('/api/campingspots', (req, res) => {
    console.log(req.body);
    const { name } = req.body;
    const db = new Database();
    console.log(name);
    db.getQuery('INSERT INTO CampingSpot (Name, Description, Location, Latitude, Longitude, Size, OwnerID) VALUES (?, ?, ?, ?, ?, ?, ?)'
      , [name])
        .then(() => res.status(201).send({ message: 'Campingspot was succesfully added' }))
        .catch((error) => res.status(500).send({ error: 'Failed to create new campingspot', details: error }));
  });

    //2. Show all campingspots --> endpoint getest = OK
app.get('/api/campingspots', (req, res) => {
    const db = new Database();
    db.getQuery('SELECT * FROM CampingSpot').then((campingspots) => {
        res.send(campingspots);
    });
});

// Endpoints voor AMENITIES


// Endpoints voor BOOKING
    //1. Booking
app.post('/api/bookings', (req, res) => {
    console.log(req.body);
    const { name } = req.body;
    const db = new Database();
    console.log(name);
    db.getQuery('INSERT INTO Booking (StartDate, EndDate, TotalPrice, Status, PaymentStatus, CampingSpotID, UserID) VALUES (?, ?, ?, ?, ?, ?, ?)'
      , [name])
        .then(() => res.status(201).send({ message: 'Thanks for your booking, current status: pending' }))
        .catch((error) => res.status(500).send({ error: 'Oops, something went wrong.', details: error }));
});

    //2. Bookings per user laten zien
app.get('/api/bookings', (req, res) => {
    const db = new Database();
    db.getQuery('SELECT * FROM Booking WHERE UserID = ?').then((bookings) => {
        res.send(bookings);
    });
});

    //3. Booking details van specifieke booking laten zien
app.get('/api/bookings', (req, res) => {
    const db = new Database();
    db.getQuery('SELECT * FROM Booking WHERE ID = ?').then((bookings) => {
        res.send(bookings);
    });
});


// Endpoints voor MESSAGES


// Endpoints voor REVIEWS
    //1. Nieuwe review plaatsen
app.post('/api/reviews', (req, res) => {
    console.log(req.body);
    const { name } = req.body;
    const db = new Database();
    console.log(name);
    db.getQuery('INSERT INTO Review (Rating, Review, UserID, CampingSpotID) VALUES (?, ?, ?, ?)'
      , [name])
        .then(() => res.status(201).send({ message: 'Thanks for your review!' }))
        .catch((error) => res.status(500).send({ error: 'Oops, something went wrong.', details: error }));
});

    //2. Reviews per campingspot laten zien
app.get('/api/reviews', (req, res) => {
    const db = new Database();
    db.getQuery('SELECT * FROM Review WHERE CampingSpotID = ?;').then((reviews) => {
        res.send(reviews);
    });
});








// Blabla van eurosong api
app.get('/api/artists', (req, res) => {
    const db = new Database();
    db.getQuery('SELECT * FROM artists').then((artists) => {
        res.send(artists);
    });
});

app.get('/api/songs', (req, res) => {
    const db = new Database();
    db.getQuery(`
        SELECT
            song_id, s.name AS songname, a.name AS artistname
        FROM
            songs AS s
                INNER JOIN
                    artists AS a
                        ON
                            s.artist_id = a.artist_id;
    `).then((songs) => {
        res.send(songs);
    });
});

app.get('/api/ranking', (req, res) => {
    const db = new Database();
    db.getQuery(`
        SELECT songs.song_id, songs.name AS song_name, artists.name AS artist_name, SUM(points) AS total_points
        FROM
            votes
                INNER JOIN
                    songs
                        ON songs.song_id = votes.song_id
                INNER JOIN
                    artists
                        ON songs.artist_id = artists.artist_id
        GROUP BY song_id
        ORDER BY SUM(points) DESC;
    `).then((ranking) => {
        res.send(ranking);
    });
});

app.post('/api/artists', (req, res) => {
    console.log(req.body);
    const { name } = req.body;
    const db = new Database();
    console.log(name);
    db.getQuery('INSERT INTO artists (name) VALUES (?)', [name])
        .then(() => res.status(201).send({ message: 'Artist added successfully' }))
        .catch((error) => res.status(500).send({ error: 'Failed to add artist', details: error }));
});

app.post('/api/songs', (req, res) => {
    const { name, artist_id } = req.body;
    const db = new Database();
    db.getQuery('INSERT INTO songs (name, artist_id) VALUES (?, ?)', [name, artist_id])
        .then(() => res.status(201).send({ message: 'Song added successfully' }))
        .catch((error) => res.status(500).send({ error: 'Failed to add song', details: error }));
});

// POST endpoint om een nieuwe stem toe te voegen
app.post('/api/votes', (req, res) => {
    const { song_id, points } = req.body;
    const db = new Database();
    db.getQuery('INSERT INTO votes (song_id, points) VALUES (?, ?)', [song_id, points])
        .then(() => res.status(201).send({ message: 'Vote added successfully' }))
        .catch((error) => res.status(500).send({ error: 'Failed to add vote', details: error }));
});

// Starten van de server en op welke port de server moet luisteren, NIET VERWIJDEREN
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});