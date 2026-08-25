import { Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'
import { Container } from '../ui/Container'
import { contactEmail, contactPhones, socialLinks } from '../../data/contact'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-plum-100 bg-plum-950 text-cream-100">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-cream-50">Medical Students Fellowship</p>
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
              <span className="break-all">{contactEmail}</span>
            </li>
            {contactPhones.map((phone) => (
              <li key={phone} className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{phone}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center gap-3">
            {socialLinks.map((social) => (
              <span
                key={social.name}
                title={`${social.name}: ${social.handle}`}
                aria-label={`${social.name}: ${social.handle}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-plum-800 text-plum-200 hover:border-plum-600 hover:text-cream-50"
              >
                <social.icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-plum-800 py-6">
        <Container>
          <p className="text-center text-xs text-plum-300">
            &copy; {year} Medical Students Fellowship. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  )
}
