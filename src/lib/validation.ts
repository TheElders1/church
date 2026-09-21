import { z } from 'zod'
import { teams } from '../data/teams'

const teamNames = teams.map((team) => team.name) as [string, ...string[]]

const MAX_PHOTO_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

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
  date_of_birth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((val) => !Number.isNaN(Date.parse(val)), 'Enter a valid date')
    .refine((val) => new Date(val) <= new Date(), 'Date of birth cannot be in the future'),
  sex: z.enum(['Male', 'Female'], { errorMap: () => ({ message: 'Please select your sex' }) }),
  photo: z
    .custom<FileList>((val) => val instanceof FileList, 'Please upload a photo of yourself')
    .refine((files) => files.length === 1, 'Please upload a photo of yourself')
    .refine((files) => files[0]?.size <= MAX_PHOTO_SIZE, 'Photo must be smaller than 5MB')
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
      'Photo must be a JPG, PNG, or WEBP image'
    ),
  team: z.enum(teamNames, { errorMap: () => ({ message: 'Please select a team' }) }),
  reason: z.string().trim().min(20, 'Please share at least a few sentences'),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the Terms of Application to continue' }),
  }),
})

export type ApplicationFormValues = z.infer<typeof applicationSchema>

export const accessCodeSchema = z.object({
  code: z.string().trim().min(1, 'Enter your access code'),
})

export type AccessCodeFormValues = z.infer<typeof accessCodeSchema>

export const reportAnswersSchema = z.object({
  answer_1: z.string().trim().min(1, 'Please answer this question'),
  answer_2: z.string().trim().min(1, 'Please answer this question'),
  answer_3: z.string().trim().min(1, 'Please answer this question'),
  answer_4: z.string().trim().min(1, 'Please answer this question'),
  answer_5: z.string().trim().min(1, 'Please answer this question'),
  answer_6: z.string().trim().min(1, 'Please answer this question'),
})

export type ReportAnswersFormValues = z.infer<typeof reportAnswersSchema>

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

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
