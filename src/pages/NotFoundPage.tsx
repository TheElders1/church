import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { buttonClasses } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-6xl font-semibold text-plum-900">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-plum-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-plum-600">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className={`${buttonClasses('primary')} mt-8`}>
        Back to Home
      </Link>
    </Container>
  )
}
