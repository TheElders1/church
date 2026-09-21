import type { ReportWithApplicant } from '../../pages/admin/AdminReportsPage'

interface ReportsTableProps {
  reports: ReportWithApplicant[]
  onSelect: (report: ReportWithApplicant) => void
}

export function ReportsTable({ reports, onSelect }: ReportsTableProps) {
  if (reports.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-plum-200 p-12 text-center text-plum-500">
        No reports match your filters.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-plum-100 bg-cream-50 shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-plum-50 text-xs font-semibold uppercase tracking-wider text-plum-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Week</th>
              <th className="px-4 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-plum-100">
            {reports.map((report) => (
              <tr
                key={report.id}
                onClick={() => onSelect(report)}
                className="cursor-pointer transition-colors hover:bg-plum-50"
              >
                <td className="px-4 py-3 font-medium text-plum-900">
                  {report.applications?.full_name ?? 'Unknown'}
                </td>
                <td className="px-4 py-3 text-plum-700">
                  {report.week_start} – {report.week_end}
                </td>
                <td className="px-4 py-3 text-plum-600">
                  {new Date(report.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
