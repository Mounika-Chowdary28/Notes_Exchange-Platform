import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, BookOpen, Calendar, CheckCircle, AlertCircle, Shield } from 'lucide-react'
import { BRANCHES, SEMESTERS } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export function Auth() {
  const { login, signup } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'

  const [mode, setMode] = useState(location.state?.mode || 'login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [asAdmin, setAsAdmin] = useState(false)
  const [branch, setBranch] = useState('CSE')
  const [semester, setSemester] = useState('4')
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      showToast('Please enter your email.', 'error')
      return
    }
    setLoading(true)
    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          showToast('Please enter your full name.', 'error')
          return
        }
        if (password.length < 6) {
          showToast('Use at least 6 characters for password.', 'error')
          return
        }
        await signup(name, email.trim(), password, { branch, semester, rememberMe })
        showToast('Account created successfully!', 'success')
      } else {
        if (!password) {
          showToast('Please enter your password.', 'error')
          return
        }
        await login(email.trim(), password, { rememberMe })
        showToast('Signed in successfully.', 'success')
      }
      navigate(from, { replace: true })
    } catch (error) {
      showToast(error.message || 'Authentication failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8fafc] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100"
      >
        {/* Left Side: Visual/Marketing */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#10b981_0%,transparent_50%)]" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,#3b82f6_0%,transparent_50%)]" />
          </div>
          
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-12">
              <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter">NOTES<span className="text-emerald-500">FLOW</span></span>
            </Link>

            <div className="space-y-8">
              <h2 className="text-5xl font-black leading-tight">
                Master your <br />
                <span className="text-emerald-400">Engineering</span> <br />
                journey.
              </h2>
              <p className="text-lg text-slate-400 font-medium max-w-md">
                Join thousands of students sharing high-quality notes, PYQs, and study materials.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-black text-emerald-400 mb-1">10k+</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Notes Shared</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-black text-blue-400 mb-1">50+</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Institutions</div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h1 className="text-3xl font-black text-slate-900 mb-2">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h1>
              <p className="text-slate-500 font-medium">
                {mode === 'login' 
                  ? 'Enter your credentials to access your account' 
                  : 'Start your journey with the best study materials'}
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2.5 text-sm font-black uppercase tracking-wider rounded-xl transition-all ${
                  mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2.5 text-sm font-black uppercase tracking-wider rounded-xl transition-all ${
                  mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Signup
              </button>
            </div>

            <form onSubmit={submit} className="space-y-5">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Branch</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                      <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                      >
                        {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Semester</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                      <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                      >
                        {SEMESTERS.map(s => <option key={s} value={s}>Sem {s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Password</label>
                  {mode === 'login' && (
                    <Link to="/auth/forgot" className="text-xs font-black text-emerald-600 hover:text-emerald-700">Forgot?</Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5 rounded-lg border-slate-300 text-emerald-500 focus:ring-emerald-500/20"
                />
                <label htmlFor="remember" className="text-sm font-bold text-slate-600 cursor-pointer">Remember me</label>
              </div>

              {mode === 'login' && (
                <div className="flex items-center gap-3 ml-1">
                  <input
                    type="checkbox"
                    id="admin"
                    checked={asAdmin}
                    onChange={(e) => setAsAdmin(e.target.checked)}
                    className="h-5 w-5 rounded-lg border-slate-300 text-blue-500 focus:ring-blue-500/20"
                  />
                  <label htmlFor="admin" className="text-sm font-bold text-slate-600 cursor-pointer flex items-center gap-1.5">
                    Sign in as Admin <Shield className="h-3.5 w-3.5 text-blue-500" />
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 mt-4 bg-slate-900 text-white rounded-2xl text-base font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-slate-900/10"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm font-bold text-slate-500">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
                >
                  {mode === 'login' ? 'Sign up for free' : 'Log in here'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
