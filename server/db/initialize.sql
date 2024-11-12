CREATE TABLE IF NOT EXISTS users(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    dob DATE,
    verification BOOLEAN DEFAULT 0
);
CREATE TABLE IF NOT EXISTS dashboard_settings(
    user_id INT PRIMARY KEY,
    notifications BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE IF NOT EXISTS budget_plan (
    budget_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT,
    budget_name VARCHAR(100) NOT NULL,
    total_budget DECIMAL (10, 2) NOT NULL,
    curr_val REAL DEFAULT 0,
    successful BOOLEAN DEFAULT true,
    is_group_plan BOOLEAN DEFAULT false,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE IF NOT EXISTS group_plan_members (
    budget_id INT,
    member_id INT,
    username VARCHAR(100),
    PRIMARY KEY (budget_id, member_id) FOREIGN KEY (budget_id) REFERENCES budget_plan(budget_id),
    FOREIGN KEY (member_id) REFERENCES users(user_id)
);
CREATE TABLE IF NOT EXISTS budget_items (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    budget_id INT,
    item_name VARCHAR(100),
    category_id INT,
    amount REAL NOT NULL,
    FOREIGN KEY (budget_id) REFERENCES budget_plan(budget_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);
CREATE TABLE IF NOT EXISTS category (
    category_id INT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS friends (
    friendship_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (friend_id) REFERENCES users(user_id),
    UNIQUE(user_id, friend_id)
);
CREATE TABLE IF NOT EXISTS notifications (
    notifications_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    was_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);