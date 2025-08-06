-- Insert sample users
INSERT INTO users (id, email, full_name, role) VALUES
('user-1', 'admin@herms.com', 'Admin User', 'admin'),
('user-2', 'manager@herms.com', 'Project Manager', 'manager'),
('user-3', 'developer@herms.com', 'Senior Developer', 'member'),
('user-4', 'designer@herms.com', 'UI/UX Designer', 'member')
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, name, description, status, priority, start_date, end_date, created_by) VALUES
('proj-1', 'Website Redesign', 'Complete redesign of the company website with modern UI/UX', 'active', 'high', '2024-01-01', '2024-03-31', 'user-1'),
('proj-2', 'Mobile App Development', 'Develop a mobile application for iOS and Android', 'planning', 'medium', '2024-02-01', '2024-06-30', 'user-2'),
('proj-3', 'Database Migration', 'Migrate legacy database to modern cloud infrastructure', 'active', 'high', '2024-01-15', '2024-02-28', 'user-1'),
('proj-4', 'Marketing Campaign', 'Q1 marketing campaign for product launch', 'completed', 'medium', '2023-12-01', '2024-01-31', 'user-2')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (id, title, description, status, priority, project_id, assigned_to, due_date, created_by) VALUES
-- Website Redesign tasks
('task-1', 'Create wireframes', 'Design wireframes for all main pages', 'done', 'high', 'proj-1', 'user-4', '2024-01-15', 'user-1'),
('task-2', 'Develop homepage', 'Implement the new homepage design', 'in_progress', 'high', 'proj-1', 'user-3', '2024-02-01', 'user-1'),
('task-3', 'Setup responsive design', 'Ensure website works on all devices', 'todo', 'medium', 'proj-1', 'user-3', '2024-02-15', 'user-1'),
('task-4', 'Content migration', 'Migrate existing content to new design', 'todo', 'low', 'proj-1', 'user-2', '2024-02-20', 'user-1'),

-- Mobile App Development tasks
('task-5', 'Market research', 'Research competitor apps and user needs', 'done', 'medium', 'proj-2', 'user-2', '2024-01-20', 'user-2'),
('task-6', 'Create app mockups', 'Design mockups for key app screens', 'in_progress', 'high', 'proj-2', 'user-4', '2024-02-10', 'user-2'),
('task-7', 'Setup development environment', 'Configure React Native development setup', 'todo', 'medium', 'proj-2', 'user-3', '2024-02-15', 'user-2'),

-- Database Migration tasks
('task-8', 'Backup current database', 'Create full backup of existing database', 'done', 'high', 'proj-3', 'user-3', '2024-01-20', 'user-1'),
('task-9', 'Setup cloud infrastructure', 'Configure new cloud database instance', 'in_progress', 'high', 'proj-3', 'user-3', '2024-01-30', 'user-1'),
('task-10', 'Data migration script', 'Write scripts to migrate data safely', 'todo', 'high', 'proj-3', 'user-3', '2024-02-05', 'user-1'),

-- Marketing Campaign tasks
('task-11', 'Campaign strategy', 'Develop overall campaign strategy', 'done', 'high', 'proj-4', 'user-2', '2023-12-15', 'user-2'),
('task-12', 'Create marketing materials', 'Design brochures, ads, and digital content', 'done', 'medium', 'proj-4', 'user-4', '2024-01-10', 'user-2'),
('task-13', 'Launch campaign', 'Execute the marketing campaign', 'done', 'high', 'proj-4', 'user-2', '2024-01-31', 'user-2')
ON CONFLICT (id) DO NOTHING;
