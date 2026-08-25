import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Users, HeartHandshake } from 'lucide-react'
import { Container } from '../components/ui/Container'
import { buttonClasses } from '../components/ui/Button'
import { SectionHeading } from '../components/ui/SectionHeading'
import { teams } from '../data/teams'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function HomePage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden bg-plum-950 text-cream-50">
        <img
          src="/hero-worship.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-[center_25%] opacity-60 mix-blend-luminosity"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-plum-950/30 via-plum-950/60 to-plum-950" />
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 20%, rgba(233,181,99,0.25), transparent 40%), radial-gradient(circle at 85% 0%, rgba(48,166,95,0.4), transparent 45%)',
          }}
        />
        <Container className="relative py-24 sm:py-32">
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.12 }}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-plum-700 bg-plum-900/60 px-4 py-1.5 text-sm font-medium text-gold-200"
            >
              <Sparkles className="h-4 w-4" />
              MSF Fellowship
            </motion.p>
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
            >
              Serving God, Serving Others, Together.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="mx-auto mt-6 max-w-xl text-balance text-lg text-plum-100"
            >
              MSF Fellowship exists to build a community of believers who know Christ and make
              Him known — growing together in faith, and finding a place to use our gifts in
              service to one another and to God.
            </motion.p>
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="mt-10">
              <Link to="/teams" className={`${buttonClasses('secondary')} group`}>
                Apply to a Team
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeading
                eyebrow="Who we are"
                title="A fellowship built on faith, family, and service"
                description="MSF Fellowship is a community where members are discipled, cared for, and equipped to serve. We believe every member has a part to play — a gift to bring to the body — and our serving teams are where that calling finds a home."
              />
              <p className="mt-4 max-w-xl text-plum-700">
                Whether it's welcoming a visitor at the door, leading worship, keeping our
                systems running, or caring for someone going through a hard season, every team
                plays a real part in the life of this fellowship. There's a place here for you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="rounded-2xl bg-plum-50 p-6 shadow-soft">
                <Users className="h-8 w-8 text-plum-600" />
                <p className="mt-4 font-display text-2xl font-semibold text-plum-900">9 Teams</p>
                <p className="mt-1 text-sm text-plum-600">serving across every part of fellowship life</p>
              </div>
              <div className="mt-8 rounded-2xl bg-gold-50 p-6 shadow-soft">
                <HeartHandshake className="h-8 w-8 text-gold-600" />
                <p className="mt-4 font-display text-2xl font-semibold text-plum-900">Open Doors</p>
                <p className="mt-1 text-sm text-plum-600">every member is welcome to apply and serve</p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="bg-plum-50 py-20 sm:py-28">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Serving Teams"
            title="Find where you fit"
            description="From ushering to worship, media to medical — explore all nine teams and discover where your gifts can serve the fellowship best."
          />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {teams.map((team) => (
              <span
                key={team.id}
                className="rounded-full border border-plum-200 bg-cream-50 px-4 py-2 text-sm font-medium text-plum-700"
              >
                {team.name}
              </span>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/teams" className={buttonClasses('primary')}>
              View All Teams
            </Link>
          </div>
        </Container>
      </section>
    </div>
  )
}
