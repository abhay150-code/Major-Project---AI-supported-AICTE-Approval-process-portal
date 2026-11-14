import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Send,
  MessageSquare,
  FileCheck,
} from 'lucide-react'
import { applicationsAPI } from '../../services/api'
import { formatDate } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'

export default function InstituteApplicationDetail() {
  const { id } = useParams()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingDoc, setUpdatingDoc] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    loadApplication()
  }, [id])

  const loadApplication = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await applicationsAPI.getById(id)
      setApplication(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load application details.')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleChecklistItem = async (doc) => {
    const nextStatus = doc.status === 'PENDING' ? 'SUBMITTED' : 'PENDING'
    setUpdatingDoc(true)
    setError('')
    try {
      await applicationsAPI.update(id, {
        documents: [{ requirementId: doc.requirementId, status: nextStatus }],
      })
      await loadApplication()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update checklist item.')
    } finally {
      setUpdatingDoc(false)
    }
  }

  const handleSubmitApplication = async () => {
    setSubmitting(true)
    setError('')
    setSuccessMsg('')
    try {
      const res = await applicationsAPI.submit(id, {})
      setApplication((prev) => ({ ...prev, ...res.data }))
      setSuccessMsg('Application submitted successfully using a database transaction!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading application..." />
  if (!application) return <ErrorMessage message={error || 'Application not found.'} />

  const canEdit = ['DRAFT', 'CORRECTION_REQUIRED'].includes(application.status)
  const docs = application.documents || []
  const comments = application.comments || []
  const requiredDocs = docs.filter((d) => d.requirement?.isRequired)
  const completedRequired = requiredDocs.filter((d) => d.status !== 'PENDING').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link
            to="/institute/applications"
            className="text-xs font-medium text-slate-500 hover:text-primary-light inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Applications
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 font-mono">
              {application.applicationNumber}
            </h1>
            <StatusBadge status={application.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Type: {application.applicationType.replace('_', ' ')} • Institution:{' '}
            {application.institution?.institutionName}
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleSubmitApplication}
            disabled={submitting}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        )}
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />
      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Application Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 space-y-1">
          <p className="text-xs text-slate-500">Assigned Reviewer</p>
          <p className="font-semibold text-sm text-slate-900">
            {application.assignedReviewer?.name || 'Not yet assigned'}
          </p>
        </div>
        <div className="card p-4 space-y-1">
          <p className="text-xs text-slate-500">Checklist Progress</p>
          <p className="font-semibold text-sm text-slate-900">
            {completedRequired} / {requiredDocs.length} Required Items Marked Submitted
          </p>
        </div>
        <div className="card p-4 space-y-1">
          <p className="text-xs text-slate-500">Last Updated</p>
          <p className="font-semibold text-sm text-slate-900">
            {formatDate(application.updatedAt)}
          </p>
        </div>
      </div>

      {/* Document Checklist */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary-light" />
            Required Document Checklist
          </h2>
          <span className="text-xs text-slate-500">
            Demonstration requirements (not official AICTE regulations)
          </span>
        </div>

        <div className="space-y-2.5">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50"
            >
              <div>
                <p className="font-medium text-sm text-slate-900">
                  {doc.requirement?.name}
                  {doc.requirement?.isRequired && (
                    <span className="ml-2 text-[11px] text-red-600 font-normal">* Required</span>
                  )}
                </p>
                <p className="text-xs text-slate-500">{doc.requirement?.description}</p>
                {doc.submittedAt && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Submitted: {formatDate(doc.submittedAt)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={doc.status} />
                {canEdit && (
                  <button
                    onClick={() => handleToggleChecklistItem(doc)}
                    disabled={updatingDoc}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    {doc.status === 'PENDING' ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Mark Submitted
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-slate-500" /> Set Pending
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviewer Comments */}
      <div className="card space-y-3">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-500" />
          Reviewer Comments ({comments.length})
        </h2>
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500">No reviewer comments yet.</p>
        ) : (
          <div className="space-y-2.5">
            {comments.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <strong className="text-slate-900">{c.reviewer?.name || 'Reviewer'}</strong>
                  <span>{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-sm text-slate-700">{c.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
