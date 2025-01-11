import { z } from 'zod';

export const CreateMenuItemSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    // the price can be string but converted to number
    price: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: 'Price must be a number',
      })
      .refine((val) => Number(val) > 0, {
        message: 'Price must be greater than 0',
      }),
    category: z.string().min(1, 'Category is required'),
    // photo: z.string().min(1, 'Photo is required'),
  }),
});

export const UpdateMenuItemSchema = CreateMenuItemSchema;

export const GetMenuItemSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const GetMenuItemsSchema = z.object({
  query: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  }),
});
