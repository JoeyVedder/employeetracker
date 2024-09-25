INSERT INTO departments (name) VALUES
('Engineering'),
('Sales'),
('HR')
ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (title, salary, department_id) VALUES
('Software Engineer', 100000.00, 1),
('Sales Manager', 80000.00, 2),
('HR Specialist', 60000.00, 3)
ON CONFLICT (title) DO NOTHING;

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('Joey', 'Vedder', 1, NULL),
('Tommy', 'Stemler', 2, NULL),
('Elliot', 'Stocker', 3, 2),
('Ian', 'Crockner', 3, 3),
('Hannah', 'Kennamer', 3, 3)
ON CONFLICT (first_name, last_name) DO NOTHING; 
