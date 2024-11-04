const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { initDatabase } = require('./db'); 

const app = express();
const PORT = 8081; // Choose a port that is not already in use

// Enable CORS to allow requests from different origins
app.use(cors());

// Initialize the database
const db = initDatabase();

// Define an endpoint to fetch all budget plans
app.get('/budget_plan', (req, res) => {
    const query = 'SELECT * FROM budget_plan';
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
