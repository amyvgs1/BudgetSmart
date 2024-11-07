INSERT OR REPLACE INTO users (user_id, first_name, last_name, username, email, password) VALUES (1, 'Jane', 'Doe', 'janeDoe123', 'jdoe1@example.com', 'abc123');
INSERT OR REPLACE INTO users (user_id, first_name, last_name, username, email, password) VALUES (2, 'John', 'Doe', 'johnDoe2', 'jdoe3@example.com', 'abc123');
INSERT OR REPLACE INTO budget_plan (budget_id, user_id, budget_name, total_budget, start_date, end_date) VALUES (1, 1, 'BudgetTest1', 100, '2024-11-04', '2024-11-06');
INSERT OR REPLACE INTO budget_plan (budget_id, user_id, budget_name, total_budget, start_date, end_date) VALUES (2, 2, 'BudgetTest2', 200, '2024-11-05', '2024-11-10');
