import { Compass, Mail, Phone, Target } from 'lucide-react'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ContactForm } from '../components/contact/ContactForm'
import { contactEmail, contactPhones, socialLinks } from '../data/contact'

export function AboutPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="About Us"
          title="About MSF Fellowship"
          description="MSF Fellowship is a community of believers committed to knowing Christ and making Him known. We gather to worship, grow in the Word, and serve one another — and we believe every member has a meaningful part to play in the life of the fellowship."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-plum-100 bg-cream-50 p-6 shadow-soft sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-100 px-4 py-1.5 text-sm font-semibold text-gold-800">
              <Target className="h-4 w-4" />
              Mission
            </span>
            <p className="mt-4 text-plum-800">
              To inculcate spiritual discipline and order — a life of pursuit into God.
            </p>
          </div>
          <div className="rounded-2xl border border-plum-100 bg-cream-50 p-6 shadow-soft sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-100 px-4 py-1.5 text-sm font-semibold text-gold-800">
              <Compass className="h-4 w-4" />
              Vision
            </span>
            <p className="mt-4 text-plum-800">
              To raise students who, through the ways of prayer and the word, legislate the
              counsel of Heaven here on Earth.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-xl font-semibold text-plum-900">Get in touch</h3>
            <p className="mt-2 text-plum-700">
              Have a question before you apply, or want to know more about a specific team? Reach
              out — we'd love to hear from you.
            </p>

            <div className="mt-6 rounded-2xl border border-plum-100 bg-cream-50 p-6 shadow-soft sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-plum-500">
                  Email
                </p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="mt-2 flex items-center gap-2.5 break-all text-plum-900 hover:text-plum-600"
                >
                  <Mail className="h-4 w-4 shrink-0 text-gold-600" />
                  {contactEmail}
                </a>
              </div>

              <div className="my-6 border-t border-plum-100" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-plum-500">
                  Phone
                </p>
                <ul className="mt-2 space-y-2">
                  {contactPhones.map((phone) => (
                    <li key={phone}>
                      <a
                        href={`tel:${phone.replace(/\s+/g, '')}`}
                        className="flex items-center gap-2.5 text-plum-900 hover:text-plum-600"
                      >
                        <Phone className="h-4 w-4 shrink-0 text-gold-600" />
                        {phone}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="my-6 border-t border-plum-100" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-plum-500">
                  Follow Us
                </p>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {socialLinks.map((social) => (
                    <li
                      key={social.name}
                      className="flex min-w-0 items-center gap-2.5 rounded-xl bg-plum-50 px-3 py-2.5"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-plum-100 text-plum-700">
                        <social.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-plum-900">{social.name}</p>
                        <p className="truncate text-xs text-plum-600" title={social.handle}>
                          {social.handle}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl font-semibold text-plum-900">Send a message</h3>
            <div className="mt-4">
              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
