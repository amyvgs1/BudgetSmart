const express = require("express");
const cors = require("cors");
const app = express();
const { initDatabase } = require('./db/db');

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "https://budgetsmart.us"
    ]
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
            console.log(err)
            return res.status(500).json({message:"Database Error"});
        }
        console.log(row);
        return res.status(200).json({ message: 'account created' });
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

// Search users
app.get('/api/users/search', (req, res) => {
    const { query, currentUserId } = req.query;
    console.log('Search endpoint hit with:', { query, currentUserId });
    
    if (!query) {
        return res.json({ users: [] });
    }
    
    const searchPattern = `%${query}%`;
    
    // First, let's check if the friends table exists and has the correct structure
    db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='friends'", [], (err, result) => {
        if (err) {
            console.error('Error checking friends table:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Friends table structure:', result);
        
        // Simplified query first - just search without friend filtering
        const sql = `
            SELECT u.user_id as id, u.username, u.first_name || ' ' || u.last_name as name
            FROM users u
            WHERE (u.username LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)
            AND u.user_id != ?
        `;
        
        db.all(sql, [searchPattern, searchPattern, searchPattern, currentUserId], (err, rows) => {
            if (err) {
                console.error('Search error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            console.log('Search results:', rows);
            res.json({ users: rows });
        });
    });
});

// Send friend request
app.post('/api/friends/request', (req, res) => {
    const { userId, friendId } = req.body;
    console.log('Attempting to create friend request:', { userId, friendId });

    // Check if any relationship exists (in either direction)
    db.get(`
        SELECT * FROM friends 
        WHERE (user_id = ? AND friend_id = ?) 
           OR (user_id = ? AND friend_id = ?)
    `, [userId, friendId, friendId, userId], (err, existing) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (existing) {
            console.log('Existing relationship found:', existing);
            return res.status(400).json({ error: 'A relationship already exists with this user' });
        }

        // If no relationship exists, create new friend request
        db.run(`
            INSERT INTO friends (user_id, friend_id, status)
            VALUES (?, ?, 'pending')
        `, [userId, friendId], function(err) {
            if (err) {
                console.error('Error creating friend request:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            console.log('Friend request created successfully');
            res.json({ 
                message: 'Friend request sent',
                friendshipId: this.lastID 
            });
        });
    });
});

// Get friend requests
app.get('/api/friends/requests/:userId', (req, res) => {
    const { userId } = req.params;
    console.log('Fetching requests for user:', userId);
    
    db.all(`
        SELECT f.friendship_id, f.status, f.created_at,
               u.user_id, u.username, u.first_name || ' ' || u.last_name as name
        FROM friends f
        JOIN users u ON f.user_id = u.user_id
        WHERE f.friend_id = ? AND f.status = 'pending'
    `, [userId], (err, received) => {
        if (err) {
            console.error('Error fetching received requests:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        db.all(`
            SELECT f.friendship_id, f.status, f.created_at,
                   u.user_id, u.username, u.first_name || ' ' || u.last_name as name
            FROM friends f
            JOIN users u ON f.friend_id = u.user_id
            WHERE f.user_id = ? AND f.status = 'pending'
        `, [userId], (err, sent) => {
            if (err) {
                console.error('Error fetching sent requests:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            console.log('Requests:', { received, sent });
            res.json({ received, sent });
        });
    });
});

// Accept/decline friend request
app.put('/api/friends/request/:friendshipId', (req, res) => {
    const { friendshipId } = req.params;
    const { status } = req.body; // 'accepted' or 'declined'
    
    db.run(`
        UPDATE friends
        SET status = ?
        WHERE friendship_id = ?
    `, [status, friendshipId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: `Friend request ${status}` });
    });
});

// Get friends list
app.get('/api/friends/:userId', (req, res) => {
    const { userId } = req.params;
    console.log('Fetching friends for user:', userId);
    
    db.all(`
        SELECT 
            u.user_id, 
            u.username, 
            u.first_name || ' ' || u.last_name as name,
            f.created_at as friends_since,
            f.friendship_id
        FROM friends f
        JOIN users u ON (f.friend_id = u.user_id OR f.user_id = u.user_id)
        WHERE (f.user_id = ? OR f.friend_id = ?)
        AND f.status = 'accepted'
        AND u.user_id != ?
    `, [userId, userId, userId], (err, rows) => {
        if (err) {
            console.error('Error fetching friends:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Friends:', rows);
        res.json({ friends: rows });
    });
});

// Test endpoint to list all users
app.get('/api/users/all', (req, res) => {
    const query = `
        SELECT 
            u.user_id,
            u.username,
            COALESCE(us.total_saved, 0) as totalSaved,
            COALESCE(us.savings_goal, 2000) as goal
        FROM users u
        LEFT JOIN user_savings us ON u.user_id = us.user_id
        ORDER BY totalSaved DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        // Add ranks to the sorted data
        const usersWithRanks = rows.map((user, index) => ({
            ...user,
            rank: index + 1
        }));

        res.json({ users: usersWithRanks });
    });
});

// Add an endpoint to update user savings
app.post('/api/users/savings', (req, res) => {
    const { user_id, total_saved, savings_goal } = req.body;
    
    const query = `
        INSERT INTO user_savings (user_id, total_saved, savings_goal)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id) 
        DO UPDATE SET 
            total_saved = ?,
            savings_goal = ?
    `;

    db.run(query, [user_id, total_saved, savings_goal, total_saved, savings_goal], (err) => {
        if (err) {
            console.error('Error updating savings:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true });
    });
});

// Remove/decline friend request endpoint
app.delete('/api/friends/:friendshipId', (req, res) => {
    const { friendshipId } = req.params;
    console.log('Removing friendship:', friendshipId);
    
    // Actually delete the record instead of just updating status
    db.run(`
        DELETE FROM friends 
        WHERE friendship_id = ?
    `, [friendshipId], (err) => {
        if (err) {
            console.error('Error removing friend request:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Friend request removed successfully' });
    });
});

// Get friends with savings data
app.get('/api/friends/leaderboard/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `
        SELECT 
            u.user_id,
            u.username,
            COALESCE(us.total_saved, 0) as totalSaved,
            COALESCE(us.savings_goal, 2000) as goal
        FROM friends f
        JOIN users u ON f.friend_id = u.user_id
        LEFT JOIN user_savings us ON u.user_id = us.user_id
        WHERE f.user_id = ? AND f.status = 'accepted'
        ORDER BY totalSaved DESC
    `;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching friends:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Add ranks to the sorted data
        const friendsWithRanks = rows.map((friend, index) => ({
            ...friend,
            rank: index + 1
        }));

        res.json({ friends: friendsWithRanks });
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

