import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReportWithApplicant } from '../../pages/admin/AdminReportsPage'

const QUESTIONS: { key: 'answer_1' | 'answer_2' | 'answer_3' | 'answer_4' | 'answer_5' | 'answer_6'; label: string }[] = [
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

interface ReportDetailModalProps {
  report: ReportWithApplicant | null
  onClose: () => void
}

export function ReportDetailModal({ report, onClose }: ReportDetailModalProps) {
  return (
    <AnimatePresence>
      {report && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-plum-950/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-cream-50 p-6 shadow-soft sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-plum-900">
                  {report.applications?.full_name ?? 'Unknown'}
                </h2>
                <p className="mt-1 text-sm text-plum-600">
                  Week of {report.week_start} – {report.week_end}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-plum-500 hover:bg-plum-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              {QUESTIONS.map((q, index) => (
                <div key={q.key}>
                  <p className="font-medium text-plum-500">
                    {index + 1}. {q.label}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-plum-800">{report[q.key]}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
