import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Container } from '../ui/Container'

const links = [
  { to: '/', label: 'Home' },
  { to: '/teams', label: 'Teams' },
  { to: '/terms', label: 'Terms' },
  { to: '/apply', label: 'Apply' },
  { to: '/about', label: 'About & Contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-plum-900' : 'text-plum-600 hover:text-plum-900'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-plum-100 bg-cream-50/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <NavLink to="/" className="flex items-center" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="MSF Fellowship" className="h-10 w-auto sm:h-12" />
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full p-2 text-plum-700 hover:bg-plum-100 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-plum-100 bg-cream-50 md:hidden"
          >
            <Container className="flex flex-col gap-1 py-3">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-base font-medium ${
                      isActive ? 'bg-plum-100 text-plum-900' : 'text-plum-700 hover:bg-plum-50'
                    }`
                  }
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
