const sqlite3 = require("sqlite3").verbose();
const fs = require('fs');
const path = require('path');

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
            console.log('Database intialization was sucessful');
        }
    });

    // initialize db tables
    const initSql = fs.readFileSync(initDbPath, 'utf8');

    // execute the sql script
    db.exec(initSql, (err) => {
        if (err){
            console.log(`Error: ${err.message}`);
        } else{
            console.log('Database was initializd');

            // provide dummy values
            const dummySql = fs.readFileSync(dummyVals, 'utf8');
            db.exec(dummySql, (err) =>{
                if (err){
                    console.log(`Error: ${err.message}`);
                } else{
                    console.log('Dummy values inserted successfully')
                }
            });
        }
    });
    return db;
}

module.exports = {initDatabase}

