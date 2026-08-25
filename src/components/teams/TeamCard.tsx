import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { Team } from '../../types'
import { buttonClasses } from '../ui/Button'

export function TeamCard({ team }: { team: Team }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = team.icon

  return (
    <motion.div
      layout
      className="flex flex-col rounded-2xl border border-plum-100 bg-cream-50 p-6 shadow-soft"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-plum-100 text-plum-700">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-plum-900">{team.name}</h3>
          <p className="mt-1 text-sm font-medium text-gold-600">{team.tagline}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-plum-700">{team.description}</p>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold text-plum-700 hover:text-plum-900"
        aria-expanded={expanded}
      >
        {expanded ? 'Hide details' : 'See responsibilities'}
        <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25 }}
          className="mt-3 space-y-2 overflow-hidden text-sm text-plum-700"
        >
          {team.responsibilities.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
              <span>{item}</span>
            </li>
          ))}
        </motion.ul>
      )}

      <div className="mt-6 pt-2">
        <Link
          to={`/apply?team=${encodeURIComponent(team.name)}`}
          className={`${buttonClasses('primary')} w-full`}
        >
          Apply to this team
        </Link>
      </div>
    </motion.div>
  )
}
