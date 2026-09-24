import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Copy, Check, Trash2, AlertTriangle } from 'lucide-react'
import type { Application, ApplicationStatus } from '../../types'
import { APPLICATION_STATUSES } from '../../types'
import { supabase } from '../../lib/supabaseClient'
import { StatusBadge } from './StatusBadge'

interface ApplicationDetailModalProps {
  application: Application | null
  onClose: () => void
  onStatusChange: (id: string, status: ApplicationStatus) => void
  onDelete: (id: string) => void
  updating: boolean
  deleting: boolean
}

export function ApplicationDetailModal({
  application,
  onClose,
  onStatusChange,
  onDelete,
  updating,
  deleting,
}: ApplicationDetailModalProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [codeCopied, setCodeCopied] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    setPhotoUrl(null)
    setCodeCopied(false)
    setConfirmingDelete(false)
    if (!application?.photo_path) return

    let active = true
    supabase.storage
      .from('applicant-photos')
      .createSignedUrl(application.photo_path, 60 * 10)
      .then(({ data }) => {
        if (active && data) setPhotoUrl(data.signedUrl)
      })
    return () => {
      active = false
    }
  }, [application?.photo_path])

  function copyCode() {
    if (!application?.access_code) return
    navigator.clipboard.writeText(application.access_code).then(() => {
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    })
  }

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
              <div className="flex items-center gap-4">
                {photoUrl && (
                  <img
                    src={photoUrl}
                    alt={application.full_name}
                    className="h-16 w-16 shrink-0 rounded-full object-cover"
                  />
                )}
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
              <Row label="Date of birth" value={application.date_of_birth} />
              <Row label="Sex" value={application.sex} />
              <Row label="Team" value={application.team} />
              <div>
                <dt className="font-medium text-plum-500">Why they want to join</dt>
                <dd className="mt-1 whitespace-pre-wrap text-plum-800">{application.reason}</dd>
              </div>
            </dl>

            {application.access_code && (
              <div className="mt-6 rounded-xl border border-gold-300 bg-gold-50 p-4">
                <p className="text-sm font-medium text-plum-700">
                  Counseling &amp; Follow-up report portal access code
                </p>
                <p className="mt-1 text-xs text-plum-600">
                  Share this with them so they can log in at /reports.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-lg bg-cream-50 px-3 py-1.5 font-mono text-base tracking-widest text-plum-900">
                    {application.access_code}
                  </span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="inline-flex items-center gap-1.5 rounded-full border border-plum-200 px-3 py-1.5 text-xs font-medium text-plum-700 hover:bg-plum-50"
                  >
                    {codeCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {codeCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

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
              {application.team !== 'Counseling and Public Relations Team' && (
                <p className="mt-2 text-xs text-plum-500">
                  Marking this as Accepted also automatically enrolls them on the Counseling and
                  Public Relations Team for follow-up.
                </p>
              )}
            </div>

            <div className="mt-6 border-t border-plum-100 pt-6">
              {confirmingDelete ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-2 text-sm text-red-700">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      Delete this application permanently? This can&apos;t be undone
                      {application.access_code
                        ? ', and will also delete any follow-up reports they submitted.'
                        : '.'}
                    </p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={() => onDelete(application.id)}
                      className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      {deleting ? 'Deleting...' : 'Yes, delete it'}
                    </button>
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={() => setConfirmingDelete(false)}
                      className="rounded-full border border-plum-200 px-4 py-1.5 text-xs font-medium text-plum-700 hover:bg-plum-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete application
                </button>
              )}
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
