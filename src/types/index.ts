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
  | 'prayer'

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
  date_of_birth: string
  sex: 'Male' | 'Female'
  photo_path: string
  team: string
  reason: string
  status: ApplicationStatus
  access_code: string | null
  created_at: string
}

export interface FollowUpReport {
  id: string
  week_start: string
  week_end: string
  answer_1: string
  answer_2: string
  answer_3: string
  answer_4: string
  answer_5: string
  answer_6: string
  created_at: string
}

export interface ReportPortalSession {
  applicant_id: string
  full_name: string
  reports: FollowUpReport[]
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}
