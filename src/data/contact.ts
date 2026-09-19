import { Facebook, Music2, Send, Youtube, type LucideIcon } from 'lucide-react'

export const contactEmail = 'medicalstudentsfellowshipagbor@gmail.com'

export const contactPhones = ['+234 912 204 5854', '+234 805 427 7641', '+234 803 171 4574']

export interface SocialLink {
  name: string
  handle: string
  icon: LucideIcon
}

export const socialLinks: SocialLink[] = [
  { name: 'Facebook', handle: '@MedicalStudentsFellowship.UNIDEL', icon: Facebook },
  { name: 'TikTok', handle: '@MedicalStudentsFellowship.UNIDEL', icon: Music2 },
  { name: 'Telegram', handle: '@Medicalstudentsfellowship.UNIDEL', icon: Send },
  { name: 'YouTube', handle: '@Medicalstudentsfellowship', icon: Youtube },
]
