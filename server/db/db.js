const sqlite3 = require("sqlite3").verbose();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

// database path
const db_path = path.join(__dirname,'BudgetSmart_data.db');

// initialize database with dummy values
const initDbPath = path.join(__dirname, 'initialize.sql');
const dummyVals = path.join(__dirname, 'seed.sql');

// database intialize function
function initDatabase(){
    const db = new sqlite3.Database(db_path, (err) => {
        if (err){
            console.log(`Error: ${err.message}`);
        } else{
            console.log('Database initialization was successful');
        }
    });

    // Initialize db tables
    const initSql = fs.readFileSync(initDbPath, 'utf8');

    // Execute the SQL script
    db.exec(initSql, (err) => {
        if (err){
            console.log(`Error: ${err.message}`);
        } else{
            console.log('Database was initialized');

            // Provide dummy values
            const dummySql = fs.readFileSync(dummyVals, 'utf8');
            db.exec(dummySql, (err) => {
                if (err){
                    console.log(`Error: ${err.message}`);
                } else {
                    console.log('Dummy values inserted successfully');
                }
            });
        }
    });
    return db;
}
// Fetch Budget function
function fetchBudget(db) {
    const app = express();
    app.use(cors());
    
    // Middleware to log all requests
    app.use((req, res, next) => {
        console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
        next();
    });

    // Setup route
    app.get('/plans', (req, res) => {
        console.log("Received GET request on /plans");
        const userId = req.query.user_id;

        if (!userId) {
            console.log("No user_id provided");
            return res.status(400).json({ error: "User ID is required" });
        }

        // Query budget plans for the specified user_id
        db.all("SELECT * FROM budget_plan WHERE user_id = ?", [userId], (err, rows) => {
            if (err) {
                console.error("Error fetching budget plans:", err.message);
                res.status(500).json({ error: "Failed to fetch budget plans" });
            } else {
                console.log("Successfully fetched budget plans:", rows);
                res.json(rows);
            }
        });
    });
    
    // Start server
    const PORT = 8081;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Start the application

// there is already database initalization in server. if any database actions are needed do it in server this file is just for initializing 
// database logic, i should have mentioned that but with this logic we have database intialization twice.

// const db = initDatabase(); 
// Initialize the database
// fetchBudget(db);

module.exports = { initDatabase };

