-- Insert sample users
INSERT INTO users (id, email, name, avatar_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', 'John Doe', NULL),
  ('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com', 'Jane Smith', NULL),
  ('550e8400-e29b-41d4-a716-446655440003', 'mike.johnson@example.com', 'Mike Johnson', NULL),
  ('550e8400-e29b-41d4-a716-446655440004', 'sarah.wilson@example.com', 'Sarah Wilson', NULL)
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, name, description, status, owner_id) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Website Redesign', 'Complete redesign of the company website with modern UI/UX', 'active', '550e8400-e29b-41d4-a716-446655440001'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Mobile App Development', 'Develop a cross-platform mobile application', 'active', '550e8400-e29b-41d4-a716-446655440002'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Database Migration', 'Migrate legacy database to new cloud infrastructure', 'completed', '550e8400-e29b-41d4-a716-446655440003'),
  ('660e8400-e29b-41d4-a716-446655440004', 'Marketing Campaign', 'Q1 marketing campaign for product launch', 'on-hold', '550e8400-e29b-41d4-a716-446655440004')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (id, title, description, status, priority, project_id, assignee_id, due_date) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'Design Homepage Mockup', 'Create wireframes and mockups for the new homepage', 'completed', 'high', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '2024-01-15 17:00:00+00'),
  ('770e8400-e29b-41d4-a716-446655440002', 'Implement Navigation Menu', 'Code the responsive navigation menu component', 'in-progress', 'medium', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2024-01-20 17:00:00+00'),
  ('770e8400-e29b-41d4-a716-446655440003', 'Setup Development Environment', 'Configure React Native development environment', 'completed', 'high', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '2024-01-10 17:00:00+00'),
  ('770e8400-e29b-41d4-a716-446655440004', 'Create User Authentication', 'Implement login and registration functionality', 'todo', 'high', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '2024-01-25 17:00:00+00'),
  ('770e8400-e29b-41d4-a716-446655440005', 'Data Backup Verification', 'Verify all data has been properly backed up', 'completed', 'high', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '2024-01-05 17:00:00+00'),
  ('770e8400-e29b-41d4-a716-446655440006', 'Content Strategy Planning', 'Plan content strategy for the marketing campaign', 'todo', 'medium', '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '2024-02-01 17:00:00+00')
ON CONFLICT (id) DO NOTHING;
