import type { LucideIcon } from 'lucide-react'

export type TeamId =
  | 'counseling-pr'
  | 'ushering'
  | 'media'
  | 'welfare'
  | 'sanctuary'
  | 'worship'
  | 'technical'
  | 'medical'
  | 'greeters'

export interface Team {
  id: TeamId
  name: string
  tagline: string
  description: string
  responsibilities: string[]
  icon: LucideIcon
}

export const APPLICATION_STATUSES = ['Pending', 'Reviewed', 'Accepted', 'Rejected'] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export interface Application {
  id: string
  full_name: string
  email: string
  phone: string
  age: number
  team: string
  reason: string
  status: ApplicationStatus
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}
