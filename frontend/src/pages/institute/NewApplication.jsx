import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FilePlus, ArrowRight } from 'lucide-react'
import { applicationsAPI } from '../../services/api'
import ErrorMessage from '../../components/common/ErrorMessage'

export default function NewApplication() {
  const navigate = useNavigate()
  const [applicationType, setApplicationType] = useState('NEW_APPROVAL')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    try {
      const res = await applicationsAPI.create({ applicationType })
      navigate(`/institute/applications/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create application.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create New Application</h1>
        <p className="text-sm text-slate-500">
          Select an application type. Required demonstration checklist items will be initialized automatically.
        </p>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      <form onSubmit={handleCreate} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Application Type *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                value: 'NEW_APPROVAL',
                title: 'New Approval',
                desc: 'Apply for initial approval of a new institution or program.',
              },
              {
                value: 'RENEWAL',
                title: 'Renewal',
                desc: 'Annual extension/renewal of approval for an existing institution.',
              },
            ].map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setApplicationType(opt.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  applicationType === opt.value
                    ? 'border-primary-light bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className="font-semibold text-sm text-slate-900">{opt.title}</p>
                <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
          Note: Document requirements generated for this application are demonstration requirements, not verified official AICTE regulations.
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={creating} className="btn-primary flex items-center gap-2">
            <FilePlus className="w-4 h-4" />
            {creating ? 'Creating Draft...' : 'Create Application'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
