import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => { if (r.ok) setLoggedIn(true); })
      .catch(() => {});
  }, []);

  const navLinks = [
    { name: 'Features', path: '/features' },
    { name: 'Commands', path: '/commands' },
    { name: 'Pricing', path: '/pricing' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'backdrop-blur-3xl'
            : 'bg-transparent backdrop-blur-none'
        }`}
        style={scrolled ? { background: 'color-mix(in srgb, var(--color-base) 85%, transparent)', boxShadow: '0 1px 0 var(--glass-border), 0 4px 30px rgba(0,0,0,0.15)' } : {}}
      >
        {/* Subtle top highlight line */}
        <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-700 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: `linear-gradient(90deg, transparent, var(--glass-shine) 30%, var(--glass-shine) 50%, var(--glass-shine) 70%, transparent)` }} />

        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[56px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative">
              <img
                src="/bot-logo.png"
                alt="UltimateBot"
                className="w-8 h-8 rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -inset-1 rounded-xl bg-primary/0 group-hover:bg-primary/10 transition-all duration-500 blur-md" />
            </div>
            <span className="font-display text-[15px] font-semibold tracking-tight text-text-main/90 hidden sm:inline group-hover:text-text-main transition-colors duration-300">
              UltimateBot
            </span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center rounded-full px-1.5 py-1" style={{ background: 'var(--pill-bg)' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-[13px] px-5 py-[6px] rounded-full transition-all duration-300 ${
                    isActive
                      ? 'text-text-main font-medium'
                      : 'text-text-main/40 hover:text-text-main/75'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'var(--pill-active-bg)', boxShadow: '0 0 12px var(--btn-glow)' }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
              style={{ background: 'var(--pill-bg)' }}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-text-main/50 hover:text-text-main/80" />
                  ) : (
                    <Moon className="w-4 h-4 text-text-main/50 hover:text-text-main/80" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            {loggedIn ? (
              <Link
                to="/dashboard"
                className="group relative text-[13px] font-medium text-white px-5 py-[8px] rounded-full overflow-hidden transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-full opacity-90 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to right, #5864F1, #7B61FF)' }} />
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500" style={{ background: 'linear-gradient(to right, #5864F1, #7B61FF)' }} />
                <span className="relative z-10 flex items-center gap-1.5">
                  Dashboard
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                </span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[13px] text-text-main/40 hover:text-text-main/80 transition-colors duration-300 px-3 py-[6px]"
                >
                  Sign in
                </Link>
                <Link
                  to="/login"
                  className="group relative text-[13px] font-medium text-white px-5 py-[8px] rounded-full overflow-hidden transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-full opacity-90 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to right, #5864F1, #7B61FF)' }} />
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500" style={{ background: 'linear-gradient(to right, #5864F1, #7B61FF)' }} />
                  <span className="relative z-10 flex items-center gap-1.5">
                    Get Started
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
              style={{ background: 'var(--pill-bg)' }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-text-main/50" /> : <Moon className="w-4 h-4 text-text-main/50" />}
            </button>
          <button
            className="text-text-main/50 hover:text-text-main p-2 rounded-xl transition-all duration-300"
            style={{ background: 'var(--hover-overlay)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileOpen ? 'close' : 'open'}
                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </AnimatePresence>
          </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 backdrop-blur-sm md:hidden"
              style={{ background: 'var(--mobile-overlay)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[68px] left-4 right-4 z-50 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:hidden"
              style={{ background: 'var(--mobile-menu-bg)', border: '1px solid var(--mobile-menu-border)' }}
            >
              <div className="p-4 space-y-0.5">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'text-text-main font-medium'
                            : 'text-text-main/40 hover:text-text-main/75'
                        }`}
                        style={{ background: isActive ? 'var(--hover-overlay-strong)' : undefined }}
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="text-[15px]">{link.name}</span>
                        <ChevronRight className={`w-4 h-4 transition-opacity duration-300 ${isActive ? 'opacity-50' : 'opacity-0'}`} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              <div className="h-px mx-4" style={{ background: 'var(--glass-border)' }} />
              <div className="p-4">
                {loggedIn ? (
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-center gap-2 py-3 text-[14px] font-medium text-white rounded-xl"
                    style={{ background: 'linear-gradient(to right, #5864F1, #7B61FF)' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 py-3 text-[14px] font-medium text-white rounded-xl"
                    style={{ background: 'linear-gradient(to right, #5864F1, #7B61FF)' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
