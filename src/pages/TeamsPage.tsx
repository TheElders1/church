import { motion } from 'framer-motion'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { TeamCard } from '../components/teams/TeamCard'
import { teams } from '../data/teams'

export function TeamsPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Serving Teams"
          title="Nine teams. One family. Every gift welcome."
          description="Every team plays a real part in the life of MSF Fellowship. Explore each one below, then apply to the team where you feel called to serve."
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ staggerChildren: 0.06 }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {teams.map((team) => (
            <motion.div
              key={team.id}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.4 }}
            >
              <TeamCard team={team} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </div>
  )
}
