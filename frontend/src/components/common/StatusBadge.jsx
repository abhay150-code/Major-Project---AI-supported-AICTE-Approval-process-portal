import { getStatusColor, getStatusLabel } from '../../utils/helpers'

export default function StatusBadge({ status, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)} ${className}`}
    >
      {getStatusLabel(status)}
    </span>
  )
}
