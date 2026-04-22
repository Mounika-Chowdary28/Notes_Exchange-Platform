import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, Share2, Mail, Heart, GraduationCap, BookOpen, FileText, Bookmark } from 'lucide-react'
import { Logo } from './Logo'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Platform: [
      { name: 'Browse Notes', href: '/browse', icon: BookOpen },
      { name: 'Previous Papers', href: '/papers', icon: FileText },
      { name: 'Study Roadmaps', href: '/roadmap', icon: GraduationCap },
      { name: 'Saved Collections', href: '/collections', icon: Bookmark },
    ],
    Support: [
      { name: 'Help Center', href: '#' },
      { name: 'Community Guidelines', href: '#' },
      { name: 'Academic Integrity', href: '#' },
      { name: 'Contact Us', href: '#' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ],
  }

  const socialLinks = [
    { icon: Globe, href: '#', label: 'Website' },
    { icon: Share2, href: '#', label: 'Share' },
    { icon: Mail, href: '#', label: 'Email' },
  ]

  return (
    <footer className="mt-20 w-full border-t border-slate-100 bg-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-6">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              Empowering students with high-quality engineering notes, previous year papers, and structured study roadmaps. Join our community of learners today.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  whileHover={{ y: -3 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="group flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-emerald-600"
                    >
                      {link.icon && (
                        <link.icon size={14} className="text-slate-400 transition-colors group-hover:text-emerald-500" />
                      )}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-slate-50 pt-8 text-center sm:flex-row">
          <p className="text-xs text-slate-400">
            © {currentYear} Notes Exchange. All rights reserved. Built for Engineering Excellence.
          </p>
          <p className="mt-4 flex items-center gap-1 text-xs text-slate-400 sm:mt-0">
            Made with <Heart size={12} className="fill-red-400 text-red-400" /> for the student community.
          </p>
        </div>
      </div>
    </footer>
  )
}
