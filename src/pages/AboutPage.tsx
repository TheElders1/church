import { Mail, Phone } from 'lucide-react'
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

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-xl font-semibold text-plum-900">Get in touch</h3>
            <p className="mt-2 text-plum-700">
              Have a question before you apply, or want to know more about a specific team? Reach
              out — we'd love to hear from you.
            </p>

            <ul className="mt-6 space-y-4">
              <li className="flex items-center gap-3 text-plum-800">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-plum-100 text-plum-700">
                  <Mail className="h-5 w-5" />
                </span>
                <span className="break-all">{contactEmail}</span>
              </li>
              {contactPhones.map((phone) => (
                <li key={phone} className="flex items-center gap-3 text-plum-800">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-plum-100 text-plum-700">
                    <Phone className="h-5 w-5" />
                  </span>
                  <span>{phone}</span>
                </li>
              ))}
              {socialLinks.map((social) => (
                <li key={social.name} className="flex items-center gap-3 text-plum-800">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-plum-100 text-plum-700">
                    <social.icon className="h-5 w-5" />
                  </span>
                  <span className="break-all">
                    {social.name} <span className="text-plum-500">{social.handle}</span>
                  </span>
                </li>
              ))}
            </ul>
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
