import { pgTable, text, uuid, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Profiles table (users)
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  role: text("role").notNull().default('member'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  telegramId: text("telegram_id"),
  telegramUsername: text("telegram_username"),
});

// Projects table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").default(''),
  color: text("color").default('#3B82F6'),
  status: text("status").default('active'),
  ownerId: uuid("owner_id").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  lastActivity: timestamp("last_activity", { withTimezone: true }).defaultNow(),
});

// Project members table
export const projectMembers = pgTable("project_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  role: text("role").default('member'),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").default(''),
  status: text("status").default('todo'),
  priority: text("priority").default('medium'),
  category: text("category").default('General'),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
  assigneeId: uuid("assignee_id").references(() => profiles.id, { onDelete: 'set null' }),
  createdBy: uuid("created_by").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Task comments table
export const taskComments = pgTable("task_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id").notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Document templates table
export const documentTemplates = pgTable("document_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").default(''),
  category: text("category").default('Прочее'),
  content: text("content").notNull(),
  fields: jsonb("fields").default('[]'),
  isCustom: boolean("is_custom").default(false),
  createdBy: uuid("created_by").references(() => profiles.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Documents table
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").default(''),
  templateId: uuid("template_id").references(() => documentTemplates.id, { onDelete: 'set null' }),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
  createdBy: uuid("created_by").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  status: text("status").default('draft'),
  counterparty: jsonb("counterparty"),
  templateFields: jsonb("template_fields").default('{}'),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Activity logs table
export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  details: jsonb("details").default('{}'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Insert schemas
export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastActivity: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskCommentSchema = createInsertSchema(taskComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentTemplateSchema = createInsertSchema(documentTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type TaskComment = typeof taskComments.$inferSelect;
export type InsertTaskComment = z.infer<typeof insertTaskCommentSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type DocumentTemplate = typeof documentTemplates.$inferSelect;
export type InsertDocumentTemplate = z.infer<typeof insertDocumentTemplateSchema>;

export type ProjectMember = typeof projectMembers.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;

// Legacy user table for compatibility
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
