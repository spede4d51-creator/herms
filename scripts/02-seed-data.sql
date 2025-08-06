-- Insert sample users
INSERT INTO users (id, email, full_name, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@herms.com', 'Admin User', 'admin'),
('550e8400-e29b-41d4-a716-446655440002', 'manager@herms.com', 'Project Manager', 'manager'),
('550e8400-e29b-41d4-a716-446655440003', 'developer@herms.com', 'Senior Developer', 'member'),
('550e8400-e29b-41d4-a716-446655440004', 'designer@herms.com', 'UI/UX Designer', 'member')
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, name, description, status, priority, start_date, end_date, created_by) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'HERMS Platform Development', 'Development of the Human Resource Management System platform', 'active', 'high', '2024-01-01', '2024-06-30', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440002', 'Mobile App Development', 'Development of mobile application for HERMS', 'planning', 'medium', '2024-03-01', '2024-08-31', '550e8400-e29b-41d4-a716-446655440002'),
('660e8400-e29b-41d4-a716-446655440003', 'UI/UX Redesign', 'Complete redesign of the user interface and experience', 'active', 'medium', '2024-02-01', '2024-05-31', '550e8400-e29b-41d4-a716-446655440004')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (id, title, description, status, priority, project_id, assigned_to, due_date, created_by) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Setup Database Schema', 'Create and configure the database schema for the HERMS platform', 'done', 'high', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '2024-01-15', '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440002', 'Implement Authentication', 'Implement user authentication and authorization system', 'in_progress', 'high', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '2024-02-01', '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440003', 'Design Dashboard UI', 'Create wireframes and mockups for the main dashboard', 'review', 'medium', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '2024-02-15', '550e8400-e29b-41d4-a716-446655440004'),
('770e8400-e29b-41d4-a716-446655440004', 'Project Management Module', 'Develop the project management functionality', 'todo', 'high', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '2024-03-01', '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440005', 'Mobile App Architecture', 'Define the architecture for the mobile application', 'todo', 'medium', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '2024-03-15', '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440006', 'User Research', 'Conduct user research for the UI/UX redesign', 'in_progress', 'medium', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '2024-02-28', '550e8400-e29b-41d4-a716-446655440004')
ON CONFLICT (id) DO NOTHING;
