import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './database.js';

dotenv.config();

// ─── User Schema ───
const userSchema = new mongoose.Schema({
  _id: String, // Discord user ID
  username: { type: String, required: true },
  discriminator: { type: String, default: '0' },
  avatar: String,
  email: String,
  accessToken: String,
  refreshToken: String,
  premium: { type: Boolean, default: false },
  premiumUntil: Date,
}, { timestamps: true });

// ─── Guild Schema ───
const guildSchema = new mongoose.Schema({
  _id: String, // Discord guild ID
  name: { type: String, required: true },
  icon: String,
  ownerId: String,
  prefix: { type: String, default: '!' },
  language: { type: String, default: 'en' },
  welcomeEnabled: { type: Boolean, default: false },
  welcomeChannel: String,
  welcomeMessage: { type: String, default: 'Welcome to the server, {user}!' },
  goodbyeEnabled: { type: Boolean, default: false },
  goodbyeChannel: String,
  goodbyeMessage: { type: String, default: 'Goodbye, {user}!' },
  levelingEnabled: { type: Boolean, default: true },
  loggingEnabled: { type: Boolean, default: false },
  logChannel: String,
  automodEnabled: { type: Boolean, default: false },
  automodSpamFilter: { type: Boolean, default: false },
  automodLinkFilter: { type: Boolean, default: false },
  automodAntiRaid: { type: Boolean, default: false },
  warnMuteThreshold: { type: Number, default: 3 },
  warnKickThreshold: { type: Number, default: 5 },
  warnBanThreshold: { type: Number, default: 7 },
}, { timestamps: true });

// ─── Warning Schema ───
const warningSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  moderatorId: { type: String, required: true },
  reason: String,
}, { timestamps: true });

// ─── User Level Schema ───
const userLevelSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  messages: { type: Number, default: 0 },
  lastXpAt: { type: Date, default: Date.now },
}, { timestamps: true });
userLevelSchema.index({ guildId: 1, userId: 1 }, { unique: true });

// ─── Custom Command Schema ───
const customCommandSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  trigger: { type: String, required: true },
  response: { type: String, required: true },
  createdBy: String,
  uses: { type: Number, default: 0 },
}, { timestamps: true });
customCommandSchema.index({ guildId: 1, trigger: 1 }, { unique: true });

// ─── Mod Log Schema ───
const modLogSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  targetId: String,
  moderatorId: String,
  reason: String,
  details: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

// ─── Ticket Schema ───
const ticketSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  channelId: String,
  userId: { type: String, required: true },
  subject: String,
  status: { type: String, default: 'open' },
  closedAt: Date,
}, { timestamps: true });

// ─── Role Reward Schema ───
const roleRewardSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  roleId: { type: String, required: true },
  requiredLevel: { type: Number, required: true },
}, { timestamps: true });
roleRewardSchema.index({ guildId: 1, roleId: 1 }, { unique: true });

// ─── Export Models ───
export const User = mongoose.model('User', userSchema);
export const Guild = mongoose.model('Guild', guildSchema);
export const Warning = mongoose.model('Warning', warningSchema);
export const UserLevel = mongoose.model('UserLevel', userLevelSchema);
export const CustomCommand = mongoose.model('CustomCommand', customCommandSchema);
export const ModLog = mongoose.model('ModLog', modLogSchema);
export const Ticket = mongoose.model('Ticket', ticketSchema);
export const RoleReward = mongoose.model('RoleReward', roleRewardSchema);

// If run directly, connect and verify
const init = async () => {
  await connectDB();
  console.log('MongoDB models registered successfully!');
  process.exit(0);
};

init();
