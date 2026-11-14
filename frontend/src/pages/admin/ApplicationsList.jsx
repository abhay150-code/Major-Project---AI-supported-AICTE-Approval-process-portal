import { useEffect, useState } from 'react'
import { FileText, Search, CheckCircle } from 'lucide-react'
import { adminAPI } from '../../services/api'
import { formatDate } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'

export default function AdminApplicationsList() {
  const [applications, setApplications] = useState([])
  const [reviewers, setReviewers] = useState([])
  const [loading, setLoading] = useState(true)
  const [assigningId, setAssigningId] = useState(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [appsRes, revRes] = await Promise.all([
        adminAPI.getApplications(),
        adminAPI.getUsers({ role: 'REVIEWER' }),
      ])
      setApplications(appsRes.data || [])
      setReviewers(revRes.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications or reviewers.')
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async (appId, reviewerId) => {
    if (!reviewerId) return
    setAssigningId(appId)
    setError('')
    setSuccessMsg('')
    try {
      const res = await adminAPI.assignReviewer(appId, reviewerId)
      setApplications((prev) => prev.map((a) => (a.id === appId ? res.data : a)))
      setSuccessMsg(`Reviewer assigned and status updated to UNDER_REVIEW (transaction complete).`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign reviewer.')
    } finally {
      setAssigningId(null)
    }
  }

  const filtered = applications.filter(
    (a) =>
      a.applicationNumber.toLowerCase().includes(search.toLowerCase()) ||
      (a.institution?.institutionName || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <LoadingSpinner message="Loading all applications..." />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Applications & Reviewer Assignment</h1>
        <p className="text-sm text-slate-500">
          Assigning a reviewer updates assignedReviewerId and sets status to UNDER_REVIEW atomically
        </p>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />
      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          <CheckCircle className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <div className="card p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by application number or institution..."
            className="input-field pl-9"
          />
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications found"
            description="Applications created by institutes will appear here."
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
                  <th className="table-header">Created</th>
                  <th className="table-header">Assign Reviewer</th>
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
                    <td className="table-cell text-xs text-slate-500">{formatDate(app.createdAt)}</td>
                    <td className="table-cell">
                      <select
                        value={app.assignedReviewerId || ''}
                        disabled={assigningId === app.id || ['APPROVED', 'REJECTED'].includes(app.status)}
                        onChange={(e) => handleAssign(app.id, e.target.value)}
                        className="input-field py-1.5 text-xs min-w-[170px]"
                      >
                        <option value="">Unassigned</option>
                        {reviewers.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
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
