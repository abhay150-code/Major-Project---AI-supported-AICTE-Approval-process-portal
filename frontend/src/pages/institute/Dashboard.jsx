import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  FilePlus,
  Clock,
  CheckCircle,
  XCircle,
  Edit3,
  ArrowRight,
  Building2,
} from 'lucide-react'
import { applicationsAPI, institutionAPI } from '../../services/api'
import { formatDate } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'
import StatusBadge from '../../components/common/StatusBadge'

export default function InstituteDashboard() {
  const [applications, setApplications] = useState([])
  const [institution, setInstitution] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const [appsRes, instRes] = await Promise.allSettled([
        applicationsAPI.list(),
        institutionAPI.getProfile(),
      ])
      if (appsRes.status === 'fulfilled') {
        setApplications(appsRes.value.data || [])
      } else {
        setError('Failed to load applications.')
      }
      if (instRes.status === 'fulfilled') {
        setInstitution(instRes.value.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />

  const stats = {
    total: applications.length,
    draft: applications.filter((a) => a.status === 'DRAFT').length,
    underReview: applications.filter((a) =>
      ['SUBMITTED', 'UNDER_REVIEW', 'CORRECTION_REQUIRED'].includes(a.status)
    ).length,
    approved: applications.filter((a) => a.status === 'APPROVED').length,
    rejected: applications.filter((a) => a.status === 'REJECTED').length,
  }

  const recentApps = [...applications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const statCards = [
    { label: 'Total Applications', value: stats.total, icon: FileText, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Drafts', value: stats.draft, icon: Edit3, bg: 'bg-slate-100', iconColor: 'text-slate-600' },
    { label: 'In Review / Pending', value: stats.underReview, icon: Clock, bg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle, bg: 'bg-green-50', iconColor: 'text-green-600' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, bg: 'bg-red-50', iconColor: 'text-red-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-1">
            <Building2 className="w-4 h-4" />
            <span>Institution Portal</span>
          </div>
          <h1 className="text-2xl font-bold">
            Welcome, {institution?.institutionName || 'Institution'}
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Maintain your institution profile, submit approval or renewal applications, and track reviewer feedback.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/institute/profile"
            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Institution Profile
          </Link>
          <Link
            to="/institute/applications/new"
            className="px-4 py-2.5 bg-white text-primary hover:bg-blue-50 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <FilePlus className="w-4 h-4" />
            New Application
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="card flex items-center gap-4 p-5">
            <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-xs font-medium text-slate-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Applications</h2>
            <p className="text-xs text-slate-500">Latest approval and renewal applications</p>
          </div>
          <Link
            to="/institute/applications"
            className="text-sm font-medium text-primary-light hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            description="Create your first New Approval or Renewal application to begin."
            action={
              <Link to="/institute/applications/new" className="btn-primary text-sm">
                Create New Application
              </Link>
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
                  <th className="table-header">Reviewer</th>
                  <th className="table-header">Created</th>
                  <th className="table-header text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
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
                    <td className="table-cell text-slate-500 text-xs">{formatDate(app.createdAt)}</td>
                    <td className="table-cell text-right">
                      <Link
                        to={`/institute/applications/${app.id}`}
                        className="text-primary-light hover:underline font-medium text-xs"
                      >
                        Open Details →
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
