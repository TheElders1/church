import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, LockKeyhole, LogOut, CheckCircle2, Clock } from 'lucide-react'
import {
  accessCodeSchema,
  reportAnswersSchema,
  type AccessCodeFormValues,
  type ReportAnswersFormValues,
} from '../lib/validation'
import { supabase } from '../lib/supabaseClient'
import type { FollowUpReport, ReportPortalSession } from '../types'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Button } from '../components/ui/Button'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

const ACCESS_CODE_KEY = 'msf_report_access_code'

const QUESTIONS: { key: keyof ReportAnswersFormValues; label: string }[] = [
  { key: 'answer_1', label: 'How many MSF members were you assigned to follow up on?' },
  {
    key: 'answer_2',
    label: 'Did you pray for your members individually — were you intentional about it?',
  },
  {
    key: 'answer_3',
    label: 'How many of them did you sincerely reach out to this week, via call, WhatsApp, or in person?',
  },
  { key: 'answer_4', label: 'How many of them do you know facially?' },
  {
    key: 'answer_5',
    label: 'Is any of them facing a challenge you are aware of? If yes, what did you do to help?',
  },
  { key: 'answer_6', label: 'Are you facing any problems regarding follow-up?' },
]

function parseDateOnly(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function startOfWeek(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diffToMonday)
  return d
}

function toDateInput(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`
}

function formatShort(date: Date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${String(date.getFullYear()).slice(-2)}`
}

export function ReportPortalPage() {
  const [session, setSession] = useState<ReportPortalSession | null>(null)
  const [code, setCode] = useState<string | null>(null)
  const [checkingStoredCode, setCheckingStoredCode] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(ACCESS_CODE_KEY)
    if (!stored) {
      setCheckingStoredCode(false)
      return
    }
    login(stored).finally(() => setCheckingStoredCode(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function login(candidateCode: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('report_portal_login', { p_code: candidateCode })
    if (error || !data || data.length === 0) {
      localStorage.removeItem(ACCESS_CODE_KEY)
      return false
    }
    const row = data[0]
    setSession({ applicant_id: row.applicant_id, full_name: row.full_name, reports: row.reports ?? [] })
    setCode(candidateCode)
    localStorage.setItem(ACCESS_CODE_KEY, candidateCode)
    return true
  }

  function logOut() {
    localStorage.removeItem(ACCESS_CODE_KEY)
    setSession(null)
    setCode(null)
  }

  if (checkingStoredCode) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner className="h-8 w-8 text-plum-600" />
      </div>
    )
  }

  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <SectionHeading
          eyebrow="Counseling & Public Relations"
          title="Follow-up Report Portal"
          description={
            session
              ? `Welcome, ${session.full_name}. Submit and review your weekly follow-up reports here.`
              : 'Enter the access code you were given to submit or view your weekly follow-up reports.'
          }
        />
        <div className="mt-10">
          {session && code ? (
            <ReportWorkspace
              session={session}
              code={code}
              onLogOut={logOut}
              onReportSubmitted={(report) =>
                setSession((prev) => (prev ? { ...prev, reports: [report, ...prev.reports] } : prev))
              }
            />
          ) : (
            <AccessCodeForm onSubmit={login} />
          )}
        </div>
      </Container>
    </div>
  )
}

function AccessCodeForm({ onSubmit }: { onSubmit: (code: string) => Promise<boolean> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AccessCodeFormValues>({ resolver: zodResolver(accessCodeSchema) })

  async function handleLogin(values: AccessCodeFormValues) {
    const ok = await onSubmit(values.code)
    if (!ok) {
      setError('root', {
        message: 'That access code was not recognized. Double check it and try again.',
      })
    }
  }

  return (
    <form
      onSubmit={(event) => {
        handleSubmit(handleLogin)(event).catch(() => {})
      }}
      noValidate
      className="space-y-4 rounded-2xl border border-plum-100 bg-cream-50 p-6 shadow-soft sm:p-8"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-plum-100 text-plum-700">
        <LockKeyhole className="h-6 w-6" />
      </div>
      {errors.root && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errors.root.message}</span>
        </div>
      )}
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-plum-800">Access code</span>
        <input
          type="text"
          autoCapitalize="characters"
          {...register('code')}
          className={`${inputClass(!!errors.code)} uppercase tracking-widest`}
          placeholder="e.g. K7QX2M"
        />
        {errors.code && <span className="mt-1 block text-sm text-red-600">{errors.code.message}</span>}
      </label>
      <Button type="submit" loading={isSubmitting} className="w-full">
        {isSubmitting ? 'Checking...' : 'Continue'}
      </Button>
    </form>
  )
}

function ReportWorkspace({
  session,
  code,
  onLogOut,
  onReportSubmitted,
}: {
  session: ReportPortalSession
  code: string
  onLogOut: () => void
  onReportSubmitted: (report: FollowUpReport) => void
}) {
  const weekStart = startOfWeek(new Date())
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  const weekStartStr = toDateInput(weekStart)
  const weekEndStr = toDateInput(weekEnd)

  const deadline = new Date(weekEnd)
  deadline.setHours(23, 59, 59, 999)
  const isPastDeadline = new Date() > deadline

  const thisWeekReport = session.reports.find((r) => r.week_start === weekStartStr)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-plum-600">
          Signed in as <span className="font-medium text-plum-900">{session.full_name}</span>
        </p>
        <button
          type="button"
          onClick={onLogOut}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-plum-600 hover:text-plum-900"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>

      <div className="rounded-2xl border border-plum-100 bg-cream-50 p-6 shadow-soft sm:p-8">
        <h3 className="font-display text-lg font-semibold text-plum-900">
          This week&apos;s report ({formatShort(weekStart)} – {formatShort(weekEnd)})
        </h3>

        {thisWeekReport ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-plum-50 p-3 text-sm text-plum-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-plum-600" />
            <span>You&apos;ve already submitted this week&apos;s report. See it below under your history.</span>
          </div>
        ) : isPastDeadline ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-plum-50 p-3 text-sm text-plum-700">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-plum-600" />
            <span>This week&apos;s report window closed 11:59pm Sunday. See you next week.</span>
          </div>
        ) : (
          <ReportForm
            code={code}
            weekStart={weekStartStr}
            weekEnd={weekEndStr}
            onSubmitted={onReportSubmitted}
          />
        )}
      </div>

      {session.reports.length > 0 && (
        <div>
          <h3 className="font-display text-lg font-semibold text-plum-900">Your report history</h3>
          <div className="mt-4 space-y-4">
            {session.reports.map((report) => (
              <ReportSummary key={report.id} report={report} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ReportForm({
  code,
  weekStart,
  weekEnd,
  onSubmitted,
}: {
  code: string
  weekStart: string
  weekEnd: string
  onSubmitted: (report: FollowUpReport) => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<ReportAnswersFormValues>({ resolver: zodResolver(reportAnswersSchema) })

  async function onSubmit(values: ReportAnswersFormValues) {
    const { data, error } = await supabase.rpc('report_portal_submit', {
      p_code: code,
      p_week_start: weekStart,
      p_week_end: weekEnd,
      p_answer_1: values.answer_1,
      p_answer_2: values.answer_2,
      p_answer_3: values.answer_3,
      p_answer_4: values.answer_4,
      p_answer_5: values.answer_5,
      p_answer_6: values.answer_6,
    })

    if (error) {
      setError('root', {
        message: error.message || 'Something went wrong submitting your report. Please try again.',
      })
      throw error
    }

    onSubmitted({
      id: data?.id ?? crypto.randomUUID(),
      week_start: weekStart,
      week_end: weekEnd,
      created_at: new Date().toISOString(),
      ...values,
    })
  }

  if (isSubmitSuccessful) {
    return (
      <div className="mt-4 flex items-start gap-2 rounded-lg bg-plum-50 p-3 text-sm text-plum-700">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-plum-600" />
        <span>Report submitted. Thank you!</span>
      </div>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        handleSubmit(onSubmit)(event).catch(() => {})
      }}
      noValidate
      className="mt-4 space-y-5"
    >
      {errors.root && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errors.root.message}</span>
        </div>
      )}
      {QUESTIONS.map((q, index) => (
        <label key={q.key} className="block">
          <span className="mb-1.5 block text-sm font-medium text-plum-800">
            {index + 1}. {q.label}
          </span>
          <textarea rows={2} {...register(q.key)} className={inputClass(!!errors[q.key])} />
          {errors[q.key] && (
            <span className="mt-1 block text-sm text-red-600">{errors[q.key]?.message}</span>
          )}
        </label>
      ))}
      <p className="text-xs text-plum-500">Reports are not acknowledged after 11:59pm on Sunday.</p>
      <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? 'Submitting...' : 'Submit report'}
      </Button>
    </form>
  )
}

function ReportSummary({ report }: { report: FollowUpReport }) {
  const start = parseDateOnly(report.week_start)
  const end = parseDateOnly(report.week_end)
  return (
    <details className="rounded-2xl border border-plum-100 bg-cream-50 p-5 shadow-soft">
      <summary className="cursor-pointer font-medium text-plum-900">
        Week of {formatShort(start)} – {formatShort(end)}
      </summary>
      <div className="mt-3 space-y-3 text-sm">
        {QUESTIONS.map((q, index) => (
          <div key={q.key}>
            <p className="font-medium text-plum-600">
              {index + 1}. {q.label}
            </p>
            <p className="mt-0.5 whitespace-pre-wrap text-plum-800">{report[q.key]}</p>
          </div>
        ))}
      </div>
    </details>
  )
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-cream-50 px-4 py-2.5 text-plum-900 placeholder:text-plum-400 focus:outline-none focus:ring-2 focus:ring-plum-600 ${
    hasError ? 'border-red-400' : 'border-plum-200'
  }`
}
