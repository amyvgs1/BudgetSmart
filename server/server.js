const express = require("express");
const cors = require("cors");
const app = express();
const { initDatabase } = require('./db/db');

const corsOptions = {
    origin : ["http://localhost:5173"]
}

// initialize database with exported function
const db = initDatabase();


app.use(cors(corsOptions));
app.use(express.json())

app.get("/api", (req, res) =>{
    res.json({test : [1, 2, 3, 4]});
});

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

        return res.status(200).json({message:'Login Successful'});
    })
})

app.listen(8080, () => {
    console.log("Server started on port 8080");
});

