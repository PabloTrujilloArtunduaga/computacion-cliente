import {z} from 'zod';

export const registerSchema = z.object({

    username: z.string({
        required_error: 'The username is required',
    }),
    
    email: z.string({
        required_error: 'The email is required',
    }),
    
    password: z.string({
        required_error: 'The password is required',
    })
    .min(5, {
        message: 'Password must be at least 5 characters'
    })
})


export const loginSchema = z.object({

    email: z.string({
        required_error: 'The email is required',
    })
    .refine(
        (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    {
      message: 'Invalid email format',
    }
    ),
    
    password: z.string({
        required_error: 'The password is required',
    })
    .min(5, {
        message: 'Password must be at least 5 characters'
    })
})