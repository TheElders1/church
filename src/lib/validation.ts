import { z } from 'zod'
import { teams } from '../data/teams'

const teamNames = teams.map((team) => team.name) as [string, ...string[]]

export const applicationSchema = z.object({
  full_name: z.string().trim().min(2, 'Please enter your full name'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(7, 'Enter a valid phone number')
    .regex(/^[+\d][\d\s-]*$/, 'Enter a valid phone number'),
  age: z.coerce
    .number({ invalid_type_error: 'Age is required' })
    .int('Age must be a whole number')
    .min(12, 'You must be at least 12 years old')
    .max(120, 'Enter a valid age'),
  team: z.enum(teamNames, { errorMap: () => ({ message: 'Please select a team' }) }),
  reason: z.string().trim().min(20, 'Please share at least a few sentences'),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the Terms of Application to continue' }),
  }),
})

export type ApplicationFormValues = z.infer<typeof applicationSchema>

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  message: z.string().trim().min(10, 'Please write a short message'),
})

export type ContactFormValues = z.infer<typeof contactSchema>

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
