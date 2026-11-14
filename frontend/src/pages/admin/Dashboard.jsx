import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, FileText, Clock, UserCheck, Users } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts'
import { adminAPI } from '../../services/api'
import { getStatusLabel } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const STATUS_COLORS = {
  DRAFT: '#94a3b8',
  SUBMITTED: '#2563eb',
  UNDER_REVIEW: '#d97706',
  CORRECTION_REQUIRED: '#ea580c',
  APPROVED: '#16a34a',
  REJECTED: '#dc2626',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await adminAPI.getDashboard()
      setStats(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin dashboard.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading admin dashboard..." />

  const byStatus = stats?.applicationsByStatus || {}
  const pendingCount =
    (byStatus.SUBMITTED || 0) +
    (byStatus.UNDER_REVIEW || 0) +
    (byStatus.CORRECTION_REQUIRED || 0)

  const chartData = Object.entries(byStatus).map(([key, count]) => ({
    name: getStatusLabel(key),
    statusKey: key,
    count,
  }))

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, bg: 'bg-slate-100', color: 'text-slate-700' },
    { label: 'Institutions', value: stats?.totalInstitutions ?? 0, icon: Building2, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Total Applications', value: stats?.totalApplications ?? 0, icon: FileText, bg: 'bg-purple-50', color: 'text-purple-600' },
    { label: 'Pending Review', value: pendingCount, icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
    { label: 'Reviewers', value: stats?.totalReviewers ?? 0, icon: UserCheck, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
          <p className="text-sm text-slate-500">
            Manage users, monitor applications, and assign reviewers
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/applications" className="btn-primary text-sm">
            Assign Reviewers
          </Link>
          <Link to="/admin/users" className="btn-secondary text-sm">
            View Users
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
        <h2 className="text-base font-semibold text-slate-900 mb-4">Applications by Status</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 16, left: -16, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-12} textAnchor="end" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.statusKey} fill={STATUS_COLORS[entry.statusKey] || '#2563eb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
