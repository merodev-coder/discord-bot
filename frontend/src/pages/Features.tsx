import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  TrendingUp,
  MessageSquare,
  Terminal,
  ScrollText,
  Ticket,
  Music,
  Zap,
  ArrowRight,
  Lock,
  BarChart3,
  UserPlus,
  Gamepad2,
  Bell,
  Globe,
} from 'lucide-react';
import Footer from '../components/Footer';

const DISCORD_INVITE = 'https://discord.com/oauth2/authorize?client_id=1492134945748029621&permissions=8&scope=bot%20applications.commands';

const AnimatedSection = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}>
      {children}
    </motion.div>
  );
};

const coreFeatures = [
  {
    icon: Shield,
    title: 'Auto-Moderation',
    desc: 'Protect your server around the clock with intelligent spam detection, anti-raid systems, link filtering, and toxic content removal. Configure warning thresholds that automatically escalate to mutes, kicks, or bans.',
    highlights: ['Smart spam detection', 'Anti-raid protection', 'Link & invite filtering', 'Configurable warn thresholds'],
  },
  {
    icon: TrendingUp,
    title: 'Leveling & XP',
    desc: 'Gamify your server with an XP system that rewards active members. Members earn XP from chatting, with customizable level-up roles, a full leaderboard, and rank cards viewable via /rank.',
    highlights: ['Auto XP from messages', 'Custom role rewards per level', 'Server leaderboard', '/rank command with progress bars'],
  },
  {
    icon: MessageSquare,
    title: 'Welcome & Goodbye',
    desc: 'Make a great first impression with fully customizable welcome and goodbye messages. Use rich embeds with dynamic variables like {user}, {server}, and {memberCount}.',
    highlights: ['Custom embed messages', 'Dynamic variables', 'Auto-role on join', 'Channel selection'],
  },
  {
    icon: Terminal,
    title: 'Custom Commands',
    desc: 'Create unlimited custom bot commands without writing any code. Build complex responses with embeds, variables, and conditional logic through a simple interface.',
    highlights: ['No-code command builder', 'Rich embed responses', 'Usage tracking', 'Permissions per command'],
  },
  {
    icon: ScrollText,
    title: 'Audit Logging',
    desc: 'Never miss a thing. Track message edits, deletions, role changes, member joins/leaves, voice channel activity, and moderation actions — all logged to a channel of your choice.',
    highlights: ['Message edit/delete logs', 'Member join/leave tracking', 'Voice activity logging', 'Moderation action logs'],
  },
  {
    icon: Ticket,
    title: 'Ticket System',
    desc: 'Streamline your support workflow with a full ticket system. Members create tickets with categories, staff get assigned, and transcripts are saved when tickets are closed.',
    highlights: ['Category-based tickets', 'Staff assignment', 'Automatic transcripts', 'Open/closed status tracking'],
  },
];

const additionalFeatures = [
  { icon: Music, title: 'Music Playback', desc: 'High-quality music streaming with queue management and search.' },
  { icon: Gamepad2, title: 'Fun Commands', desc: '8-ball, memes, trivia, and more to keep things entertaining.' },
  { icon: UserPlus, title: 'Auto-Roles', desc: 'Automatically assign roles when members join your server.' },
  { icon: BarChart3, title: 'Server Analytics', desc: 'Track growth, activity patterns, and command usage over time.' },
  { icon: Lock, title: 'Permission System', desc: 'Fine-grained control over who can use which commands.' },
  { icon: Bell, title: 'Notifications', desc: 'Get alerts for moderation events, milestones, and more.' },
  { icon: Globe, title: 'Multi-Language', desc: 'Support for English, Spanish, French, German, and more.' },
  { icon: Zap, title: 'Slash Commands', desc: 'Modern Discord slash commands with auto-complete and validation.' },
];

const Features = () => {
  return (
    <div className="relative">
      {/* Noise */}
      <div className="noise-overlay" />

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-24 overflow-hidden">
        {/* Ambient orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.03] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(88,100,241,0.4) 0%, transparent 70%)' }} />

        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 bg-primary/[0.08] border border-primary/[0.1] text-primary text-[11px] font-semibold tracking-[0.2em] uppercase px-5 py-2 rounded-pill mb-7 backdrop-blur-sm"
          >
            <div className="glow-pip-active" />
            Features
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(2.4rem,5vw,3.8rem)] font-bold tracking-tight leading-[1.1] mb-6"
          >
            Everything your server needs.
            <br />
            <span className="text-gradient">Nothing it doesn't.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-[17px] text-text-main/40 leading-[1.7] max-w-2xl mx-auto"
          >
            UltimateBot combines moderation, engagement, and utility into one powerful bot
            that's easy to set up and simple to manage from a beautiful web dashboard.
          </motion.p>
        </div>
      </section>

      {/* Core Features — detailed */}
      <section className="px-6 pb-28">
        <div className="max-w-[1100px] mx-auto space-y-6">
          {coreFeatures.map((feat, i) => (
            <AnimatedSection key={i}>
              <div className={`glass-card rounded-2xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-8 md:p-12`}>
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="w-12 h-12 rounded-xl bg-primary/[0.07] flex items-center justify-center mb-6 group">
                    <feat.icon className="w-6 h-6 text-primary/80" />
                  </div>
                  <h3 className="font-display text-2xl font-bold tracking-tight mb-4">{feat.title}</h3>
                  <p className="font-body text-[15px] text-text-main/40 leading-[1.7] mb-7">{feat.desc}</p>
                  <div className="grid grid-cols-2 gap-3.5">
                    {feat.highlights.map((h, j) => (
                      <div key={j} className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50 shadow-[0_0_4px_rgba(159,167,255,0.4)]" />
                        <span className="text-[13px] text-text-main/50">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  {/* Feature visual — abstract mockup */}
                  <div className="relative bg-[#0C0C12] rounded-xl p-6 border border-white/[0.04] overflow-hidden">
                    {/* Catch light */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-xl bg-primary/[0.08] flex items-center justify-center">
                        <feat.icon className="w-4.5 h-4.5 text-primary/70" />
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold">{feat.title}</div>
                        <div className="text-[11px] text-text-main/25 font-ui">Enabled</div>
                      </div>
                      <div className="ml-auto w-10 h-[22px] bg-primary/20 rounded-full flex items-center justify-end px-0.5">
                        <div className="w-[18px] h-[18px] bg-primary rounded-full shadow-[0_0_10px_rgba(159,167,255,0.5)]" />
                      </div>
                    </div>
                    {/* Mock settings rows */}
                    {[1, 2, 3].map((_, j) => (
                      <div key={j} className={`flex items-center justify-between py-3.5 ${j > 0 ? '' : ''}`}
                        style={j > 0 ? { borderTop: '1px solid rgba(255,255,255,0.02)' } : {}}>
                        <div className="flex items-center gap-3">
                          <div className="w-[6px] h-[6px] rounded-full bg-green-400/40 shadow-[0_0_4px_rgba(74,222,128,0.3)]" />
                          <div className="h-3 rounded bg-white/[0.05]" style={{ width: `${80 + j * 25}px` }} />
                        </div>
                        <div className="h-3 w-14 rounded bg-white/[0.03]" />
                      </div>
                    ))}
                    {/* Subtle ambient glow */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/[0.04] rounded-full blur-[40px]" />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Additional features grid */}
      <section className="relative py-28 px-6">
        <div className="absolute inset-0 bg-[#0E0E15]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

        <div className="max-w-[1100px] mx-auto relative z-10">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-[2.8rem] font-bold tracking-tight mb-5">And so much more</h2>
            <p className="font-body text-[16px] text-text-main/35 leading-[1.7]">Every tool you need, built into one bot.</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {additionalFeatures.map((feat, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div className="glass-card-hover rounded-xl p-7 h-full cursor-default group">
                  <div className="w-9 h-9 rounded-lg bg-primary/[0.06] flex items-center justify-center mb-5 group-hover:bg-primary/[0.12] transition-colors duration-400">
                    <feat.icon className="w-4.5 h-4.5 text-primary/50 group-hover:text-primary/80 transition-colors duration-400" />
                  </div>
                  <h4 className="font-display text-[15px] font-semibold mb-2.5 tracking-tight">{feat.title}</h4>
                  <p className="text-[13px] text-text-main/30 leading-[1.7] group-hover:text-text-main/45 transition-colors duration-400">{feat.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.025] pointer-events-none animate-breathe"
          style={{ background: 'radial-gradient(circle, rgba(88,100,241,0.4) 0%, transparent 70%)' }} />

        <AnimatedSection className="max-w-[600px] mx-auto text-center relative z-10">
          <h2 className="font-display text-3xl md:text-[2.8rem] font-bold tracking-tight mb-6 leading-tight">
            Ready to get started?
          </h2>
          <p className="font-body text-[17px] text-text-main/35 mb-12 leading-[1.7]">
            Add UltimateBot to your server in seconds. No credit card required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer"
              className="discord-btn inline-flex items-center gap-2.5 text-white font-semibold text-[14px] px-8 py-3.5 rounded-pill cursor-pointer">
              Add to Discord
            </a>
            <Link to="/commands"
              className="inline-flex items-center gap-2.5 text-text-main/45 hover:text-text-main text-[14px] font-medium transition-all duration-300 group">
              Browse commands <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
