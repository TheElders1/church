import type { ApplicationStatus } from '../../types'

const styles: Record<ApplicationStatus, string> = {
  Pending: 'bg-gold-100 text-gold-800',
  Reviewed: 'bg-plum-100 text-plum-700',
  Accepted: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-red-100 text-red-700',
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  )
}
