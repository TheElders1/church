import { Link } from 'react-router-dom'
import { Mail, Phone, Instagram } from 'lucide-react'
import { Container } from '../ui/Container'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-plum-100 bg-plum-950 text-cream-100">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-cream-50">MSF Fellowship</p>
          <p className="mt-3 max-w-xs text-sm text-plum-200">
            Serving God, serving one another. A place to grow, belong, and find your part to play.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-300">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-plum-200">
            <li><Link to="/teams" className="hover:text-cream-50">Serving Teams</Link></li>
            <li><Link to="/terms" className="hover:text-cream-50">Terms of Application</Link></li>
            <li><Link to="/apply" className="hover:text-cream-50">Apply Now</Link></li>
            <li><Link to="/about" className="hover:text-cream-50">About & Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-300">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-plum-200">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <span>info@msffellowship.org</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <span>+234 000 000 0000</span>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="h-4 w-4 shrink-0" />
              <span>@msffellowship</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-plum-800 py-6">
        <Container>
          <p className="text-center text-xs text-plum-300">
            &copy; {year} MSF Fellowship. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  )
}
