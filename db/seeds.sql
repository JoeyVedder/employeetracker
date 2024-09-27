-- Insert departments
INSERT INTO departments (id, name) VALUES
(1, 'Engineering'),
(2, 'Sales'),
(3, 'HR'),
(4, 'Dietary') 
ON CONFLICT (id) DO NOTHING;

-- Insert roles
INSERT INTO roles (id, title, salary, department_id) VALUES
(1, 'Software Engineer', 100000.00, 1),
(2, 'Sales Manager', 80000.00, 2),
(3, 'HR Specialist', 60000.00, 3),
(4, 'Chef', 35000.00, 4) 
ON CONFLICT (id) DO NOTHING;

-- Insert employees
INSERT INTO employees (id, first_name, last_name, role_id, manager_id) VALUES
(1, 'Joey', 'Vedder', 1, 1),  
(2, 'Tommy', 'Stemler', 2, NULL), 
(3, 'Elliot', 'Stocker', 3, 4),   
(4, 'Ian', 'Crockner', 3, NULL),     
(5, 'Hannah', 'Kennamer', 4, NULL)   
ON CONFLICT (id) DO NOTHING;
