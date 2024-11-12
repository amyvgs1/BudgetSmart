INSERT OR REPLACE INTO users (user_id, first_name, last_name, username, email, password) VALUES (1, 'Jane', 'Doe', 'janeDoe123', 'jdoe1@example.com', 'abc123');
INSERT OR REPLACE INTO users (user_id, first_name, last_name, username, email, password) VALUES (2, 'John', 'Doe', 'johnDoe2', 'jdoe3@example.com', 'abc123');
INSERT OR REPLACE INTO budget_plan (budget_id, user_id, budget_name, total_budget, start_date, end_date) VALUES (1, 1, 'BudgetTest1', 100, '2024-11-04', '2024-11-06');

INSERT or REPLACE INTO category(category_id, category_name) VALUES (2, "food");
INSERT or REPLACE INTO category(category_id, category_name) VALUES (3, "bills");
INSERT or REPLACE INTO category(category_id, category_name) VALUES (4, "clothing");
INSERT or REPLACE INTO category(category_id, category_name) VALUES (5, "other");
INSERT OR REPLACE INTO budget_plan (budget_id, user_id, budget_name, total_budget, start_date, end_date) VALUES (2, 2, 'BudgetTest2', 200, '2024-11-05', '2024-11-10');

-- Existing users (modified to include more details)
INSERT OR REPLACE INTO users (user_id, first_name, last_name, username, email, password) 
VALUES 
    (1, 'Jane', 'Doe', 'janeDoe123', 'jdoe1@example.com', 'abc123'),
    (2, 'John', 'Doe', 'johnDoe2', 'jdoe3@example.com', 'abc123'),
    (3, 'Alice', 'Smith', 'aliceS', 'alice@example.com', 'abc123'),
    (4, 'Bob', 'Johnson', 'bobJ', 'bob@example.com', 'abc123'),
    (5, 'Charlie', 'Brown', 'charlieB', 'charlie@example.com', 'abc123'),
    (6, 'Diana', 'Prince', 'dianaP', 'diana@example.com', 'abc123');
    (7, 'Test', 'User', 'testuser', 'test@example.com', 'abc123'),
    (8, 'Sample', 'Person', 'sampleperson', 'sample@example.com', 'abc123');

-- Add some test friendship relationships
INSERT OR REPLACE INTO friends (friendship_id, user_id, friend_id, status, created_at) 
VALUES
    -- Accepted friendships
    (1, 1, 2, 'accepted', '2024-03-15 10:00:00'),
    (2, 1, 3, 'accepted', '2024-03-16 11:00:00'),
    
    -- Pending requests
    (3, 4, 1, 'pending', '2024-03-17 12:00:00'),  -- Bob sent request to Jane
    (4, 5, 1, 'pending', '2024-03-17 13:00:00'),  -- Charlie sent request to Jane
    
    -- Jane sent requests
    (5, 1, 6, 'pending', '2024-03-17 14:00:00'),  -- Jane sent request to Diana
    
    -- Declined request
    (6, 2, 5, 'declined', '2024-03-17 15:00:00'); -- John's declined request to Charlie

-- Add some test friendship relationships
INSERT OR REPLACE INTO friends (user_id, friend_id, status, created_at) 
VALUES
    (1, 7, 'pending', CURRENT_TIMESTAMP),
    (1, 8, 'accepted', CURRENT_TIMESTAMP);
