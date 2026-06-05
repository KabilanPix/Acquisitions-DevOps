import { z } from 'zod';

export const userIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('ID must be a positive integer'),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('ID must be a positive integer'),
  }),
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(255).optional(),
    email: z.string().email('Invalid email address').max(255).optional(),
    role: z.enum(['admin', 'user']).optional(),
  }).strict(),
});
