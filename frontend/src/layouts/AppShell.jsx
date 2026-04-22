import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, BookOpen, FileText, Target, Bookmark, User, LogOut, Upload, Settings, Crown } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Footer } from '../components/Footer'
import { ToastHost } from '../components/ToastHost'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/browse', label: 'Browse', icon: BookOpen },
  { to: '/papers', label: 'Papers', icon: FileText },
  { to: '/collections', label: 'Collections', icon: Bookmark },
  { to: '/bookmarks', label: 'Saved', icon: Bookmark },
]

// Modern navigation link styles with proper hover effects
const navLinkClass = ({ isActive }) =>
  `relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ease-out flex items-center gap-2 ${
    isActive
      ? 'bg-emerald-500/10 text-emerald-600 shadow-sm shadow-emerald-500/5'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

const primaryButtonClass = "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-slate-900 text-white shadow-xl shadow-slate-900/10 transition-all duration-300 ease-out hover:shadow-2xl hover:scale-105 hover:bg-emerald-600 active:scale-95"

const secondaryButtonClass = "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl border-2 border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 ease-out hover:border-emerald-500 hover:text-emerald-600 hover:shadow-lg active:scale-95"

export function AppShell({ children }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleLogout = () => {
    setOpen(false)
    logout()
    // Use setTimeout to ensure state is cleared before navigation
    setTimeout(() => {
      navigate('/', { replace: true })
    }, 0)
  }

  return (
    <div className="bg-grid mesh-gradient min-h-screen">
      <a
        href="#main"
        className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-gradient-to-r focus:from-emerald-500 focus:to-cyan-500 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        Skip to content
      </a>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-lg shadow-slate-200/50 py-2' 
          : 'bg-transparent py-4'
      }`}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <Logo className="h-9 w-auto" />
            </motion.div>
            
            {/* Center: Navigation Links */}
            <nav className="hidden lg:flex items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/60" aria-label="Primary navigation">
              <div className="flex items-center space-x-1">
                {links.map((l, index) => (
                  <NavLink 
                    key={l.to}
                    to={l.to} 
                    className={navLinkClass}
                  >
                    <l.icon className="h-4 w-4" />
                    {l.label}
                  </NavLink>
                ))}
                {isAdmin && (
                  <NavLink to="/admin" className={navLinkClass}>
                    <Crown className="h-4 w-4" />
                    Admin
                  </NavLink>
                )}
              </div>
            </nav>
            
            {/* Right: Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              {isAuthenticated ? (
                <>
                  <Link
                    to="/upload"
                    className={primaryButtonClass}
                  >
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline">Upload</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className={secondaryButtonClass}
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                  
                  <div className="hidden md:flex items-center space-x-2 pl-2 border-l border-gray-200">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50">
                      {user?.role === 'admin' ? (
                        <Crown className="h-3 w-3 text-yellow-500" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
                        {user?.name?.split(' ')[0]}
                      </span>
                    </div>
                    <motion.button
                      type="button"
                      onClick={handleLogout}
                      className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Log out"
                    >
                      <LogOut className="h-4 w-4" />
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    state={{ mode: 'login' }}
                    className={secondaryButtonClass}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Log in</span>
                  </Link>
                  <Link
                    to="/auth"
                    state={{ mode: 'signup' }}
                    className={primaryButtonClass}
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign up</span>
                  </Link>
                </>
              )}
              
              {/* Mobile Menu Button */}
              <motion.button
                type="button"
                className="lg:hidden p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
                aria-expanded={open}
                aria-label="Toggle menu"
                onClick={() => setOpen((o) => !o)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {open ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>
          
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-gray-200 bg-white/95 backdrop-blur-xl lg:hidden overflow-hidden"
              >
                <div className="px-6 py-6">
                  <div className="space-y-2">
                    {/* Mobile Navigation Links */}
                    {links.map((l, index) => (
                      <motion.div
                        key={l.to}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <NavLink 
                          to={l.to} 
                          className={navLinkClass}
                          onClick={() => setOpen(false)}
                        >
                          <span className="flex items-center gap-3">
                            <l.icon className="h-5 w-5" />
                            {l.label}
                          </span>
                        </NavLink>
                      </motion.div>
                    ))}
                    {isAdmin && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: links.length * 0.05, duration: 0.3 }}
                      >
                        <NavLink to="/admin" className={navLinkClass} onClick={() => setOpen(false)}>
                          <span className="flex items-center gap-3">
                            <Crown className="h-5 w-5" />
                            Admin
                          </span>
                        </NavLink>
                      </motion.div>
                    )}
                    
                    {/* Mobile Action Buttons */}
                    {isAuthenticated ? (
                      <>
                        <div className="pt-4 border-t border-gray-200 space-y-2">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (links.length + 1) * 0.05, duration: 0.3 }}
                          >
                            <Link
                              to="/upload"
                              className={primaryButtonClass}
                              onClick={() => setOpen(false)}
                            >
                              <Upload className="h-4 w-4" />
                              Upload
                            </Link>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (links.length + 2) * 0.05, duration: 0.3 }}
                          >
                            <Link
                              to="/dashboard"
                              className={secondaryButtonClass}
                              onClick={() => setOpen(false)}
                            >
                              <User className="h-4 w-4" />
                              Dashboard
                            </Link>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (links.length + 3) * 0.05, duration: 0.3 }}
                            className="flex items-center justify-between pt-2"
                          >
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50">
                              {user?.role === 'admin' ? (
                                <Crown className="h-3 w-3 text-yellow-500" />
                              ) : (
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                              )}
                              <span className="text-sm font-medium text-gray-700">
                                {user?.name?.split(' ')[0]}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleLogout}
                              className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                            >
                              <LogOut className="h-4 w-4" />
                            </button>
                          </motion.div>
                        </div>
                      </>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (links.length + 1) * 0.05, duration: 0.3 }}
                        className="pt-4 border-t border-gray-200 space-y-2"
                      >
                        <Link
                          to="/auth"
                          state={{ mode: 'login' }}
                          className={secondaryButtonClass}
                          onClick={() => setOpen(false)}
                        >
                          <LogOut className="h-4 w-4" />
                          Log in
                        </Link>
                        <Link
                          to="/auth"
                          state={{ mode: 'signup' }}
                          className={primaryButtonClass}
                          onClick={() => setOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          Sign up
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main id="main" className="w-full py-0 sm:py-0 px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>

      <Footer />
      <ToastHost />
    </div>
  )
}
