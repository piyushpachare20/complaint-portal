import { z } from 'zod';

export const createComplaintSchema = z.object({
    title: z.string()
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title must be less than 100 characters'),
    description: z.string()
        .min(20, 'Description must be at least 20 characters')
        .max(500, 'Description must be less than 500 characters'),
    category: z.enum(['pothole', 'garbage', 'water_leak', 'street_light', 'drainage', 'other']),
    photo: z.instanceof(File)
        .refine(file => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
        .refine(
            file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            'Only JPEG, PNG, and WebP images are allowed'
        )
        .optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

export const updateComplaintSchema = z.object({
    status: z.enum(['open', 'in_progress', 'resolved', 'rejected']),
    resolution_remarks: z.string().max(500).optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone_number: z.string().optional(),
});

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;
export type UpdateComplaintInput = z.infer<typeof updateComplaintSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
