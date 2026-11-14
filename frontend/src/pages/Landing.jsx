import { Link } from 'react-router-dom'
import {
  Shield,
  FileCheck,
  Users,
  Lock,
  ArrowRight,
  Building2,
  ClipboardCheck,
  UserCog,
  ChevronRight,
  Database,
  CheckCircle2,
} from 'lucide-react'

const features = [
  {
    icon: Building2,
    title: 'Institution Profiles',
    description: 'Institutes register once and maintain normalized profile details separately from applications.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: FileCheck,
    title: 'Document Checklists',
    description: 'Structured checklists for New Approval and Renewal applications with clear submission statuses.',
    color: 'text-green-600 bg-green-50',
  },
  {
    icon: Database,
    title: 'PostgreSQL + Prisma 7',
    description: 'Normalized 3NF relational schema with foreign keys, enums, and ACID database transactions.',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    icon: ClipboardCheck,
    title: 'Reviewer Feedback',
    description: 'Reviewers inspect assigned applications, add review comments, request corrections, or update statuses.',
    color: 'text-orange-600 bg-orange-50',
  },
  {
    icon: Users,
    title: 'Role-Based Portals',
    description: 'Dedicated workflows for Institutes, Reviewers, and Administrators protected by role middleware.',
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    icon: Lock,
    title: 'JWT Authentication',
    description: 'Secure password hashing with bcryptjs and stateless JSON Web Token session protection.',
    color: 'text-red-600 bg-red-50',
  },
]

const steps = [
  { step: '01', title: 'Register & Login', description: 'Create an institute account and sign in securely with JWT authentication.' },
  { step: '02', title: 'Institution Profile', description: 'Complete institution name, address, and establishment year.' },
  { step: '03', title: 'Create Application', description: 'Start a New Approval or Renewal application with required checklist items.' },
  { step: '04', title: 'Submit Checklist', description: 'Mark required demonstration documents as submitted in an atomic transaction.' },
  { step: '05', title: 'Reviewer Assignment', description: 'Admin assigns a reviewer, atomically updating status to Under Review.' },
  { step: '06', title: 'Review & Decision', description: 'Reviewer adds comments, requests corrections, or approves/rejects the application.' },
]

const roles = [
  {
    icon: Building2,
    role: 'Institute',
    description: 'Manage profile, create approval or renewal applications, update checklists, and track status.',
    path: '/login',
    color: 'from-blue-600 to-blue-800',
  },
  {
    icon: ClipboardCheck,
    role: 'Reviewer',
    description: 'View assigned applications, add review comments, request corrections, and record status decisions.',
    path: '/login',
    color: 'from-emerald-600 to-emerald-800',
  },
  {
    icon: UserCog,
    role: 'Administrator',
    description: 'Monitor application statistics, manage user accounts, and assign applications to reviewers.',
    path: '/login',
    color: 'from-purple-600 to-purple-800',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-900 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">AICTE Approval Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-primary-light hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary to-blue-800" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" />
            <span className="text-white/90 text-xs font-medium">Institutional Approval Management System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            AICTE Smart Approval
            <br />
            <span className="text-blue-300">Management Portal</span>
          </h1>

          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            A database-driven web portal built with React, Express.js, Prisma 7, and PostgreSQL for managing
            institutional approval and renewal applications across Institutes, Reviewers, and Administrators.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-black/20"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/30 transition-colors backdrop-blur"
            >
              See Workflow
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-light uppercase tracking-wide">Features</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">Core Portal Capabilities</h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Built with normalized PostgreSQL tables, atomic Prisma transactions, and JWT role-based access control.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-light uppercase tracking-wide">Process</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">Application Workflow</h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              End-to-end approval process from institution registration to review decision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-bold text-primary-light/20">{step.step}</span>
                    {index < steps.length - 1 && (
                      <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 z-10" />
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-400 uppercase tracking-wide">Access</span>
            <h2 className="text-3xl font-bold text-white mt-2 mb-4">Role-Based Portals</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Three distinct user roles with dedicated dashboards and permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.role} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
                <div className={`bg-gradient-to-r ${role.color} p-6`}>
                  <role.icon className="w-10 h-10 text-white mb-3" />
                  <h3 className="text-xl font-bold text-white">{role.role}</h3>
                </div>
                <div className="p-6">
                  <p className="text-slate-400 text-sm leading-relaxed mb-5">{role.description}</p>
                  <Link
                    to={role.path}
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Sign in as {role.role}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-700 rounded-md flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-sm">AICTE Smart Approval Portal</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500">
              Academic Prototype Disclaimer: Built for educational DBMS and Web Development evaluation only. Not an official AICTE system.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
