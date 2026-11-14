import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Clock, CheckSquare, AlertCircle, ArrowRight } from 'lucide-react'
import { reviewerAPI } from '../../services/api'
import { formatDate } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'

export default function ReviewerDashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  if (loading) return <LoadingSpinner message="Loading reviewer dashboard..." />

  const pending = applications.filter((a) => ['SUBMITTED', 'UNDER_REVIEW'].includes(a.status))
  const completed = applications.filter((a) => ['APPROVED', 'REJECTED'].includes(a.status))
  const corrections = applications.filter((a) => a.status === 'CORRECTION_REQUIRED')

  const statCards = [
    { label: 'Assigned Applications', value: applications.length, icon: ClipboardList, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Under Review', value: pending.length, icon: Clock, bg: 'bg-yellow-50', color: 'text-yellow-600' },
    { label: 'Correction Required', value: corrections.length, icon: AlertCircle, bg: 'bg-orange-50', color: 'text-orange-600' },
    { label: 'Completed Reviews', value: completed.length, icon: CheckSquare, bg: 'bg-green-50', color: 'text-green-600' },
  ]

  const recent = [...applications]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reviewer Dashboard</h1>
        <p className="text-sm text-slate-500">
          Inspect assigned applications, verify document checklists, add comments, and update status
        </p>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c) => (
          <div key={c.label} className="card flex items-center gap-4 p-5">
            <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
              <c.icon className={`w-6 h-6 ${c.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{c.value}</p>
              <p className="text-xs font-medium text-slate-500">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Assigned Applications</h2>
          <Link
            to="/reviewer/applications"
            className="text-sm font-medium text-primary-light hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No assigned applications"
            description="When an administrator assigns applications to you, they will appear here."
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
                {recent.map((app) => (
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
