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

// returns all user budgets for display on my budgets page.
app.get('/api/mybudgets-display', (req, res) => {
    const user_id = req.query.user_id;
    console.log(`Query parameters: ${req.query.user_id}`)
    console.log(`querying for ${user_id}`);

    db.all(`SELECT * FROM budget_plan WHERE user_id = ?`, [user_id], (err, rows) => {
        if (err){
            return res.status(500).json({message: 'Database Error'});
        }

        console.log(rows)
        return res.status(200).json({budgets: rows});
    })
});


// responsible for creating budgets
app.post('/api/mybudgets-create', (req, res) => {
    const {user_id, budgetName, budgetAmount, isGroup, budgetItems } = req.body;

    db.run('BEGIN TRANSACTION', function(err) {
        // condition in case database action fails on startup
        if(err) {
            console.error('Failed to start transction process', err.message);
            return res.status(500).json({message: 'Failed to complete transaction'});
        }

        // first, attempt to create new budget plan
        db.run(`INSERT INTO budget_plan(user_id, budget_name, total_budget, is_group_plan) VALUES(?,?,?,?)`, [user_id,budgetName, budgetAmount, isGroup], function(err) {
            if(err){
                console.error('Could not insert budget:', err.message);
                db.run('ROLLBACK');
                return res.status(500).json({message: 'Failed to create budget'});
            }

            const budgetId = this.lastID; //refers to most recently inserted values
            console.log(`This .lastID : ${budgetId}`);
            
            
            // next, try to add budget items from budget list if any
            if (budgetItems && budgetItems.length > 0){
                const insert = db.prepare('INSERT INTO budget_items(budget_id, item_name, category_id, amount) VALUES(?, ?, ?, ?)');
                console.log(budgetItems)
                for(const item of budgetItems){
                    insert.run([budgetId, item.name, item.category, item.amount ], function(err){
                        if (err) {
                            db.run('ROLLBACK');
                            insert.finalize();
                            return res.status(500).json({message: "Could not add items to budget"});
                        }
                    });
                }
                insert.finalize();
            }

            db.run("COMMIT", function(err){
                if(err){
                    db.run('ROLLBACK');
                    return res.status(500).json({message: "Could not commit transaction"});
                }
                res.status(201).json({message: "Budget and budget items inserted successfully"});
            });
        });
    });

});

// responsible for returning all budget items of a given budget to display
app.get('/api/budgetdisplay/:budgetId', (req, res) => {
    const budgetId = req.params.budgetId;
    console.log(budgetId)

    // obtain all budget items to display
    db.all(`SELECT * FROM budget_items WHERE budget_id = ?`, [budgetId], (err,rows) => {
        if(err){
            console.error('Database Error:', err.message);
            return res.status(500).json({error: "Query Failed"});
        }
        console.log(rows);
        return res.status(200).json({items:rows});
    });
});


app.listen(8080, () => {
    console.log("Server started on port 8080");
});

