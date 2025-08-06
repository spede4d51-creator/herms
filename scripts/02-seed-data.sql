-- Insert sample users
INSERT INTO users (id, email, name, avatar_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'john.doe@example.com', 'John Doe', '/placeholder.svg?height=32&width=32'),
  ('550e8400-e29b-41d4-a716-446655440001', 'jane.smith@example.com', 'Jane Smith', '/placeholder.svg?height=32&width=32'),
  ('550e8400-e29b-41d4-a716-446655440002', 'mike.johnson@example.com', 'Mike Johnson', '/placeholder.svg?height=32&width=32')
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, name, description, status, owner_id) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', 'Website Redesign', 'Complete redesign of the company website with modern UI/UX', 'active', '550e8400-e29b-41d4-a716-446655440000'),
  ('660e8400-e29b-41d4-a716-446655440001', 'Mobile App Development', 'Develop a mobile application for iOS and Android platforms', 'active', '550e8400-e29b-41d4-a716-446655440001'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Database Migration', 'Migrate legacy database to new cloud infrastructure', 'completed', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (id, title, description, status, priority, project_id, assignee_id, due_date) VALUES
  ('770e8400-e29b-41d4-a716-446655440000', 'Design Homepage Mockup', 'Create wireframes and mockups for the new homepage design', 'in_progress', 'high', '660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', '2024-02-15 17:00:00+00'),
  ('770e8400-e29b-41d4-a716-446655440001', 'Implement User Authentication', 'Set up user login and registration functionality', 'todo', 'high', '660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', '2024-02-20 17:00:00+00'),
  ('770e8400-e29b-41d4-a716-446655440002', 'Setup Development Environment', 'Configure development tools and dependencies', 'done', 'medium', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '2024-01-30 17:00:00+00'),
  ('770e8400-e29b-41d4-a716-446655440003', 'Create API Endpoints', 'Develop REST API endpoints for mobile app', 'todo', 'high', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2024-02-25 17:00:00+00'),
  ('770e8400-e29b-41d4-a716-446655440004', 'Data Backup Verification', 'Verify all data has been successfully backed up', 'done', 'high', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '2024-01-15 17:00:00+00'),
  ('770e8400-e29b-41d4-a716-446655440005', 'Performance Testing', 'Run performance tests on the new database setup', 'done', 'medium', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '2024-01-20 17:00:00+00')
ON CONFLICT (id) DO NOTHING;
