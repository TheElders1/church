import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { applicationSchema, type ApplicationFormValues } from '../../lib/validation'
import { supabase } from '../../lib/supabaseClient'
import { teams } from '../../data/teams'
import { Button } from '../ui/Button'

interface ApplicationFormProps {
  defaultTeam?: string
}

export function ApplicationForm({ defaultTeam }: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
    reset,
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      team: defaultTeam && teams.some((t) => t.name === defaultTeam) ? defaultTeam : undefined,
    },
  })

  async function onSubmit(values: ApplicationFormValues) {
    const { error } = await supabase.from('applications').insert({
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      age: values.age,
      team: values.team,
      reason: values.reason,
    })

    if (error) {
      setError('root', {
        message:
          'Something went wrong submitting your application. Please check your connection and try again.',
      })
      throw error
    }
  }

  if (isSubmitSuccessful) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-plum-100 bg-plum-50 p-8 text-center shadow-soft"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold-500" />
        <h3 className="mt-4 font-display text-2xl font-semibold text-plum-900">
          Application received!
        </h3>
        <p className="mx-auto mt-2 max-w-md text-plum-700">
          Thank you for applying to serve with Medical Students Fellowship. A team leader will review your
          application and reach out to you soon.
        </p>
        <Button className="mt-6" onClick={() => reset()}>
          Submit another application
        </Button>
      </motion.div>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        handleSubmit(onSubmit)(event).catch(() => {
          // Submission failure is already reflected via setError('root', ...) above.
        })
      }}
      noValidate
      className="space-y-6 rounded-2xl border border-plum-100 bg-cream-50 p-6 shadow-soft sm:p-8"
    >
      {errors.root && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errors.root.message}</span>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name" error={errors.full_name?.message}>
          <input
            type="text"
            autoComplete="name"
            {...register('full_name')}
            className={inputClass(!!errors.full_name)}
            placeholder="e.g. Ada Okafor"
          />
        </Field>

        <Field label="Email address" error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            {...register('email')}
            className={inputClass(!!errors.email)}
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Phone number" error={errors.phone?.message}>
          <input
            type="tel"
            autoComplete="tel"
            {...register('phone')}
            className={inputClass(!!errors.phone)}
            placeholder="+234 800 000 0000"
          />
        </Field>

        <Field label="Age" error={errors.age?.message}>
          <input
            type="number"
            {...register('age')}
            className={inputClass(!!errors.age)}
            placeholder="e.g. 24"
          />
        </Field>
      </div>

      <Field label="Team" error={errors.team?.message}>
        <select {...register('team')} className={inputClass(!!errors.team)} defaultValue="">
          <option value="" disabled>
            Select a team
          </option>
          {teams.map((team) => (
            <option key={team.id} value={team.name}>
              {team.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Why do you want to join this team?" error={errors.reason?.message}>
        <textarea
          {...register('reason')}
          rows={5}
          className={inputClass(!!errors.reason)}
          placeholder="Tell us a little about yourself and why you'd like to serve on this team..."
        />
      </Field>

      <div>
        <label className="flex items-start gap-3 text-sm text-plum-800">
          <input
            type="checkbox"
            {...register('agreedToTerms')}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-plum-300 text-plum-700 focus:ring-plum-600"
          />
          <span>
            I have read and agree to the{' '}
            <Link to="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-plum-700 underline">
              Terms of Application
            </Link>
            .
          </span>
        </label>
        {errors.agreedToTerms && (
          <p className="mt-1 text-sm text-red-600">{errors.agreedToTerms.message}</p>
        )}
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-plum-800">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  )
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-cream-50 px-4 py-2.5 text-plum-900 placeholder:text-plum-400 focus:outline-none focus:ring-2 focus:ring-plum-600 ${
    hasError ? 'border-red-400' : 'border-plum-200'
  }`
}
