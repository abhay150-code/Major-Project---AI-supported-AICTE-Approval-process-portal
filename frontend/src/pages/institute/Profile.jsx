import { useEffect, useState } from 'react'
import { Building2, Save, CheckCircle } from 'lucide-react'
import { institutionAPI } from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

export default function InstituteProfile() {
  const [form, setForm] = useState({
    institutionName: '',
    address: '',
    establishmentYear: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await institutionAPI.getProfile()
      const d = res.data
      setForm({
        institutionName: d.institutionName || '',
        address: d.address || '',
        establishmentYear: d.establishmentYear || '',
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load institution profile.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setSaved(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.institutionName.trim() || !form.address.trim() || !form.establishmentYear) {
      setError('Institution name, address, and establishment year are required')
      return
    }
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      await institutionAPI.updateProfile({
        institutionName: form.institutionName,
        address: form.address,
        establishmentYear: Number(form.establishmentYear),
      })
      setSaved(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading institution profile..." />

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Institution Profile</h1>
          <p className="text-sm text-slate-500">
            Stored separately in the Institutions table (3NF normalization)
          </p>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />
      {saved && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          <CheckCircle className="w-4 h-4" /> Institution profile saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Institution Name *</label>
          <input
            name="institutionName"
            value={form.institutionName}
            onChange={handleChange}
            placeholder="e.g., Rajiv Gandhi Institute of Technology"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Campus Address *</label>
          <textarea
            rows={3}
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Full campus address, city, and state"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Establishment Year *</label>
          <input
            type="number"
            name="establishmentYear"
            value={form.establishmentYear}
            onChange={handleChange}
            placeholder="e.g., 1998"
            className="input-field"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
