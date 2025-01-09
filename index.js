// Importeren van de express module in node_modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('./classes/database.js');

// Aanmaken van een express app
const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:8080', // Allow requests from this origin
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

  app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const db = new Database();
    
    db.getQuery('SELECT * FROM User WHERE Email = ?', [email])
      .then((users) => {
        if (users.length === 0) {
          return res.status(401).send({ error: 'Invalid email or password' });
        }
        
        const user = users[0];
        
        // Compare passwords
        if (user.Password !== password) {  // Note: using user.Password instead of User.Password
          return res.status(401).send({ error: 'Invalid email or password' });
        }
        
        // Successful login response
        res.status(200).send({
          message: 'Login successful',
          userId: user.ID,          // Changed from UserId to match your frontend
          userType: user.UserType   // Changed from Role to match your database schema
        });
      })
      .catch((error) => {
        console.error('Login error:', error); // Add error logging
        res.status(500).send({ error: 'Failed to log in', details: error });
      });
  });

// Endpoints voor CAMPINGSPOTS
    //1. Create campingspot
app.post('/api/campingspots', (req, res) => {
    console.log(req.body);
    const { name } = req.body;
    const db = new Database();
    console.log(name);
    db.getQuery('INSERT INTO CampingSpot (Name, ShortDescription, LongDescription, Location, Latitude, Longitude, Size, Price, OwnerID, CreatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      , [name])
        .then(() => res.status(201).send({ message: 'Campingspot was added succesfully' }))
        .catch((error) => res.status(500).send({ error: 'Failed to create new campingspot', details: error }));
  });

    //2. Show all campingspots --> endpoint getest = OK
app.get('/api/campingspots', (req, res) => {
    const db = new Database();
    db.getQuery('SELECT * FROM CampingSpot').then((campingspots) => {
        res.send(campingspots);
    });
});

    //3. Show 1 specific campingspot
// app.get('/api/campingspots/:ID', (req, res) => {
//     const { ID } = req.params;
//     console.log('Requested ID:', ID);
//     const db = new Database();
  
//     db.getQuery('SELECT * FROM CampingSpot WHERE ID = ?', [ID])
//       .then((campingspot) => {
//         console.log('Query result:', campingspot);
//         if (campingspot.length > 0) {
//           res.send(campingspot[0]); // Return the first (and only) result
//         } else {
//           res.status(404).send({ error: 'Camping spot not found' });
//         }
//       })
//       .catch((error) => {
//         res.status(500).send({ error: 'Failed to fetch campingspot', details: error });
//       });
//   });

app.get('/api/campingspots/:id', (req, res) => {
    const { id } = req.params;
    console.log('Requested ID:', id);  // Debug log
  
    const db = new Database();
    // Modified query to verify table name and column names
    const query = `
      SELECT 
        cs.ID,
        cs.Name,
        cs.ShortDescription,
        cs.LongDescription,
        cs.Location,
        cs.Latitude,
        cs.Longitude,
        cs.Size,
        cs.Price,
        cs.OwnerID,
        cs.CreatedAt
      FROM CampingSpot cs
      WHERE cs.ID = ?
    `;
  
    db.getQuery(query, [id])
      .then((campingspot) => {
        console.log('Query result:', campingspot);  // Debug log
        if (campingspot.length > 0) {
          res.send(campingspot[0]);
        } else {
          res.status(404).send({ error: 'Camping spot not found' });
        }
      })
      .catch((error) => {
        console.error('Database error:', error);  // Debug log
        res.status(500).send({ error: 'Failed to fetch campingspot', details: error });
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
    db.getQuery('SELECT * FROM Review WHERE CampingSpotID = ?').then((reviews) => {
        res.send(reviews);
    });
}); 

// Starten van de server en op welke port de server moet luisteren, NIET VERWIJDEREN
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});