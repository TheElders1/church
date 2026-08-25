import type { Application } from '../../types'
import { StatusBadge } from './StatusBadge'

interface ApplicationsTableProps {
  applications: Application[]
  onSelect: (application: Application) => void
}

export function ApplicationsTable({ applications, onSelect }: ApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-plum-200 p-12 text-center text-plum-500">
        No applications match your filters.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-plum-100 bg-cream-50 shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-plum-50 text-xs font-semibold uppercase tracking-wider text-plum-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-plum-100">
            {applications.map((application) => (
              <tr
                key={application.id}
                onClick={() => onSelect(application)}
                className="cursor-pointer transition-colors hover:bg-plum-50"
              >
                <td className="px-4 py-3 font-medium text-plum-900">{application.full_name}</td>
                <td className="px-4 py-3 text-plum-700">{application.email}</td>
                <td className="px-4 py-3 text-plum-700">{application.team}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={application.status} />
                </td>
                <td className="px-4 py-3 text-plum-600">
                  {new Date(application.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
