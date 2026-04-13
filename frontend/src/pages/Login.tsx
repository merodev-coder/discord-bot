import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const DISCORD_INVITE = 'https://discord.com/oauth2/authorize?client_id=1492134945748029621&permissions=8&scope=bot%20applications.commands';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    // If already logged in, redirect to dashboard
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => { if (r.ok) return r.json(); throw new Error(); })
      .then(() => navigate('/dashboard'))
      .catch(() => {});
  }, [navigate]);

  const handleLogin = () => {
    window.location.href = '/api/auth/discord';
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Noise */}
      <div className="noise-overlay" />

      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04] pointer-events-none animate-breathe"
        style={{ background: 'radial-gradient(circle, rgba(88,100,241,0.4) 0%, transparent 70%)' }} />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-[0.025] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(159,167,255,0.4) 0%, transparent 70%)' }} />

      {/* Grid dots */}
      <div className="absolute inset-0 opacity-[0.012] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(rgba(159,167,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-2xl p-12 max-w-[400px] w-full text-center relative z-10"
      >
        {/* Ambient glow behind card */}
        <div className="absolute -inset-6 bg-primary/[0.03] rounded-3xl blur-3xl -z-10" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <img src="/bot-logo.png" alt="UltimateBot" className="w-16 h-16 rounded-2xl" />
            <div className="absolute -inset-2 bg-primary/[0.08] rounded-2xl blur-xl -z-10 animate-pulse-glow" />
          </div>
        </motion.div>

        <h1 className="font-display text-2xl font-bold tracking-tight mb-2">Welcome back</h1>
        <p className="text-[14px] text-text-main/35 mb-8 leading-[1.6]">
          Log in with Discord to access your server dashboard.
        </p>

        {error && (
          <div className="mb-6 bg-error/[0.08] border border-error/[0.15] text-error text-[13px] rounded-xl px-4 py-3 font-body">
            {error === 'no_code' ? 'Discord authorization was cancelled.' :
             error === 'token_failed' ? 'Failed to authenticate with Discord.' :
             'Something went wrong. Please try again.'}
          </div>
        )}

        {/* Discord Login */}
        <button
          onClick={handleLogin}
          className="discord-btn w-full flex items-center justify-center gap-2.5 text-white font-semibold text-[14px] py-3.5 rounded-pill cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          Continue with Discord
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <span className="text-[11px] text-text-main/20 uppercase tracking-[0.15em] font-ui">or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        {/* Add bot link */}
        <a
          href={DISCORD_INVITE}
          target="_blank"
          rel="noopener noreferrer"
          className="secondary-btn w-full block text-center text-[14px] font-medium text-text-main/50 py-3.5 rounded-pill hover:text-text-main/70 transition-all duration-300"
        >
          Add UltimateBot to your server
        </a>

        <p className="text-[11px] text-text-main/18 mt-10 leading-relaxed font-body">
          By continuing you agree to our{' '}
          <Link to="/" className="text-text-main/30 hover:text-text-main/50 underline transition-colors duration-300">Terms</Link> and{' '}
          <Link to="/" className="text-text-main/30 hover:text-text-main/50 underline transition-colors duration-300">Privacy Policy</Link>.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
