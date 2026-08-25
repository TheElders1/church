import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { buttonClasses } from '../components/ui/Button'

const terms = [
  {
    title: 'Attend all fellowship meetings',
    detail:
      'Be present and committed to regular fellowship meetings, services, and team gatherings — consistency is how a team functions well together.',
  },
  {
    title: 'Willingness to learn and honour leaders',
    detail:
      'Come with a teachable heart, and give honour and respect to those placed in leadership over your team and the fellowship.',
  },
  {
    title: 'Stick to the rules that govern your desired team',
    detail:
      'Each team has its own guidelines and standards. Members are expected to know and follow them faithfully.',
  },
  {
    title: 'Be of good conduct in and outside the fellowship',
    detail:
      'Live a life that reflects the values of the fellowship, both within our gatherings and in everyday life.',
  },
  {
    title: 'Be involved in evangelism and outreaches',
    detail:
      'Take an active part in sharing the gospel and serving the wider community through outreach activities.',
  },
]

export function TermsPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Before you apply"
          title="Terms of Application"
          description="Serving on a team at MSF Fellowship is a commitment. By applying, you agree to the following terms, which help every team serve well and stay unified."
        />

        <ol className="mt-10 space-y-5">
          {terms.map((term, index) => (
            <motion.li
              key={term.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex gap-4 rounded-2xl border border-plum-100 bg-cream-50 p-5 shadow-soft"
            >
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-gold-500" />
              <div>
                <p className="font-display text-lg font-semibold text-plum-900">
                  {index + 1}. {term.title}
                </p>
                <p className="mt-1 text-sm text-plum-700">{term.detail}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl bg-plum-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-plum-700">
            Ready to serve? You'll be asked to confirm agreement to these terms on the application
            form.
          </p>
          <Link to="/apply" className={buttonClasses('primary')}>
            Continue to Application
          </Link>
        </div>
      </Container>
    </div>
  )
}
