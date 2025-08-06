-- Insert sample users
INSERT INTO users (id, email, full_name, avatar_url) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', 'John Doe', '/placeholder.svg?height=40&width=40'),
    ('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com', 'Jane Smith', '/placeholder.svg?height=40&width=40'),
    ('550e8400-e29b-41d4-a716-446655440003', 'mike.johnson@example.com', 'Mike Johnson', '/placeholder.svg?height=40&width=40'),
    ('550e8400-e29b-41d4-a716-446655440004', 'sarah.wilson@example.com', 'Sarah Wilson', '/placeholder.svg?height=40&width=40')
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, name, description, status, created_by, due_date) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Website Redesign', 'Complete redesign of the company website with modern UI/UX', 'active', '550e8400-e29b-41d4-a716-446655440001', '2024-03-15'),
    ('660e8400-e29b-41d4-a716-446655440002', 'Mobile App Development', 'Develop a cross-platform mobile application', 'active', '550e8400-e29b-41d4-a716-446655440002', '2024-04-30'),
    ('660e8400-e29b-41d4-a716-446655440003', 'Database Migration', 'Migrate legacy database to new cloud infrastructure', 'completed', '550e8400-e29b-41d4-a716-446655440003', '2024-02-28'),
    ('660e8400-e29b-41d4-a716-446655440004', 'Marketing Campaign', 'Q1 marketing campaign for product launch', 'on_hold', '550e8400-e29b-41d4-a716-446655440004', '2024-03-31')
ON CONFLICT (id) DO NOTHING;

-- Insert project members
INSERT INTO project_members (project_id, user_id, role) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'owner'),
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'member'),
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'owner'),
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'member'),
    ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'owner'),
    ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (id, title, description, status, priority, project_id, assigned_to, created_by, due_date) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'Design Homepage Mockup', 'Create wireframes and mockups for the new homepage design', 'completed', 'high', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2024-02-15'),
    ('770e8400-e29b-41d4-a716-446655440002', 'Implement Responsive Layout', 'Code the responsive layout for all device sizes', 'in_progress', 'high', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2024-02-28'),
    ('770e8400-e29b-41d4-a716-446655440003', 'Setup Development Environment', 'Configure development environment for mobile app', 'completed', 'medium', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2024-01-30'),
    ('770e8400-e29b-41d4-a716-446655440004', 'Create User Authentication', 'Implement user login and registration system', 'todo', 'high', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2024-03-10'),
    ('770e8400-e29b-41d4-a716-446655440005', 'Data Backup Verification', 'Verify all data has been properly backed up', 'completed', 'high', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '2024-02-20'),
    ('770e8400-e29b-41d4-a716-446655440006', 'Create Marketing Materials', 'Design brochures and digital assets', 'todo', 'medium', '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '2024-03-15'),
    ('770e8400-e29b-41d4-a716-446655440007', 'SEO Optimization', 'Optimize website content for search engines', 'todo', 'medium', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2024-03-05'),
    ('770e8400-e29b-41d4-a716-446655440008', 'API Integration', 'Integrate third-party APIs for mobile app', 'in_progress', 'high', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2024-03-20')
ON CONFLICT (id) DO NOTHING;
