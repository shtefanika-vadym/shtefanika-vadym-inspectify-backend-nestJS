// Auto-generated Zod schemas from Prisma schema
import { z } from 'zod';

export const TemplateStatusEnum = z.enum(['failed', 'succeeded', 'processing']);
export type TemplateStatus = z.infer<typeof TemplateStatusEnum>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  passwordHash: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  templates: z.string().uuid(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  passwordHash: z.string().min(8, 'Password must be at least 8 characters'),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial();
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export const TemplateSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  fileUrl: z.string(),
  templateContent: z.string(),
  categories: z.any(),
  status: TemplateStatusEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
  md5Hash: z.string(),
  user: z.string().uuid(),
});

export type Template = z.infer<typeof TemplateSchema>;

export const CreateTemplateSchema = z.object({
  userId: z.string(),
  fileUrl: z.string(),
  templateContent: z.string(),
  categories: z.any(),
  status: TemplateStatusEnum,
  md5Hash: z.string(),
});

export type CreateTemplate = z.infer<typeof CreateTemplateSchema>;

export const UpdateTemplateSchema = CreateTemplateSchema.partial();
export type UpdateTemplate = z.infer<typeof UpdateTemplateSchema>;

