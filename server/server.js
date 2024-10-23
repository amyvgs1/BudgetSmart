const express = require("express");
const cors = require("cors");
const app = express();
const { initDatabase } = require('./db/db');

const corsOptions = {
    origin : ["http://localhost:5173"]
}

// initialize database with exported function
const db = initDatabase();

// middleware
app.use(cors(corsOptions));
app.use(express.json())


app.post('/login', (req, res) =>{
    const {email, password} = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) =>{
        if (err){
            return res.status(500).json({message: 'Database Error'});
        }

        // user is not in database at all 
        if(!row){
            return res.status(401).json({message:'User does not exist'});
        }

        if (row.password !== password){
            return res.status(401).json({message:'Invalid Email or Password'});
        }

        console.log(row.user_id);
        return res.status(200).json({message:'Login Successful', id: row.user_id, name:`${row.first_name} ${row.last_name}`});
    })
})

app.post('/create', (req, res) =>{
    const {firstName, lastName, username, email, password} = req.body;

    db.run(`INSERT INTO users(first_name, last_name, username, email, password) VALUES(?,?,?,?,?)`, [firstName, lastName, username, email, password], (err, row) => {
        if(err){
            return res.status(500).json({message:"Database Error"});
        }

        return res.status(200).json({message:`Account Created`});
    });
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});

