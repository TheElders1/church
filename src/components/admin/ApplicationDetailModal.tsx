import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { Application, ApplicationStatus } from '../../types'
import { APPLICATION_STATUSES } from '../../types'
import { StatusBadge } from './StatusBadge'

interface ApplicationDetailModalProps {
  application: Application | null
  onClose: () => void
  onStatusChange: (id: string, status: ApplicationStatus) => void
  updating: boolean
}

export function ApplicationDetailModal({
  application,
  onClose,
  onStatusChange,
  updating,
}: ApplicationDetailModalProps) {
  return (
    <AnimatePresence>
      {application && (
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
                  {application.full_name}
                </h2>
                <p className="mt-1 text-sm text-plum-600">
                  Applied {new Date(application.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
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

            <dl className="mt-6 space-y-4 text-sm">
              <Row label="Email" value={application.email} />
              <Row label="Phone" value={application.phone} />
              <Row label="Age" value={String(application.age)} />
              <Row label="Team" value={application.team} />
              <div>
                <dt className="font-medium text-plum-500">Why they want to join</dt>
                <dd className="mt-1 whitespace-pre-wrap text-plum-800">{application.reason}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-plum-500">Status</p>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={application.status} />
                <select
                  value={application.status}
                  disabled={updating}
                  onChange={(event) =>
                    onStatusChange(application.id, event.target.value as ApplicationStatus)
                  }
                  className="rounded-lg border border-plum-200 bg-cream-50 px-3 py-1.5 text-sm text-plum-800 focus:outline-none focus:ring-2 focus:ring-plum-600 disabled:opacity-60"
                >
                  {APPLICATION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      Mark as {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="font-medium text-plum-500">{label}</dt>
      <dd className="text-plum-800">{value}</dd>
    </div>
  )
}
