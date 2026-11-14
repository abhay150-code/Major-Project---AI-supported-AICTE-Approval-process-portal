import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Search, Filter } from 'lucide-react'
import { reviewerAPI } from '../../services/api'
import { formatDate } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'

export default function ReviewerApplicationsList({ completed = false }) {
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
      const res = await reviewerAPI.getApplications()
      setApplications(res.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assigned applications.')
    } finally {
      setLoading(false)
    }
  }

  const baseList = completed
    ? applications.filter((a) => ['APPROVED', 'REJECTED'].includes(a.status))
    : applications

  const filtered = baseList.filter((app) => {
    const matchesSearch =
      app.applicationNumber.toLowerCase().includes(search.toLowerCase()) ||
      (app.institution?.institutionName || '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) return <LoadingSpinner message="Loading applications..." />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {completed ? 'Completed Reviews' : 'Assigned Applications'}
        </h1>
        <p className="text-sm text-slate-500">
          {completed
            ? 'Applications with recorded approval or rejection status'
            : 'All applications currently assigned to you'}
        </p>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by application number or institution..."
            className="input-field pl-9"
          />
        </div>
        {!completed && (
          <div className="relative sm:w-56">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pl-9"
            >
              <option value="all">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="CORRECTION_REQUIRED">Correction Required</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        )}
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No applications found"
            description="No applications match your current filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Application No.</th>
                  <th className="table-header">Institution</th>
                  <th className="table-header">Type</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Updated</th>
                  <th className="table-header text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} className="table-row">
                    <td className="table-cell font-mono text-xs font-semibold text-slate-800">
                      {app.applicationNumber}
                    </td>
                    <td className="table-cell font-medium text-slate-800">
                      {app.institution?.institutionName || 'Institution'}
                    </td>
                    <td className="table-cell text-slate-600">
                      {app.applicationType.replace('_', ' ')}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="table-cell text-xs text-slate-500">{formatDate(app.updatedAt)}</td>
                    <td className="table-cell text-right">
                      <Link
                        to={`/reviewer/applications/${app.id}`}
                        className="btn-primary text-xs py-1.5 px-3 inline-block"
                      >
                        Review
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
