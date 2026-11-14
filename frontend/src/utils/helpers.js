export function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Invalid date'
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getStatusColor(status) {
  const colors = {
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    submitted: 'bg-blue-100 text-blue-700 border-blue-200',
    under_review: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    correction_required: 'bg-orange-100 text-orange-700 border-orange-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-slate-100 text-slate-700 border-slate-200',
    verified: 'bg-green-100 text-green-700 border-green-200',
  }
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200'
}

export function getStatusLabel(status) {
  const labels = {
    draft: 'Draft',
    submitted: 'Submitted',
    under_review: 'Under Review',
    correction_required: 'Correction Required',
    approved: 'Approved',
    rejected: 'Rejected',
    pending: 'Pending',
    verified: 'Verified',
  }
  return labels[status?.toLowerCase()] || status || 'Unknown'
}
