-- First, clear any existing data
DELETE FROM user_savings;
DELETE FROM friends;
DELETE FROM users;

-- Insert users
INSERT OR REPLACE INTO users (user_id, first_name, last_name, username, email, password) 
VALUES 
    (1, 'Jane', 'Doe', 'janeDoe123', 'jdoe1@example.com', 'abc123'),
    (2, 'John', 'Doe', 'johnDoe2', 'jdoe3@example.com', 'abc123'),
    (3, 'Alice', 'Smith', 'aliceS', 'alice@example.com', 'abc123'),
    (4, 'Bob', 'Johnson', 'bobJ', 'bob@example.com', 'abc123'),
    (5, 'Charlie', 'Brown', 'charlieB', 'charlie@example.com', 'abc123'),
    (6, 'Diana', 'Prince', 'dianaP', 'diana@example.com', 'abc123'),
    (7, 'Test', 'User', 'testuser', 'test@example.com', 'abc123'),
    (8, 'Sample', 'Person', 'sampleperson', 'sample@example.com', 'abc123');

-- Insert categories
INSERT or REPLACE INTO category(category_id, category_name) VALUES 
    (2, "food"),
    (3, "bills"),
    (4, "clothing"),
    (5, "other");

-- Insert budget plans
INSERT OR REPLACE INTO budget_plan (budget_id, user_id, budget_name, total_budget, start_date, end_date) VALUES 
    (1, 1, 'BudgetTest1', 100, '2024-11-04', '2024-11-06'),
    (2, 2, 'BudgetTest2', 200, '2024-11-05', '2024-11-10');

-- Insert friendship data
INSERT OR REPLACE INTO friends (friendship_id, user_id, friend_id, status, created_at) 
VALUES
    (1, 1, 2, 'accepted', '2024-03-15 10:00:00'),
    (2, 1, 3, 'accepted', '2024-03-16 11:00:00'),
    (3, 4, 1, 'pending', '2024-03-17 12:00:00'),
    (4, 5, 1, 'pending', '2024-03-17 13:00:00'),
    (5, 1, 6, 'pending', '2024-03-17 14:00:00'),
    (6, 2, 5, 'declined', '2024-03-17 15:00:00');

-- Insert user savings data
INSERT OR REPLACE INTO user_savings (user_id, total_saved, savings_goal) VALUES
    (1, 2500.00, 3000.00),
    (2, 1800.00, 2500.00),
    (3, 3200.00, 4000.00),
    (4, 1500.00, 2000.00),
    (5, 900.00, 1500.00),
    (6, 2100.00, 3000.00),
    (7, 1200.00, 2000.00),
    (8, 1700.00, 2500.00);