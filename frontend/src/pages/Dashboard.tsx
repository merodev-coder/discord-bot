import { useState, useEffect, useCallback } from 'react';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Shield,
  TrendingUp,
  Settings,
  ChevronDown,
  Sparkles,
  Users,
  Zap,
  Activity,
  LogOut,
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface UserInfo {
  id: string;
  username: string;
  avatar: string | null;
  premium: boolean;
}

interface GuildInfo {
  id: string;
  name: string;
  icon: string | null;
  botIn: boolean;
}

interface GuildStats {
  memberCount: number;
  totalWarnings: number;
  commandsToday: number;
  totalMessages: number;
  onlineCount: number;
}

interface GuildSettings {
  _id: string;
  name: string;
  prefix: string;
  language: string;
  welcomeEnabled: boolean;
  levelingEnabled: boolean;
  automodEnabled: boolean;
  automodSpamFilter: boolean;
  automodLinkFilter: boolean;
  automodAntiRaid: boolean;
  warnMuteThreshold: number;
  warnKickThreshold: number;
  warnBanThreshold: number;
  memberCount: number;
  channelCount: number;
  roleCount: number;
  icon: string | null;
}

interface ModLogEntry {
  _id: string;
  action: string;
  targetId?: string;
  moderatorId?: string;
  reason?: string;
  createdAt: string;
}

const sidebarItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Moderation', path: '/dashboard/moderation', icon: Shield },
  { name: 'Leveling', path: '/dashboard/leveling', icon: TrendingUp },
  { name: 'Automod', path: '/dashboard/automod', icon: Shield },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

const DISCORD_INVITE = 'https://discord.com/oauth2/authorize?client_id=1492134945748029621&permissions=8&scope=bot%20applications.commands';

const getToken = () => localStorage.getItem('token');

const apiFetch = (url: string, options: RequestInit = {}) => {
  const token = getToken();
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: { ...options.headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  }).then(r => { if (!r.ok) throw new Error(); return r.json(); });
};

const DashboardOverview = ({ guildId, guildSettings }: { guildId: string; guildSettings: GuildSettings | null }) => {
  const [stats, setStats] = useState<GuildStats | null>(null);
  const [modlogs, setModlogs] = useState<ModLogEntry[]>([]);

  useEffect(() => {
    if (!guildId) return;
    apiFetch(`/api/guild/${guildId}/stats`).then(setStats).catch(() => {});
    apiFetch(`/api/guild/${guildId}/modlogs`).then((d: ModLogEntry[]) => setModlogs(d.slice(0, 5))).catch(() => {});
  }, [guildId]);

  const statCards = [
    { label: 'TOTAL MEMBERS', value: stats?.memberCount?.toLocaleString() ?? '—', icon: Users },
    { label: 'TOTAL MESSAGES', value: stats?.totalMessages?.toLocaleString() ?? '—', icon: Activity },
    { label: 'MOD ACTIONS TODAY', value: stats?.commandsToday?.toString() ?? '—', icon: Zap },
  ];

  const dotForAction = (action: string) => {
    if (action === 'BAN') return 'bg-error shadow-[0_0_6px_rgba(215,51,87,0.5)]';
    if (action === 'KICK') return 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]';
    if (action === 'WARN') return 'bg-primary shadow-[0_0_6px_rgba(159,167,255,0.5)]';
    return 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]';
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card-hover rounded-2xl p-7 cursor-default group"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center group-hover:bg-white/[0.07] transition-colors duration-400">
                <stat.icon className="w-5 h-5 text-text-main/35 group-hover:text-text-main/55 transition-colors duration-400" />
              </div>
            </div>
            <div className="font-ui text-[10px] tracking-[0.2em] text-text-main/30 uppercase mb-1.5">
              {stat.label}
            </div>
            <div className="font-display text-[2rem] font-bold tracking-tight">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Mod Logs & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg font-semibold tracking-tight">Recent Mod Logs</h3>
          </div>
          <div className="glass-card rounded-2xl overflow-hidden">
            {modlogs.length === 0 ? (
              <div className="px-6 py-10 text-center text-text-main/25 font-body text-[14px]">No moderation logs yet.</div>
            ) : (
              <div className="space-y-0">
                {modlogs.map((log, i) => (
                  <motion.div
                    key={log._id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex items-center gap-4 px-6 py-4 transition-colors duration-300 hover:bg-white/[0.02] ${i % 2 === 0 ? 'bg-white/[0.01]' : 'bg-transparent'}`}
                  >
                    <div className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${dotForAction(log.action)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-[13px] truncate">
                        <span className="text-text-main/70 font-medium">{log.action}</span>
                        {log.targetId && <span className="text-text-main/35"> on {log.targetId.slice(0, 8)}…</span>}
                        {log.reason && <span className="text-text-main/25"> — {log.reason}</span>}
                      </p>
                    </div>
                    <span className="font-ui text-[11px] text-text-main/20 flex-shrink-0">{timeAgo(log.createdAt)}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Controls */}
        <div>
          <h3 className="font-display text-lg font-semibold mb-5 tracking-tight">Server Info</h3>
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-4">
              {guildSettings?.icon && <img src={guildSettings.icon} alt="" className="w-12 h-12 rounded-xl" />}
              <div>
                <div className="font-display text-[15px] font-semibold">{guildSettings?.name ?? '—'}</div>
                <div className="font-ui text-[12px] text-text-main/30">{guildSettings?.memberCount?.toLocaleString() ?? 0} members • {guildSettings?.channelCount ?? 0} channels</div>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              {[
                { label: 'Prefix', val: guildSettings?.prefix ?? '!' },
                { label: 'Language', val: guildSettings?.language ?? 'en' },
                { label: 'Roles', val: guildSettings?.roleCount?.toString() ?? '0' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="font-ui text-[12px] text-text-main/30">{item.label}</span>
                  <span className="font-body text-[13px] text-text-main/60">{item.val}</span>
                </div>
              ))}
            </div>

            <Link
              to="/dashboard/settings"
              className="secondary-btn block text-center font-ui text-[13px] font-semibold text-text-main/50 px-6 py-3 rounded-xl hover:text-text-main/80 transition-all duration-300 mt-4"
            >
              Edit Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Upgrade Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 relative overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dim/15 to-primary/8" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/[0.06] rounded-full blur-[40px]" />
        <div className="relative flex items-center justify-between p-7">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-primary/60" />
              <span className="font-ui text-[11px] tracking-[0.15em] text-primary/70 uppercase">Upgrade Now</span>
            </div>
            <p className="font-body text-[14px] text-text-main/50">
              Unlock advanced analytics, unlimited commands, and priority support.
            </p>
          </div>
          <button className="gradient-btn text-white font-ui text-[13px] font-semibold px-7 py-3 rounded-pill flex-shrink-0 cursor-pointer">
            Go Premium
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const QuickToggle = ({ name, desc, enabled: initial }: { name: string; desc: string; enabled: boolean }) => {
  const [enabled, setEnabled] = useState(initial);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="font-body text-[14px] font-semibold">{name}</div>
        <div className="font-ui text-[12px] text-text-main/30">{desc}</div>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`flex-shrink-0 relative w-10 h-[22px] rounded-full transition-all duration-400 cursor-pointer ${
          enabled ? 'bg-primary-dim shadow-[0_0_10px_rgba(88,100,241,0.3)]' : 'bg-white/[0.06]'
        }`}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className={`absolute top-[3px] w-4 h-4 rounded-full bg-white transition-shadow ${
            enabled ? 'left-[22px] shadow-[0_0_6px_rgba(159,167,255,0.4)]' : 'left-[3px]'
          }`}
        />
      </button>
    </div>
  );
};

const ModerationPage = ({ guildId, guildSettings }: { guildId: string; guildSettings: GuildSettings | null }) => {
  const [saving, setSaving] = useState(false);
  const [mute, setMute] = useState(guildSettings?.warnMuteThreshold?.toString() ?? '3');
  const [kick, setKick] = useState(guildSettings?.warnKickThreshold?.toString() ?? '5');
  const [ban, setBan] = useState(guildSettings?.warnBanThreshold?.toString() ?? '7');

  const saveThresholds = async () => {
    setSaving(true);
    try {
      await fetch(`/api/guild/${guildId}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ warnMuteThreshold: +mute, warnKickThreshold: +kick, warnBanThreshold: +ban }),
      });
    } catch {}
    setSaving(false);
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-7 tracking-tight">Moderation Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { name: 'Auto-Mod', desc: 'Automatically detect and remove harmful content', enabled: guildSettings?.automodEnabled ?? false },
          { name: 'Spam Filter', desc: 'Filter repeated messages and spam patterns', enabled: guildSettings?.automodSpamFilter ?? false },
          { name: 'Anti-Raid', desc: 'Detect and prevent coordinated join attacks', enabled: guildSettings?.automodAntiRaid ?? false },
          { name: 'Link Filter', desc: 'Block suspicious or unauthorized links', enabled: guildSettings?.automodLinkFilter ?? false },
        ].map((item, i) => (
          <div key={i} className="glass-card rounded-2xl p-6">
            <QuickToggle {...item} />
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="font-display text-lg font-semibold mb-5 tracking-tight">Warning Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Mute after warnings', value: mute, set: setMute },
            { label: 'Kick after warnings', value: kick, set: setKick },
            { label: 'Ban after warnings', value: ban, set: setBan },
          ].map((threshold, i) => (
            <div key={i} className="glass-card rounded-xl p-5">
              <label className="font-ui text-[10px] tracking-[0.2em] text-text-main/30 uppercase block mb-2.5">
                {threshold.label}
              </label>
              <input
                type="number"
                value={threshold.value}
                onChange={e => threshold.set(e.target.value)}
                className="glass-input w-full rounded-lg px-4 py-2.5 font-display text-lg text-text-main"
              />
            </div>
          ))}
        </div>
        <button onClick={saveThresholds} disabled={saving}
          className="gradient-btn text-white font-ui text-[13px] font-semibold px-7 py-3 rounded-pill mt-6 cursor-pointer disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Thresholds'}
        </button>
      </div>
    </div>
  );
};

interface RoleRewardEntry {
  _id: string;
  roleId: string;
  roleName: string;
  roleColor: string;
  requiredLevel: number;
}

const LevelingPage = ({ guildId }: { guildId: string }) => {
  const [leaderboard, setLeaderboard] = useState<{ userId: string; xp: number; level: number; messages: number }[]>([]);
  const [rewards, setRewards] = useState<RoleRewardEntry[]>([]);
  const [newRoleId, setNewRoleId] = useState('');
  const [newLevel, setNewLevel] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchRewards = () => {
    apiFetch(`/api/guild/${guildId}/rewards`).then(setRewards).catch(() => {});
  };

  useEffect(() => {
    if (!guildId) return;
    apiFetch(`/api/guild/${guildId}/leaderboard?limit=10`).then(setLeaderboard).catch(() => {});
    fetchRewards();
  }, [guildId]);

  const addReward = async () => {
    if (!newRoleId || !newLevel) return;
    setSaving(true);
    try {
      await fetch(`/api/guild/${guildId}/rewards`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId: newRoleId, requiredLevel: parseInt(newLevel) }),
      });
      setNewRoleId('');
      setNewLevel('');
      fetchRewards();
    } catch {}
    setSaving(false);
  };

  const deleteReward = async (rewardId: string) => {
    await fetch(`/api/guild/${guildId}/rewards/${rewardId}`, { method: 'DELETE', credentials: 'include' }).catch(() => {});
    fetchRewards();
  };

  const medals = ['bg-yellow-500/15 text-yellow-400', 'bg-gray-400/10 text-gray-300', 'bg-amber-700/10 text-amber-600'];

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-7 tracking-tight">Leveling & XP</h2>

      {/* Leaderboard */}
      <div className="glass-card rounded-2xl p-7 mb-8">
        <h3 className="font-display text-lg font-semibold mb-5 tracking-tight">Leaderboard</h3>
        {leaderboard.length === 0 ? (
          <div className="text-center py-10 text-text-main/25 font-body text-[14px]">No leaderboard data yet. Chat in Discord to earn XP!</div>
        ) : (
          <div className="space-y-1.5">
            {leaderboard.map((entry, i) => {
              const requiredXp = (entry.level + 1) * 100;
              const progress = Math.min((entry.xp / requiredXp) * 100, 100);
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-colors duration-300 hover:bg-white/[0.03] ${
                    i < 3 ? medals[i].split(' ')[0] : i % 2 === 0 ? 'bg-white/[0.015]' : 'bg-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-[13px] ${
                    i < 3 ? medals[i] : 'text-text-main/30'
                  }`}>
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-body text-[14px] font-medium truncate">{entry.userId}</div>
                    <div className="mt-1.5 h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary/60 to-[#7B61FF]/60 transition-all duration-500"
                        style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-ui text-[12px] text-text-main/30">Lvl {entry.level}</div>
                    <div className="font-ui text-[13px] text-primary/70">{entry.xp.toLocaleString()} XP</div>
                  </div>
                  <div className="font-ui text-[11px] text-text-main/20 flex-shrink-0 w-16 text-right">{entry.messages.toLocaleString()} msgs</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Role Rewards */}
      <div className="glass-card rounded-2xl p-7">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-semibold tracking-tight">Role Rewards</h3>
          <div className="font-ui text-[11px] text-text-main/25">{rewards.length} reward{rewards.length !== 1 ? 's' : ''}</div>
        </div>

        {rewards.length === 0 ? (
          <div className="text-center py-8 text-text-main/25 font-body text-[14px]">No role rewards configured yet.</div>
        ) : (
          <div className="space-y-2 mb-6">
            {rewards.map((reward) => (
              <div key={reward._id} className="flex items-center gap-4 px-5 py-4 bg-white/[0.015] rounded-xl group hover:bg-white/[0.03] transition-colors duration-300">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: reward.roleColor, boxShadow: `0 0 8px ${reward.roleColor}40` }} />
                <div className="flex-1 font-body text-[14px] font-medium">{reward.roleName}</div>
                <div className="font-ui text-[12px] text-text-main/30">Level {reward.requiredLevel}</div>
                <button
                  onClick={() => deleteReward(reward._id)}
                  className="opacity-0 group-hover:opacity-100 text-[11px] text-error/60 hover:text-error font-ui transition-all duration-300 px-2 py-1 rounded-lg hover:bg-error/10"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add reward form */}
        <div className="flex items-end gap-3 pt-4 border-t border-white/[0.04]">
          <div className="flex-1">
            <label className="block font-ui text-[11px] text-text-main/30 mb-1.5 uppercase tracking-wider">Role ID</label>
            <input
              type="text" value={newRoleId} onChange={e => setNewRoleId(e.target.value)}
              placeholder="e.g. 123456789012345678"
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-[13px] text-text-main placeholder:text-text-main/20 focus:outline-none focus:border-primary/30 transition-colors duration-300"
            />
          </div>
          <div className="w-28">
            <label className="block font-ui text-[11px] text-text-main/30 mb-1.5 uppercase tracking-wider">Level</label>
            <input
              type="number" min="1" value={newLevel} onChange={e => setNewLevel(e.target.value)}
              placeholder="5"
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-[13px] text-text-main placeholder:text-text-main/20 focus:outline-none focus:border-primary/30 transition-colors duration-300"
            />
          </div>
          <button
            onClick={addReward}
            disabled={saving || !newRoleId || !newLevel}
            className="px-5 py-2.5 rounded-lg bg-primary/20 text-primary text-[13px] font-semibold hover:bg-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            {saving ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsPage = ({ guildId, guildSettings, onRefresh }: { guildId: string; guildSettings: GuildSettings | null; onRefresh: () => void }) => {
  const [prefix, setPrefix] = useState(guildSettings?.prefix ?? '!');
  const [language, setLanguage] = useState(guildSettings?.language ?? 'en');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`/api/guild/${guildId}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefix, language }),
      });
      onRefresh();
    } catch {}
    setSaving(false);
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-7 tracking-tight">Server Settings</h2>
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-7">
          <h3 className="font-display text-lg font-semibold mb-5 tracking-tight">General</h3>
          <div className="space-y-5">
            <div>
              <label className="font-ui text-[10px] tracking-[0.2em] text-text-main/30 uppercase block mb-2.5">
                Bot Prefix
              </label>
              <input
                type="text"
                value={prefix}
                onChange={e => setPrefix(e.target.value)}
                className="glass-input w-full max-w-xs rounded-lg px-4 py-2.5 font-body text-sm text-text-main"
              />
            </div>
            <div>
              <label className="font-ui text-[10px] tracking-[0.2em] text-text-main/30 uppercase block mb-2.5">
                Language
              </label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="glass-input w-full max-w-xs rounded-lg px-4 py-2.5 font-body text-sm text-text-main appearance-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <button onClick={save} disabled={saving}
              className="gradient-btn text-white font-ui text-[13px] font-semibold px-7 py-3 rounded-pill cursor-pointer disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-7">
          <h3 className="font-display text-lg font-semibold mb-5 tracking-tight">Features</h3>
          <div className="space-y-5">
            {[
              { name: 'Welcome Messages', desc: 'Auto-greet new members', enabled: guildSettings?.welcomeEnabled ?? false },
              { name: 'Leveling System', desc: 'XP and level tracking', enabled: guildSettings?.levelingEnabled ?? true },
              { name: 'Logging', desc: 'Log moderation actions', enabled: guildSettings?.automodEnabled ?? false },
            ].map((item, i) => (
              <QuickToggle key={i} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [guilds, setGuilds] = useState<GuildInfo[]>([]);
  const [selectedGuildId, setSelectedGuildId] = useState<string>('');
  const [guildSettings, setGuildSettings] = useState<GuildSettings | null>(null);
  const [showGuildDropdown, setShowGuildDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  const selectedGuild = guilds.find(g => g.id === selectedGuildId);

  const fetchGuildSettings = useCallback((guildId: string) => {
    apiFetch(`/api/guild/${guildId}`).then(setGuildSettings).catch(() => {});
  }, []);

  useEffect(() => {
    // Grab token from URL (after OAuth redirect) and store it
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      // Clean URL
      window.history.replaceState({}, '', '/dashboard');
    }

    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/auth/me', { credentials: 'include', headers })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        setUser(data.user);
        const botGuilds = (data.guilds as GuildInfo[]).filter(g => g.botIn);
        setGuilds(data.guilds);
        if (botGuilds.length > 0) {
          setSelectedGuildId(botGuilds[0].id);
          fetchGuildSettings(botGuilds[0].id);
        }
        setLoading(false);
      })
      .catch(() => { navigate('/login'); });
  }, [navigate, fetchGuildSettings]);

  const handleSelectGuild = (guild: GuildInfo) => {
    setSelectedGuildId(guild.id);
    setShowGuildDropdown(false);
    if (guild.botIn) fetchGuildSettings(guild.id);
    else setGuildSettings(null);
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-main/30 font-body text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const botGuilds = guilds.filter(g => g.botIn);
  const otherGuilds = guilds.filter(g => !g.botIn);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#0B0B11] fixed left-0 top-0 bottom-0 flex flex-col z-40 border-r border-white/[0.03]">
        <div className="p-6">
          <Link to="/" className="font-display font-bold text-lg text-text-main flex items-center gap-2.5 group">
            <img src="/bot-logo.png" alt="UltimateBot" className="w-8 h-8 rounded-lg group-hover:scale-105 transition-transform duration-300" />
            UltimateBot
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {sidebarItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === '/dashboard' && location.pathname === '/dashboard/');
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 relative ${
                  isActive
                    ? 'bg-primary/[0.08] text-primary'
                    : 'text-text-main/40 hover:text-text-main/70 hover:bg-white/[0.03]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-primary shadow-[0_0_8px_rgba(159,167,255,0.5)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="w-[18px] h-[18px]" />
                <span className="font-ui text-[13px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/[0.03]">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/[0.1] flex items-center justify-center">
              <span className="text-primary text-[12px] font-bold">{user?.username?.charAt(0) ?? 'U'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-body text-[13px] font-medium truncate">{user?.username}</div>
              <div className="font-ui text-[10px] text-text-main/25">{user?.premium ? 'Premium' : 'Free Plan'}</div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-text-main/30 hover:text-error hover:bg-error/[0.06] transition-all duration-300 font-ui text-[12px] cursor-pointer">
            <LogOut className="w-3.5 h-3.5" /> Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-[240px]">
        {/* Top Header */}
        <header className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between bg-base/80 backdrop-blur-2xl border-b border-white/[0.03]">
          <div className="relative">
            <div className="font-ui text-[10px] tracking-[0.2em] text-text-main/25 uppercase mb-1">
              Current Server
            </div>
            <button
              onClick={() => setShowGuildDropdown(!showGuildDropdown)}
              className="flex items-center gap-2 font-display text-[17px] font-semibold hover:text-primary/90 transition-colors duration-300 cursor-pointer"
            >
              {selectedGuild?.name ?? 'Select a server'}
              <ChevronDown className={`w-4 h-4 text-text-main/30 transition-transform duration-300 ${showGuildDropdown ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showGuildDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full mt-2 left-0 bg-[#16161F] border border-white/[0.06] rounded-xl p-2 min-w-[260px] shadow-[0_12px_40px_rgba(0,0,0,0.6)] max-h-80 overflow-y-auto"
                >
                  {botGuilds.length > 0 && (
                    <div className="px-3 py-1.5 font-ui text-[10px] tracking-[0.15em] text-text-main/20 uppercase">Bot Active</div>
                  )}
                  {botGuilds.map((guild) => (
                    <button
                      key={guild.id}
                      onClick={() => handleSelectGuild(guild)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg font-body text-[14px] flex items-center gap-3 transition-all duration-300 cursor-pointer ${
                        selectedGuildId === guild.id ? 'bg-primary/[0.08] text-primary' : 'text-text-main/60 hover:bg-white/[0.04] hover:text-text-main'
                      }`}
                    >
                      {guild.icon ? <img src={guild.icon} alt="" className="w-6 h-6 rounded-md" /> : <div className="w-6 h-6 rounded-md bg-white/[0.05] flex items-center justify-center text-[10px] font-bold text-text-main/30">{guild.name.charAt(0)}</div>}
                      <span className="truncate">{guild.name}</span>
                    </button>
                  ))}
                  {otherGuilds.length > 0 && (
                    <>
                      <div className="px-3 py-1.5 mt-2 font-ui text-[10px] tracking-[0.15em] text-text-main/20 uppercase">Add Bot</div>
                      {otherGuilds.slice(0, 5).map((guild) => (
                        <a
                          key={guild.id}
                          href={DISCORD_INVITE}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full text-left px-4 py-2.5 rounded-lg font-body text-[14px] flex items-center gap-3 text-text-main/30 hover:bg-white/[0.03] hover:text-text-main/50 transition-all duration-300"
                        >
                          {guild.icon ? <img src={guild.icon} alt="" className="w-6 h-6 rounded-md opacity-50" /> : <div className="w-6 h-6 rounded-md bg-white/[0.03] flex items-center justify-center text-[10px] font-bold text-text-main/15">{guild.name.charAt(0)}</div>}
                          <span className="truncate flex-1">{guild.name}</span>
                          <ExternalLink className="w-3 h-3 text-text-main/15" />
                        </a>
                      ))}
                    </>
                  )}

                  {/* Add to another server button */}
                  <div className="mt-2 pt-2 border-t border-white/[0.06]">
                    <a
                      href={DISCORD_INVITE}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-ui text-[12px] font-semibold text-primary/70 hover:text-primary hover:bg-primary/[0.06] transition-all duration-300"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Add Bot to a Server
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300"
              style={{ background: 'var(--pill-bg)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-text-main/50" /> : <Moon className="w-4 h-4 text-text-main/50" />}
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] text-text-main/50 hover:text-text-main/80 transition-all duration-300 font-ui text-[13px]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
              Home
            </Link>
            <div className="w-9 h-9 rounded-xl bg-primary/[0.1] flex items-center justify-center cursor-pointer hover:bg-primary/[0.15] transition-colors duration-300">
              {user?.avatar ? (
                <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`} alt="" className="w-full h-full rounded-xl object-cover" />
              ) : (
                <span className="text-primary text-[13px] font-bold">{user?.username?.charAt(0) ?? 'U'}</span>
              )}
            </div>
          </div>
        </header>

        {/* No guild selected / bot not in guild */}
        {(!selectedGuild || !selectedGuild.botIn) ? (
          <main className="p-8 text-center">
            <div className="max-w-md mx-auto pt-20">
              <h2 className="font-display text-2xl font-bold mb-4 tracking-tight">
                {guilds.length === 0 ? 'No servers found' : 'Add UltimateBot to a server'}
              </h2>
              <p className="font-body text-[15px] text-text-main/40 mb-8">
                {guilds.length === 0
                  ? 'You don\'t manage any Discord servers, or we couldn\'t fetch your server list.'
                  : 'Select a server where the bot is active, or add it to one of your servers.'}
              </p>
              <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer"
                className="discord-btn inline-flex items-center gap-2.5 text-white font-semibold text-[14px] px-7 py-3.5 rounded-pill">
                <ExternalLink className="w-4 h-4" /> Add to Discord
              </a>
            </div>
          </main>
        ) : (
          <main className="p-8">
            <Routes>
              <Route path="/" element={<DashboardOverview guildId={selectedGuildId} guildSettings={guildSettings} />} />
              <Route path="/moderation" element={<ModerationPage guildId={selectedGuildId} guildSettings={guildSettings} />} />
              <Route path="/leveling" element={<LevelingPage guildId={selectedGuildId} />} />
              <Route path="/automod" element={<ModerationPage guildId={selectedGuildId} guildSettings={guildSettings} />} />
              <Route path="/settings" element={<SettingsPage guildId={selectedGuildId} guildSettings={guildSettings} onRefresh={() => fetchGuildSettings(selectedGuildId)} />} />
            </Routes>
          </main>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
