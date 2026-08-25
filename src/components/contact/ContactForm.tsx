import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { contactSchema, type ContactFormValues } from '../../lib/validation'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../ui/Button'

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) })

  async function onSubmit(values: ContactFormValues) {
    const { error } = await supabase.from('contact_messages').insert(values)

    if (error) {
      setError('root', {
        message: 'We could not send your message. Please try again in a moment.',
      })
      throw error
    }
  }

  if (isSubmitSuccessful) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-plum-100 bg-plum-50 p-6 text-center shadow-soft"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-gold-500" />
        <p className="mt-3 font-display text-lg font-semibold text-plum-900">Message sent!</p>
        <p className="mt-1 text-sm text-plum-700">Thanks for reaching out — we'll get back to you soon.</p>
      </motion.div>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        handleSubmit(onSubmit)(event).catch(() => {})
      }}
      noValidate
      className="space-y-5 rounded-2xl border border-plum-100 bg-cream-50 p-6 shadow-soft"
    >
      {errors.root && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errors.root.message}</span>
        </div>
      )}

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-plum-800">Name</span>
        <input
          type="text"
          {...register('name')}
          className={inputClass(!!errors.name)}
          placeholder="Your name"
        />
        {errors.name && <span className="mt-1 block text-sm text-red-600">{errors.name.message}</span>}
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-plum-800">Email</span>
        <input
          type="email"
          {...register('email')}
          className={inputClass(!!errors.email)}
          placeholder="you@example.com"
        />
        {errors.email && <span className="mt-1 block text-sm text-red-600">{errors.email.message}</span>}
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-plum-800">Message</span>
        <textarea
          rows={4}
          {...register('message')}
          className={inputClass(!!errors.message)}
          placeholder="How can we help?"
        />
        {errors.message && (
          <span className="mt-1 block text-sm text-red-600">{errors.message.message}</span>
        )}
      </label>

      <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-cream-50 px-4 py-2.5 text-plum-900 placeholder:text-plum-400 focus:outline-none focus:ring-2 focus:ring-plum-600 ${
    hasError ? 'border-red-400' : 'border-plum-200'
  }`
}
