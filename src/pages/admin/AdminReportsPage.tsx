import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Search, AlertCircle, ArrowLeft } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import type { FollowUpReport } from '../../types'
import { Container } from '../../components/ui/Container'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { ReportsTable } from '../../components/admin/ReportsTable'
import { ReportDetailModal } from '../../components/admin/ReportDetailModal'

export type ReportWithApplicant = FollowUpReport & {
  applications: { full_name: string; team: string } | null
}

export function AdminReportsPage() {
  const { signOut } = useAuth()
  const [reports, setReports] = useState<ReportWithApplicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ReportWithApplicant | null>(null)

  useEffect(() => {
    let active = true

    async function loadReports() {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('follow_up_reports')
        .select('*, applications(full_name, team)')
        .order('created_at', { ascending: false })

      if (!active) return

      if (fetchError) {
        setError('Could not load reports. Please refresh the page.')
      } else {
        setReports(data ?? [])
      }
      setLoading(false)
    }

    loadReports()
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return reports
    return reports.filter((report) =>
      (report.applications?.full_name ?? '').toLowerCase().includes(query)
    )
  }, [reports, search])

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-plum-600 hover:text-plum-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-plum-900 sm:text-3xl">
              Follow-up Reports
            </h1>
            <p className="mt-1 text-sm text-plum-600">
              {reports.length} report{reports.length === 1 ? '' : 's'} submitted
            </p>
          </div>
          <div className="flex gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center gap-2 rounded-full border border-plum-200 px-4 py-2 text-sm font-medium text-plum-700 hover:bg-plum-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-plum-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name..."
              className="w-full rounded-xl border border-plum-200 bg-cream-50 py-2.5 pl-10 pr-4 text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-plum-600"
            />
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner className="h-8 w-8 text-plum-600" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          ) : (
            <ReportsTable reports={filtered} onSelect={setSelected} />
          )}
        </div>
      </Container>

      <ReportDetailModal report={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
