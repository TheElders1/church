import {
  HeartHandshake,
  DoorOpen,
  Camera,
  HandHeart,
  Church,
  Music,
  Settings2,
  Stethoscope,
  Handshake,
} from 'lucide-react'
import type { Team } from '../types'

export const teams: Team[] = [
  {
    id: 'counseling-pr',
    name: 'Counseling and Public Relations Team',
    tagline: 'A listening ear and a caring word',
    description:
      'Offers spiritual counsel and pastoral support to members walking through difficulty, and represents the fellowship warmly to visitors, guests, and the wider public.',
    responsibilities: [
      'Provide confidential, Christ-centered counsel to members in need',
      'Welcome and follow up with first-time visitors and enquirers',
      'Represent the fellowship\'s values in every public-facing conversation',
      'Handle sensitive matters with discretion and grace',
    ],
    icon: HeartHandshake,
  },
  {
    id: 'ushering',
    name: 'Ushering Team',
    tagline: 'Order and warmth from the door in',
    description:
      'Keeps services flowing smoothly — guiding members to their seats, managing the offering, and making sure every gathering feels calm, orderly, and welcoming.',
    responsibilities: [
      'Direct seating and manage crowd flow during services',
      'Coordinate the collection and handling of offerings',
      'Assist with crowd control at altar calls and special programs',
      'Maintain a composed, welcoming presence throughout each service',
    ],
    icon: DoorOpen,
  },
  {
    id: 'media',
    name: 'Media Team',
    tagline: 'Telling the fellowship\'s story',
    description:
      'Captures and shares the life of the fellowship through photography, videography, livestreaming, and social media — so no one, near or far, misses what God is doing.',
    responsibilities: [
      'Photograph and film services, programs, and outreaches',
      'Run livestreams and manage recording equipment',
      'Create and manage content for social media platforms',
      'Archive media for the fellowship\'s records',
    ],
    icon: Camera,
  },
  {
    id: 'welfare',
    name: 'Welfare Team',
    tagline: 'Caring for one another practically',
    description:
      'Looks after the physical and material wellbeing of members — visiting the sick, supporting members through hardship, and coordinating hospitality for gatherings.',
    responsibilities: [
      'Visit and check in on members who are sick, bereaved, or struggling',
      'Coordinate practical support during times of need',
      'Organize hospitality and refreshments for fellowship events',
      'Keep leadership informed of members\' welfare concerns',
    ],
    icon: HandHeart,
  },
  {
    id: 'sanctuary',
    name: 'Sanctuary Team',
    tagline: 'Preparing the house before He arrives',
    description:
      'Ensures the worship space is clean, arranged, and ready before every service and event, and properly secured and tidied afterward.',
    responsibilities: [
      'Arrange seating and set up the sanctuary before services',
      'Maintain cleanliness of the worship space',
      'Ensure equipment and furniture are properly stored after use',
      'Report maintenance needs to leadership promptly',
    ],
    icon: Church,
  },
  {
    id: 'worship',
    name: 'Worship Team',
    tagline: 'Leading hearts into His presence',
    description:
      'Leads the congregation in praise and worship through singing and instrumentation, helping create an atmosphere where people can freely encounter God.',
    responsibilities: [
      'Lead congregational singing during services and programs',
      'Rehearse regularly and prepare song sets with the worship lead',
      'Play instruments or sing as part of a coordinated team',
      'Model a lifestyle of worship on and off the platform',
    ],
    icon: Music,
  },
  {
    id: 'technical',
    name: 'Technical Team',
    tagline: 'Making sure everything works, every time',
    description:
      'Manages sound, lighting, and projection so that every service and program runs smoothly from a technical standpoint, without distraction.',
    responsibilities: [
      'Operate and maintain sound systems during services',
      'Manage lighting and stage equipment',
      'Run slides, lyrics, and visual projection',
      'Troubleshoot technical issues quickly and calmly',
    ],
    icon: Settings2,
  },
  {
    id: 'medical',
    name: 'Medical Team',
    tagline: 'Ready to help, whenever needed',
    description:
      'Provides basic first aid and medical support during services, programs, and outreaches, and helps members with health-related needs.',
    responsibilities: [
      'Provide first aid during services, events, and outreaches',
      'Keep a stocked and ready first aid kit',
      'Respond promptly to medical emergencies within the fellowship',
      'Advise leadership on health and safety matters',
    ],
    icon: Stethoscope,
  },
  {
    id: 'greeters',
    name: 'Greeters Team',
    tagline: 'The first smile they see',
    description:
      'Welcomes every member and visitor at the entrance with warmth and genuine friendliness, setting the tone for their entire experience.',
    responsibilities: [
      'Greet members and visitors warmly at entrances',
      'Help newcomers find their way and feel at ease',
      'Distribute bulletins or programs as needed',
      'Represent the fellowship\'s hospitality from the very first moment',
    ],
    icon: Handshake,
  },
]

export function getTeamByName(name: string): Team | undefined {
  return teams.find((team) => team.name === name)
}
