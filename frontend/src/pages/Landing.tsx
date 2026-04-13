import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Shield,
  TrendingUp,
  MessageSquare,
  Terminal,
  ScrollText,
  Ticket,
  Check,
  Sparkles,
  ArrowRight,
  Zap,
  Users,
  Hash,
  ChevronRight,
} from 'lucide-react';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const DISCORD_INVITE = 'https://discord.com/oauth2/authorize?client_id=1492134945748029621&permissions=8&scope=bot%20applications.commands';

const features = [
  { icon: Shield, title: 'Auto-Moderation', desc: 'Smart spam detection, raid protection, and toxic content filtering — keeping your server clean 24/7.' },
  { icon: TrendingUp, title: 'Leveling & XP', desc: 'Reward active members with XP, custom level roles, and a server-wide leaderboard.' },
  { icon: MessageSquare, title: 'Welcome System', desc: 'Greet new members with custom embeds, auto-roles, and personalized welcome cards.' },
  { icon: Terminal, title: 'Custom Commands', desc: 'Create unlimited custom responses and automations with a no-code command builder.' },
  { icon: ScrollText, title: 'Audit Logging', desc: 'Track every action — message edits, role changes, voice activity — with detailed logs.' },
  { icon: Ticket, title: 'Ticket System', desc: 'Streamlined support tickets with categories, transcripts, and staff assignment.' },
];

const AnimatedSection = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Landing = () => {
  const orbRef = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const [liveStats, setLiveStats] = useState({ guilds: 0, users: 0, commands: 15, ping: 0 });
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch('/api/stats').then(r => { if (r.ok) return r.json(); }).then(d => { if (d) setLiveStats(d); }).catch(() => {});
    const token = localStorage.getItem('token');
    const authHeaders: Record<string, string> = {};
    if (token) authHeaders['Authorization'] = `Bearer ${token}`;
    fetch('/api/auth/me', { credentials: 'include', headers: authHeaders }).then(r => { if (r.ok) setLoggedIn(true); }).catch(() => {});
    if (orbRef.current) {
      gsap.to(orbRef.current, { y: -40, x: 15, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }
    if (orb2Ref.current) {
      gsap.to(orb2Ref.current, { y: 25, x: -15, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }
    if (orb3Ref.current) {
      gsap.to(orb3Ref.current, { y: -20, x: 10, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }

    gsap.fromTo('.stat-card', { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.stats-section', start: 'top 85%' },
    });
    gsap.fromTo('.feature-card', { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.features-section', start: 'top 80%' },
    });
  }, []);

  return (
    <div className="relative">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* ─── HERO ─── */}
      <section className="min-h-screen relative overflow-hidden flex items-center">
        {/* Hero mesh gradient background */}
        <div className="absolute inset-0 bg-hero-mesh pointer-events-none" />

        {/* Ambient orbs */}
        <div ref={orbRef} className="absolute top-[10%] right-[5%] w-[700px] h-[700px] rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(88,100,241,0.6) 0%, transparent 60%)' }} />
        <div ref={orb2Ref} className="absolute bottom-[5%] left-[0%] w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(159,167,255,0.5) 0%, transparent 60%)' }} />
        <div ref={orb3Ref} className="absolute top-[50%] left-[40%] w-[300px] h-[300px] rounded-full opacity-[0.02] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(123,97,255,0.6) 0%, transparent 60%)' }} />

        {/* Grid dots pattern */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(rgba(159,167,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="max-w-[1200px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center pt-28 pb-20">
          {/* Left — Copy */}
          <div className="z-10">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 bg-primary/[0.08] border border-primary/[0.1] text-primary text-[12px] font-semibold tracking-wider uppercase px-5 py-2 rounded-pill mb-8 backdrop-blur-sm"
            >
              <div className="glow-pip-active" />
              Trusted by {liveStats.guilds > 0 ? liveStats.guilds.toLocaleString() + '+' : '...'} servers
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(2.8rem,5.5vw,5rem)] font-bold leading-[1.05] tracking-tight mb-7"
            >
              Your Discord
              <br />
              Server.{' '}
              <span className="text-gradient">Perfected.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-body text-[18px] leading-[1.7] text-text-main/45 max-w-[480px] mb-10"
            >
              The all-in-one Discord bot for moderation, leveling,
              welcome messages, custom commands, logging, and more — so you can
              build the community you've always envisioned.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4"
            >
              {loggedIn ? (
                <>
                  <Link to="/dashboard"
                    className="discord-btn inline-flex items-center gap-2.5 text-white font-semibold text-[14px] px-7 py-3.5 rounded-pill cursor-pointer">
                    Go to Dashboard
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer"
                    className="secondary-btn inline-flex items-center gap-2.5 text-text-main/70 hover:text-text-main text-[14px] font-medium px-7 py-3.5 rounded-pill transition-all duration-300 group">
                    Add to Server
                    <ChevronRight className="w-4 h-4 text-primary/60 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </a>
                </>
              ) : (
                <>
                  <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer"
                    className="discord-btn inline-flex items-center gap-2.5 text-white font-semibold text-[14px] px-7 py-3.5 rounded-pill cursor-pointer">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                    Add to Discord
                  </a>
                  <Link to="/login"
                    className="secondary-btn inline-flex items-center gap-2.5 text-text-main/70 hover:text-text-main text-[14px] font-medium px-7 py-3.5 rounded-pill transition-all duration-300 group">
                    Sign in
                    <ChevronRight className="w-4 h-4 text-primary/60 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Right — Bot Mockup Card */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: -8 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block relative"
            style={{ perspective: '1200px' }}
          >
            <div className="relative glass-card rounded-2xl p-7 shadow-[0_0_80px_rgba(88,100,241,0.06)]">
              {/* Fake dashboard header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-error/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                  <div className="w-3 h-3 rounded-full bg-green-500/30" />
                </div>
                <div className="flex-1 h-7 bg-white/[0.03] rounded-lg flex items-center px-3">
                  <div className="w-3 h-3 rounded-full bg-white/[0.06]" />
                  <div className="ml-2 h-2 w-24 rounded bg-white/[0.04]" />
                </div>
              </div>

              {/* Mock stats row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Members', val: '24,812', accent: 'primary-dim' },
                  { label: 'Online', val: '1,402', accent: 'green-500' },
                  { label: 'Commands', val: '12.5k', accent: 'purple-500' },
                ].map((s, i) => (
                  <div key={i} className="relative bg-white/[0.02] rounded-xl p-4 overflow-hidden group">
                    <div className={`absolute inset-0 bg-gradient-to-br from-${s.accent}/10 to-transparent opacity-60`} />
                    <div className="relative">
                      <div className="text-[10px] text-text-main/30 uppercase tracking-wider mb-1.5 font-ui">{s.label}</div>
                      <div className="font-display text-xl font-bold tracking-tight">{s.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mock activity feed */}
              <div className="space-y-1.5">
                {[
                  { user: 'Zephyr', action: 'used /rank', time: '2m ago', dot: 'bg-primary shadow-[0_0_6px_rgba(159,167,255,0.5)]' },
                  { user: 'Auto-Mod', action: 'deleted spam message', time: '5m ago', dot: 'bg-error shadow-[0_0_6px_rgba(215,51,87,0.5)]' },
                  { user: 'Nebula', action: 'updated settings', time: '12m ago', dot: 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]' },
                  { user: 'StarDust', action: 'created ticket #47', time: '18m ago', dot: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]' },
                ].map((a, i) => (
                  <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-300 ${i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'} hover:bg-white/[0.04]`}>
                    <div className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${a.dot}`} />
                    <span className="text-[13px] text-text-main/70 font-medium">{a.user}</span>
                    <span className="text-[13px] text-text-main/30">{a.action}</span>
                    <span className="ml-auto text-[11px] text-text-main/20 font-ui">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ambient glow behind card */}
            <div className="absolute -inset-8 bg-primary/[0.03] rounded-3xl blur-3xl -z-10 animate-breathe" />
            <div className="absolute -inset-16 bg-primary-dim/[0.02] rounded-full blur-[60px] -z-20" />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-8 rounded-pill border border-white/[0.1] flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-1.5 rounded-full bg-primary/50"
            />
          </div>
        </motion.div>
      </section>

      {/* ─── STATS ─── */}
      <section className="stats-section relative py-24 px-6">
        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: 'SERVERS', value: liveStats.guilds > 0 ? liveStats.guilds.toLocaleString() : '—', icon: Hash },
            { label: 'USERS SERVED', value: liveStats.users > 0 ? liveStats.users.toLocaleString() : '—', icon: Users },
            { label: 'BOT COMMANDS', value: liveStats.commands.toString(), icon: Zap },
          ].map((stat, i) => (
            <div key={i} className="stat-card group glass-card-hover rounded-2xl p-8 text-center cursor-default">
              <div className="w-10 h-10 rounded-xl bg-primary/[0.06] flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/[0.12] transition-colors duration-400">
                <stat.icon className="w-5 h-5 text-primary/50 group-hover:text-primary/80 transition-colors duration-400" />
              </div>
              <div className="font-display text-4xl md:text-[2.8rem] font-bold tracking-tight mb-2">{stat.value}</div>
              <div className="font-ui text-[11px] tracking-[0.2em] text-text-main/30 uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES PREVIEW ─── */}
      <section id="features" className="features-section relative py-28 md:py-36 px-6">
        {/* Background shift */}
        <div className="absolute inset-0 bg-[#0E0E15]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        <div className="max-w-[1100px] mx-auto relative z-10">
          <AnimatedSection className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/[0.06] border border-primary/[0.08] text-primary text-[11px] font-semibold tracking-[0.2em] uppercase px-4 py-2 rounded-pill mb-6">
              Everything you need
            </div>
            <h2 className="font-display text-4xl md:text-[3.5rem] font-bold tracking-tight mb-6 leading-tight">
              One bot. Every tool.
            </h2>
            <p className="font-body text-[17px] text-text-main/40 max-w-xl mx-auto leading-[1.7]">
              UltimateBot replaces a dozen bots with a single, reliable integration
              that works seamlessly across your entire Discord server.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <div key={i} className="feature-card glass-card-hover rounded-2xl p-8 cursor-default group">
                <div className="w-11 h-11 rounded-xl bg-primary/[0.07] flex items-center justify-center mb-6 group-hover:bg-primary/[0.14] group-hover:shadow-[0_0_20px_rgba(159,167,255,0.1)] transition-all duration-400">
                  <feat.icon className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors duration-400" />
                </div>
                <h3 className="font-display text-[17px] font-semibold mb-3 tracking-tight">{feat.title}</h3>
                <p className="font-body text-[14px] text-text-main/35 leading-[1.7] group-hover:text-text-main/50 transition-colors duration-400">{feat.desc}</p>
              </div>
            ))}
          </div>

          <AnimatedSection className="text-center mt-16">
            <Link to="/features"
              className="inline-flex items-center gap-2.5 text-primary text-[14px] font-semibold hover:gap-3.5 transition-all duration-300 group">
              See all features <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── PRICING PREVIEW ─── */}
      <section className="relative py-28 md:py-36 px-6">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        <div className="max-w-[900px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/[0.06] border border-primary/[0.08] text-primary text-[11px] font-semibold tracking-[0.2em] uppercase px-4 py-2 rounded-pill mb-6">
              Simple pricing
            </div>
            <h2 className="font-display text-4xl md:text-[3.5rem] font-bold tracking-tight mb-5 leading-tight">
              Free forever. Upgrade when ready.
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[740px] mx-auto">
            <AnimatedSection>
              <div className="glass-card rounded-2xl p-9 h-full">
                <div className="font-ui text-[11px] tracking-[0.15em] text-text-main/30 uppercase mb-3">Free</div>
                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="font-display text-[2.8rem] font-bold">$0</span>
                  <span className="text-[14px] text-text-main/30 font-body">/forever</span>
                </div>
                <div className="space-y-4 mb-10">
                  {['Auto-Moderation', '5 Custom Commands', 'XP & Leveling', 'Welcome Messages', 'Audit Logging'].map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-text-main/20 flex-shrink-0" />
                      <span className="text-[14px] text-text-main/50">{f}</span>
                    </div>
                  ))}
                </div>
                <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer"
                  className="secondary-btn block text-center text-[14px] font-semibold text-text-main/60 py-3.5 rounded-pill cursor-pointer hover:text-text-main transition-all duration-300">
                  Get Started Free
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="relative rounded-2xl p-9 h-full bg-[#1A1A24] overflow-hidden gradient-border">
                {/* Catch light */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                {/* Ambient glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/[0.06] rounded-full blur-[60px]" />
                <div className="absolute top-4 right-4 bg-primary/[0.12] text-primary text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-pill border border-primary/[0.1]">
                  Popular
                </div>
                <div className="font-ui text-[11px] tracking-[0.15em] text-primary/50 uppercase mb-3">Premium</div>
                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="font-display text-[2.8rem] font-bold text-gradient-static">$4.99</span>
                  <span className="text-[14px] text-text-main/30 font-body">/month</span>
                </div>
                <div className="space-y-4 mb-10">
                  {['Everything in Free', 'Unlimited Custom Commands', 'AI-Powered Auto-Mod', 'Priority Response Time', 'Advanced Analytics'].map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-primary/50 flex-shrink-0" />
                      <span className="text-[14px] text-text-main/55">{f}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full gradient-btn text-[14px] font-semibold text-white py-3.5 rounded-pill cursor-pointer">
                  Upgrade Now
                </button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden">
        <AnimatedSection className="max-w-[700px] mx-auto text-center relative z-10">
          <h2 className="font-display text-4xl md:text-[3.5rem] font-bold tracking-tight mb-7 leading-tight">
            Ready to level up
            <br />
            your server?
          </h2>
          <p className="font-body text-[18px] text-text-main/40 mb-12 leading-[1.7]">
            Join {liveStats.guilds > 0 ? liveStats.guilds.toLocaleString() + '+' : ''} communities already using UltimateBot.
            Setup takes less than 60 seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {loggedIn ? (
              <Link to="/dashboard"
                className="discord-btn inline-flex items-center gap-2.5 text-white font-semibold text-[15px] px-9 py-4 rounded-pill cursor-pointer">
                Open Dashboard &rarr;
              </Link>
            ) : (
              <>
                <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer"
                  className="discord-btn inline-flex items-center gap-2.5 text-white font-semibold text-[15px] px-9 py-4 rounded-pill cursor-pointer">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                  Add to Discord
                </a>
                <Link to="/login"
                  className="text-[15px] font-medium text-text-main/40 hover:text-text-main transition-colors duration-300 group">
                  or log in to your dashboard <span className="inline-block group-hover:translate-x-0.5 transition-transform duration-300">&rarr;</span>
                </Link>
              </>
            )}
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
