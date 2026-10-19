import { z } from 'zod';

export const taskStatusEnum = z.enum(['todo', 'in_progress', 'completed'], {
  errorMap: () => ({ message: "Status must be one of: 'todo', 'in_progress', 'completed'" }),
});

export const taskPriorityEnum = z.enum(['low', 'medium', 'high'], {
  errorMap: () => ({ message: "Priority must be one of: 'low', 'medium', 'high'" }),
});

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title cannot be empty')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .default(''),
  status: taskStatusEnum.optional().default('todo'),
  priority: taskPriorityEnum.optional().default('medium'),
});

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Title cannot be empty')
      .max(100, 'Title cannot exceed 100 characters')
      .optional(),
    description: z
      .string()
      .trim()
      .max(500, 'Description cannot exceed 500 characters')
      .optional(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const taskIdParamSchema = z.object({
  id: z
    .string()
    .uuid('Invalid task ID format. Must be a valid UUID'),
});

export const taskQuerySchema = z.object({
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  search: z.string().trim().optional(),
  // Coerced from query string strings; defaults to 1 and 10
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;

