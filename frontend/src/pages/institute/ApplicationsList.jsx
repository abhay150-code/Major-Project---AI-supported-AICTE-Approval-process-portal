import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FilePlus, FileText, Search, Filter } from 'lucide-react'
import { applicationsAPI } from '../../services/api'
import { formatDate } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'

const STATUS_FILTERS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'CORRECTION_REQUIRED', label: 'Correction Required' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
]

export default function ApplicationsList() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await applicationsAPI.list()
      setApplications(res.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.applicationNumber.toLowerCase().includes(search.toLowerCase()) ||
      app.applicationType.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) return <LoadingSpinner message="Loading applications..." />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
          <p className="text-sm text-slate-500">Manage all approval and renewal applications</p>
        </div>
        <Link to="/institute/applications/new" className="btn-primary flex items-center gap-2 self-start">
          <FilePlus className="w-4 h-4" />
          New Application
        </Link>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by application number or type..."
            className="input-field pl-9"
          />
        </div>
        <div className="relative sm:w-56">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field pl-9"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications found"
            description="Create a new application or adjust your filters."
            action={
              applications.length === 0 && (
                <Link to="/institute/applications/new" className="btn-primary text-sm">
                  Create New Application
                </Link>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Application No.</th>
                  <th className="table-header">Type</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Assigned Reviewer</th>
                  <th className="table-header">Created</th>
                  <th className="table-header text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} className="table-row">
                    <td className="table-cell font-mono text-xs font-semibold text-slate-800">
                      {app.applicationNumber}
                    </td>
                    <td className="table-cell text-slate-600">
                      {app.applicationType.replace('_', ' ')}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="table-cell text-xs text-slate-600">
                      {app.assignedReviewer?.name || 'Unassigned'}
                    </td>
                    <td className="table-cell text-xs text-slate-500">{formatDate(app.createdAt)}</td>
                    <td className="table-cell text-right">
                      <Link
                        to={`/institute/applications/${app.id}`}
                        className="btn-secondary text-xs py-1.5 px-3 inline-block"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
