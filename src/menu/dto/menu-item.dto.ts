import { z } from 'zod';

export const CreateMenuItemSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().min(0, 'Price must be positive'),
    category: z.string().min(1, 'Category is required'),
  }),
});

export const UpdateMenuItemSchema = CreateMenuItemSchema;

export const GetMenuItemSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
