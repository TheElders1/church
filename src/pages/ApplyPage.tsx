import { useSearchParams } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ApplicationForm } from '../components/application/ApplicationForm'

export function ApplyPage() {
  const [searchParams] = useSearchParams()
  const teamFromQuery = searchParams.get('team') ?? undefined

  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <SectionHeading
          eyebrow="Serve with us"
          title="Apply to a Team"
          description="Tell us a bit about yourself. A team leader will review your application and follow up with next steps."
        />
        <div className="mt-10">
          <ApplicationForm defaultTeam={teamFromQuery} />
        </div>
      </Container>
    </div>
  )
}
