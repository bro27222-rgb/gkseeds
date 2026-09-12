import React, { useState, useEffect } from 'react'
import { Menu, X, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const navLinks = [
  { label: 'Home',       href: '#home'      },
  { label: 'About Us',   href: '#about'     },
  { label: 'Our Crops',  href: '#crops'     },
  { label: 'Facilities', href: '#facilities'},
  { label: 'Contact',    href: '#contact'   },
]

export default function Navbar() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive]     = useState('#home')
  const navigate                = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 48)

      const sections = navLinks.map(l => l.href.replace('#', ''))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(`#${sections[i]}`)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNav = (href) => {
    setOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const goToAdmin = () => {
    setOpen(false)
    navigate('/admin/login')
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/96 backdrop-blur-md shadow-elegant border-b border-forest-100'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-24">

        {/* ── Logo + Name ── */}
        <a
          href="#home"
          onClick={e => { e.preventDefault(); handleNav('#home') }}
          className="flex items-center gap-3 group"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-forest-600 to-forest-800 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300 overflow-hidden flex-shrink-0">
            <img src={logo} alt="Ganga Kaveri Seeds Logo" className="w-full h-full object-contain p-1" />
          </div>

          <div className="leading-tight">
            <span className={`font-accent text-xl font-bold tracking-wide transition-colors duration-300 ${scrolled ? 'text-forest-800' : 'text-white'}`}>
              Ganga Kaveri Seeds
            </span>
            <span className={`block text-xs tracking-[0.18em] uppercase font-body font-semibold transition-colors duration-300 ${scrolled ? 'text-earth-600' : 'text-harvest-300'}`}>
              Pvt. Ltd.
            </span>
          </div>
        </a>

        {/* ── Desktop Nav ── */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <li key={link.href}>
              <button
                onClick={() => handleNav(link.href)}
                className={`nav-link font-body text-sm font-semibold tracking-wide transition-colors duration-300 ${
                  active === link.href
                    ? scrolled ? 'text-forest-700' : 'text-harvest-300'
                    : scrolled ? 'text-forest-900 hover:text-forest-600' : 'text-white/90 hover:text-white'
                } ${active === link.href ? 'active' : ''}`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* ── Desktop right-side buttons ── */}
        <div className="hidden md:flex items-center gap-3">
          {/* Admin Login — subtle, doesn't compete with main CTA */}
          <button
            onClick={goToAdmin}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-all duration-200 font-body text-xs font-semibold tracking-wide ${
              scrolled
                ? 'text-forest-600 hover:text-forest-800 hover:bg-forest-50 border border-forest-200 hover:border-forest-300'
                : 'text-white/60 hover:text-white/90 border border-white/20 hover:border-white/40 hover:bg-white/10'
            }`}
            title="Admin Portal"
          >
            <Lock size={12} strokeWidth={2} />
            Admin
          </button>

          {/* Primary CTA */}
          <a
            href="#contact"
            onClick={e => { e.preventDefault(); handleNav('#contact') }}
            className="btn-primary text-sm"
            style={scrolled ? {} : { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.4)' }}
          >
            Get In Touch
          </a>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden p-2 rounded-md transition-colors ${scrolled ? 'text-forest-800' : 'text-white'}`}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${open ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white/98 backdrop-blur-md border-t border-forest-100 px-6 py-4 space-y-1">
          {navLinks.map(link => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="block w-full text-left py-3 px-4 font-body text-sm font-semibold text-forest-800 hover:text-forest-600 hover:bg-forest-50 rounded-md transition-colors"
            >
              {link.label}
            </button>
          ))}

          {/* Admin link in mobile menu */}
          <button
            onClick={goToAdmin}
            className="flex w-full items-center gap-2 py-3 px-4 font-body text-sm font-semibold text-forest-500 hover:text-forest-700 hover:bg-forest-50 rounded-md transition-colors border-t border-forest-100 mt-1 pt-4"
          >
            <Lock size={13} strokeWidth={2} />
            Admin Portal
          </button>

          <div className="pt-2 pb-1">
            <button
              onClick={() => handleNav('#contact')}
              className="btn-primary w-full justify-center"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}