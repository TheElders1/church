import { useEffect, useMemo, useState } from 'react'
import { LogOut, Search, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { teams } from '../../data/teams'
import type { Application, ApplicationStatus } from '../../types'
import { Container } from '../../components/ui/Container'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { ApplicationsTable } from '../../components/admin/ApplicationsTable'
import { ApplicationDetailModal } from '../../components/admin/ApplicationDetailModal'

export function AdminDashboardPage() {
  const { signOut } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [teamFilter, setTeamFilter] = useState('all')
  const [selected, setSelected] = useState<Application | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    let active = true

    async function loadApplications() {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (!active) return

      if (fetchError) {
        setError('Could not load applications. Please refresh the page.')
      } else {
        setApplications(data ?? [])
      }
      setLoading(false)
    }

    loadApplications()
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return applications.filter((application) => {
      const matchesTeam = teamFilter === 'all' || application.team === teamFilter
      const matchesQuery =
        !query ||
        application.full_name.toLowerCase().includes(query) ||
        application.email.toLowerCase().includes(query)
      return matchesTeam && matchesQuery
    })
  }, [applications, search, teamFilter])

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    setUpdating(true)
    const { error: updateError } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)

    if (!updateError) {
      setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)))
      setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev))
    }
    setUpdating(false)
  }

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-plum-900 sm:text-3xl">
              Applications
            </h1>
            <p className="mt-1 text-sm text-plum-600">
              {applications.length} total application{applications.length === 1 ? '' : 's'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex items-center gap-2 self-start rounded-full border border-plum-200 px-4 py-2 text-sm font-medium text-plum-700 hover:bg-plum-50 sm:self-auto"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-plum-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-xl border border-plum-200 bg-cream-50 py-2.5 pl-10 pr-4 text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-plum-600"
            />
          </div>
          <select
            value={teamFilter}
            onChange={(event) => setTeamFilter(event.target.value)}
            className="rounded-xl border border-plum-200 bg-cream-50 px-4 py-2.5 text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-plum-600"
          >
            <option value="all">All teams</option>
            {teams.map((team) => (
              <option key={team.id} value={team.name}>
                {team.name}
              </option>
            ))}
          </select>
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
            <ApplicationsTable applications={filtered} onSelect={setSelected} />
          )}
        </div>
      </Container>

      <ApplicationDetailModal
        application={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
        updating={updating}
      />
    </div>
  )
}
