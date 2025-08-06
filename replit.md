# TeamHub - Project Migration

## Overview
TeamHub is a collaborative project management application originally built with Supabase and React. We are migrating it to Replit's environment with PostgreSQL, Drizzle ORM, and Express.js backend.

## Project Architecture
- **Frontend**: React with Vite, TypeScript, Tailwind CSS
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based auth with express-session
- **State Management**: React hooks and context

## Migration Progress
Currently migrating from Bolt/Supabase to Replit environment:
- ✅ Created Drizzle schema based on Supabase tables
- ✅ Implemented server-side storage layer with DatabaseStorage and MemStorage
- ✅ Created comprehensive API routes for all entities
- ✅ Added session-based authentication
- 🔄 Currently removing Supabase dependencies from frontend
- ⏳ Need to update frontend hooks to use new API endpoints

## Key Features
- Project management with Kanban boards
- Task tracking with comments and assignments
- Document management with templates
- User profiles and project collaboration
- Activity logging and analytics

## Database Schema
- `profiles` - User profiles and authentication
- `projects` - Project information and settings
- `project_members` - Project membership and roles
- `tasks` - Task management with status, priority, assignments
- `task_comments` - Comments and discussions on tasks
- `documents` - Document management
- `document_templates` - Reusable document templates
- `activity_logs` - System activity tracking

## Recent Changes
- 2025-08-06: Started migration from Bolt to Replit
- 2025-08-06: Created comprehensive Drizzle schema
- 2025-08-06: Implemented full API layer with Express routes
- 2025-08-06: Added session management for authentication

## User Preferences
None specified yet.

## Security Considerations
- Session-based authentication with secure cookies
- Server-side validation with Zod schemas
- Client/server separation with API-only backend
- Input sanitization and SQL injection prevention via Drizzle ORM