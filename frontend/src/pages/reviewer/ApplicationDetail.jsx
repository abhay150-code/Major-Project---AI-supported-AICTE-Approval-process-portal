import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  FileCheck,
  MessageSquare,
  CheckCircle,
  Send,
} from 'lucide-react'
import { applicationsAPI, reviewerAPI } from '../../services/api'
import { formatDate } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import StatusBadge from '../../components/common/StatusBadge'

export default function ReviewerApplicationDetail() {
  const { id } = useParams()
  const [application, setApplication] = useState(null)
  const [newStatus, setNewStatus] = useState('UNDER_REVIEW')
  const [statusComment, setStatusComment] = useState('')
  const [commentText, setCommentText] = useState('')
  const [docStatuses, setDocStatuses] = useState({})

  const [loading, setLoading] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
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
      const data = res.data
      setApplication(data)
      if (['UNDER_REVIEW', 'CORRECTION_REQUIRED', 'APPROVED', 'REJECTED'].includes(data.status)) {
        setNewStatus(data.status)
      }
      const map = {}
      for (const d of data.documents || []) {
        map[d.id] = d.status
      }
      setDocStatuses(map)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load application.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) {
      setError('Please enter a comment')
      return
    }
    setSubmittingComment(true)
    setError('')
    try {
      await reviewerAPI.addComment(id, commentText)
      setCommentText('')
      setSuccessMsg('Review comment added.')
      await loadApplication()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment.')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleUpdateStatus = async (e) => {
    e.preventDefault()
    setUpdatingStatus(true)
    setError('')
    setSuccessMsg('')
    try {
      const documentUpdates = Object.entries(docStatuses).map(([docId, status]) => ({
        id: docId,
        status,
      }))
      await reviewerAPI.updateStatus(id, {
        status: newStatus,
        comment: statusComment.trim() || undefined,
        documentUpdates,
      })
      setStatusComment('')
      setSuccessMsg('Application status and checklist verification updated.')
      await loadApplication()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading application for review..." />
  if (!application) return <ErrorMessage message={error || 'Application not found.'} />

  const docs = application.documents || []
  const comments = application.comments || []

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/reviewer/applications"
          className="text-xs font-medium text-slate-500 hover:text-primary-light inline-flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Assigned Applications
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 font-mono">
            {application.applicationNumber}
          </h1>
          <StatusBadge status={application.status} />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {application.applicationType.replace('_', ' ')} • {application.institution?.institutionName}
        </p>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />
      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Institution Info */}
      <div className="card space-y-3">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-700" />
          Institution Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-500">Institution Name</p>
            <p className="font-medium text-slate-900">{application.institution?.institutionName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Establishment Year</p>
            <p className="font-medium text-slate-900">{application.institution?.establishmentYear}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Address</p>
            <p className="font-medium text-slate-900">{application.institution?.address}</p>
          </div>
        </div>
      </div>

      {/* Document Checklist Verification */}
      <div className="card space-y-4">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-700" />
          Document Checklist Status
        </h2>
        <div className="space-y-2.5">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50"
            >
              <div>
                <p className="font-medium text-sm text-slate-900">{doc.requirement?.name}</p>
                <p className="text-xs text-slate-500">{doc.requirement?.description}</p>
              </div>
              <select
                value={docStatuses[doc.id] || doc.status}
                onChange={(e) =>
                  setDocStatuses((prev) => ({ ...prev, [doc.id]: e.target.value }))
                }
                className="input-field sm:w-44 text-xs"
              >
                <option value="PENDING">PENDING</option>
                <option value="SUBMITTED">SUBMITTED</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Review Controls + Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleUpdateStatus} className="card space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Update Application Status</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Decision / Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="input-field"
            >
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="CORRECTION_REQUIRED">Request Correction</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Optional Status Note
            </label>
            <textarea
              rows={3}
              value={statusComment}
              onChange={(e) => setStatusComment(e.target.value)}
              placeholder="Reason for status change or requested corrections..."
              className="input-field"
            />
          </div>
          <button type="submit" disabled={updatingStatus} className="btn-primary w-full">
            {updatingStatus ? 'Saving...' : 'Save Status & Checklist'}
          </button>
        </form>

        <div className="space-y-6">
          <form onSubmit={handleAddComment} className="card space-y-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Add Review Comment
            </h2>
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write observation for the institution..."
              className="input-field"
            />
            <button
              type="submit"
              disabled={submittingComment}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          <div className="card space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Comment History ({comments.length})
            </h3>
            {comments.length === 0 ? (
              <p className="text-xs text-slate-500">No comments posted yet.</p>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {comments.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <div className="flex justify-between text-slate-500 mb-1">
                      <strong className="text-slate-800">{c.reviewer?.name || 'Reviewer'}</strong>
                      <span>{formatDate(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-700">{c.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
