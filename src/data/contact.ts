import { Facebook, Music2, Send, Youtube, type LucideIcon } from 'lucide-react'

export const contactEmail = 'medicalstudentsfellowshipagbor@gmail.com'

export const contactPhones = ['+234 812 602 9352', '+234 915 925 4479', '+234 915 924 5538']

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
