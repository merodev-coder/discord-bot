import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, BarChart3, Zap } from 'lucide-react';
import Footer from '../components/Footer';

interface BotCommand {
  name: string;
  description: string;
  usage: string;
  category: string;
}

const Commands = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [commands, setCommands] = useState<BotCommand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bot/commands')
      .then(r => { if (r.ok) return r.json(); throw new Error('Failed'); })
      .then((data: BotCommand[]) => { setCommands(data); setLoading(false); })
      .catch(() => {
        // Fallback: show commands from static list if API is down
        setCommands([
          { name: '/ban', description: 'Ban a user from the server and log it.', usage: '/ban @user [reason]', category: 'Moderation' },
          { name: '/kick', description: 'Kick a user from the server. They can rejoin with a new invite.', usage: '/kick @user [reason]', category: 'Moderation' },
          { name: '/mute', description: 'Timeout a member for a specified duration.', usage: '/mute @user [duration] [reason]', category: 'Moderation' },
          { name: '/warn', description: 'Issue a formal warning to a user and log it.', usage: '/warn @user [reason]', category: 'Moderation' },
          { name: '/clear', description: 'Bulk delete messages from the current channel.', usage: '/clear [amount]', category: 'Moderation' },
          { name: '/rank', description: 'View your or another user\'s XP rank and progress.', usage: '/rank [@user]', category: 'Leveling' },
          { name: '/leaderboard', description: 'View the server XP leaderboard.', usage: '/leaderboard', category: 'Leveling' },
          { name: '/help', description: 'Display all available bot commands.', usage: '/help', category: 'General' },
          { name: '/serverinfo', description: 'View detailed server information.', usage: '/serverinfo', category: 'General' },
          { name: '/userinfo', description: 'View detailed information about a user.', usage: '/userinfo [@user]', category: 'General' },
          { name: '/8ball', description: 'Ask the magic 8-ball a yes or no question.', usage: '/8ball [question]', category: 'Fun' },
          { name: '/meme', description: 'Fetch a random meme to share with the server.', usage: '/meme', category: 'Fun' },
          { name: '/ping', description: 'Check the bot and Discord API latency.', usage: '/ping', category: 'General' },
          { name: '/avatar', description: 'View a user\'s avatar in full resolution.', usage: '/avatar [@user]', category: 'General' },
          { name: '/poll', description: 'Create a poll with up to 5 options.', usage: '/poll [question] [opt1|opt2|...]', category: 'Fun' },
        ]);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...Array.from(new Set(commands.map(c => c.category)))];

  const filtered = commands.filter((cmd) => {
    const matchesSearch =
      cmd.name.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || cmd.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen">
      <div className="noise-overlay" />

      <div className="pt-32 px-6">
        <div className="max-w-[1100px] mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14"
          >
            <div className="inline-flex items-center gap-2.5 bg-primary/[0.08] border border-primary/[0.1] text-primary text-[11px] font-semibold tracking-[0.2em] uppercase px-5 py-2 rounded-pill mb-7 backdrop-blur-sm">
              <div className="glow-pip-active" />
              Commands
            </div>
            <h1 className="font-display text-[clamp(2.4rem,5vw,3.8rem)] font-bold tracking-tight leading-[1.1] mb-5">
              Command <span className="text-gradient">Arsenal</span>
            </h1>
            <p className="font-body text-[17px] text-text-main/40 max-w-lg leading-[1.7]">
              Browse our comprehensive list of interactions. From complex
              moderation to cinematic audio controls.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
          >
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/25" />
              <input
                type="text"
                placeholder="Search commands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-input w-full rounded-xl pl-11 pr-4 py-3 font-body text-sm text-text-main placeholder:text-text-main/25"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-ui text-[12px] px-4 py-2 rounded-pill transition-all duration-300 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-primary-dim text-white shadow-glow-sm'
                      : 'bg-white/[0.03] text-text-main/40 hover:text-text-main/70 hover:bg-white/[0.06] border border-white/[0.04]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Command Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 mb-2">
            <div className="col-span-3 font-ui text-[11px] tracking-[0.15em] text-text-main/25 uppercase">
              Command
            </div>
            <div className="col-span-6 font-ui text-[11px] tracking-[0.15em] text-text-main/25 uppercase">
              Description
            </div>
            <div className="col-span-3 font-ui text-[11px] tracking-[0.15em] text-text-main/25 uppercase text-right">
              Usage
            </div>
          </div>

          {/* Command Rows */}
          <div className="space-y-1.5">
            {filtered.map((cmd, i) => (
              <motion.div
                key={cmd.name}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.025, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 rounded-xl transition-colors duration-300 hover:bg-white/[0.03] ${
                  i % 2 === 0 ? 'bg-white/[0.015]' : 'bg-transparent'
                }`}
              >
                <div className="col-span-3 flex items-center gap-3">
                  <div
                    className="w-[6px] h-[6px] rounded-full flex-shrink-0 bg-primary shadow-[0_0_8px_rgba(159,167,255,0.5)]"
                  />
                  <span className="font-display text-[15px] font-semibold tracking-tight">
                    {cmd.name}
                  </span>
                  <span className="text-[10px] font-ui bg-white/[0.04] text-text-main/30 px-2.5 py-0.5 rounded-pill">
                    {cmd.category}
                  </span>
                </div>
                <div className="col-span-6 font-body text-[13px] text-text-main/40 leading-relaxed">
                  {cmd.description}
                </div>
                <div className="col-span-3 text-right">
                  <span className="inline-block bg-white/[0.03] border border-white/[0.04] font-mono text-[12px] text-primary/60 px-3 py-1.5 rounded-lg">
                    {cmd.usage}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {loading && (
            <div className="text-center py-24 font-body text-text-main/25">
              Loading commands...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-24 font-body text-text-main/25">
              No commands found matching your search.
            </div>
          )}

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-24">
            {[
              { icon: Shield, title: 'Auto-Moderation', desc: 'Configure intelligent filters that learn from your community\'s unique behavior patterns.' },
              { icon: Zap, title: '15 Slash Commands', desc: 'Moderation, leveling, fun, and utility — everything you need in one bot.' },
              { icon: BarChart3, title: 'Growth Analytics', desc: 'Deep-dive into your server\'s engagement metrics with automated weekly visual reports.' },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card-hover rounded-2xl p-8 cursor-default group"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/[0.07] flex items-center justify-center mb-6 group-hover:bg-primary/[0.14] group-hover:shadow-[0_0_20px_rgba(159,167,255,0.1)] transition-all duration-400">
                  <card.icon className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors duration-400" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-3 tracking-tight">
                  {card.title}
                </h3>
                <p className="font-body text-[14px] text-text-main/35 leading-[1.7] group-hover:text-text-main/50 transition-colors duration-400">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Commands;
