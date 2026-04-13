import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { User, Guild, CustomCommand, UserLevel, Warning, ModLog, RoleReward } from '../models/index.js';
import client, { BOT_COMMANDS } from '../bot/index.js';

const router = Router();

// ─── Public: Bot slash commands list (from bot metadata) ───
router.get('/bot/commands', (_req: AuthRequest, res: Response) => {
  res.json(BOT_COMMANDS);
});

// ─── Public: Live stats from Discord client + DB ───
router.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const botGuilds = client.guilds?.cache?.size ?? 0;
    let totalMembers = 0;
    client.guilds?.cache?.forEach(g => { totalMembers += g.memberCount; });
    const commandsCount = BOT_COMMANDS.length;

    res.json({
      guilds: botGuilds,
      users: totalMembers,
      commands: commandsCount,
      uptime: client.uptime ?? 0,
      ping: client.ws?.ping ?? 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ─── Auth: Guild details (from DB, enriched with live Discord data) ───
router.get('/guild/:guildId', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { guildId } = req.params;
  try {
    let guild = await Guild.findById(guildId);

    // Try to get live data from bot
    const liveGuild = client.guilds?.cache?.get(guildId);
    const memberCount = liveGuild?.memberCount ?? 0;
    const channelCount = liveGuild?.channels?.cache?.size ?? 0;
    const roleCount = liveGuild?.roles?.cache?.size ?? 0;
    const icon = liveGuild?.iconURL({ size: 128 }) ?? guild?.icon ?? null;

    // Auto-create guild doc if bot is in it but DB doesn't have it
    if (!guild && liveGuild) {
      guild = await Guild.create({
        _id: guildId,
        name: liveGuild.name,
        icon,
        ownerId: liveGuild.ownerId,
      });
    }

    if (!guild) return res.status(404).json({ error: 'Guild not found' });

    res.json({
      ...guild.toObject(),
      memberCount,
      channelCount,
      roleCount,
      icon,
    });
  } catch (error) {
    console.error('Error fetching guild:', error);
    res.status(500).json({ error: 'Failed to fetch guild' });
  }
});

// ─── Auth: Update guild settings ───
router.put('/guild/:guildId', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { guildId } = req.params;
  const updates = req.body;

  const allowedFields = [
    'prefix', 'language', 'welcomeEnabled', 'welcomeChannel', 'welcomeMessage',
    'goodbyeEnabled', 'goodbyeChannel', 'goodbyeMessage', 'levelingEnabled',
    'loggingEnabled', 'logChannel', 'automodEnabled', 'automodSpamFilter',
    'automodLinkFilter', 'automodAntiRaid', 'warnMuteThreshold',
    'warnKickThreshold', 'warnBanThreshold',
  ];

  const filteredUpdates: Record<string, any> = {};
  for (const key of Object.keys(updates)) {
    if (allowedFields.includes(key)) {
      filteredUpdates[key] = updates[key];
    }
  }

  if (Object.keys(filteredUpdates).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  try {
    const updated = await Guild.findByIdAndUpdate(guildId, filteredUpdates, { new: true });
    res.json(updated);
  } catch (error) {
    console.error('Error updating guild:', error);
    res.status(500).json({ error: 'Failed to update guild' });
  }
});

// ─── Auth: Guild live stats (member count, commands today, etc.) ───
router.get('/guild/:guildId/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { guildId } = req.params;
  try {
    const liveGuild = client.guilds?.cache?.get(guildId);
    const memberCount = liveGuild?.memberCount ?? 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalWarnings, todayModLogs, totalMessages] = await Promise.all([
      Warning.countDocuments({ guildId }),
      ModLog.countDocuments({ guildId, createdAt: { $gte: today } }),
      UserLevel.aggregate([
        { $match: { guildId } },
        { $group: { _id: null, total: { $sum: '$messages' } } },
      ]),
    ]);

    res.json({
      memberCount,
      totalWarnings,
      commandsToday: todayModLogs,
      totalMessages: totalMessages[0]?.total ?? 0,
      onlineCount: liveGuild?.members?.cache?.filter(m => m.presence?.status !== 'offline').size ?? 0,
    });
  } catch (error) {
    console.error('Error fetching guild stats:', error);
    res.status(500).json({ error: 'Failed to fetch guild stats' });
  }
});

// ─── Public: Leaderboard ───
router.get('/guild/:guildId/leaderboard', async (req: AuthRequest, res: Response) => {
  const { guildId } = req.params;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

  try {
    const leaderboard = await UserLevel.find({ guildId })
      .sort({ level: -1, xp: -1 })
      .limit(limit)
      .select('userId xp level messages');
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// ─── Auth: Warnings ───
router.get('/guild/:guildId/warnings', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { guildId } = req.params;
  try {
    const warnings = await Warning.find({ guildId }).sort({ createdAt: -1 }).limit(50);
    res.json(warnings);
  } catch (error) {
    console.error('Error fetching warnings:', error);
    res.status(500).json({ error: 'Failed to fetch warnings' });
  }
});

// ─── Auth: Mod logs ───
router.get('/guild/:guildId/modlogs', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { guildId } = req.params;
  try {
    const logs = await ModLog.find({ guildId }).sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching mod logs:', error);
    res.status(500).json({ error: 'Failed to fetch mod logs' });
  }
});

// ─── Auth: Role Rewards ───
router.get('/guild/:guildId/rewards', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const rewards = await RoleReward.find({ guildId: req.params.guildId }).sort({ requiredLevel: 1 });

    // Enrich with role name/color from Discord
    const liveGuild = client.guilds?.cache?.get(req.params.guildId);
    const enriched = rewards.map((r: any) => {
      const role = liveGuild?.roles?.cache?.get(r.roleId);
      return {
        _id: r._id,
        roleId: r.roleId,
        roleName: role?.name ?? 'Unknown Role',
        roleColor: role?.hexColor ?? '#6B7280',
        requiredLevel: r.requiredLevel,
      };
    });
    res.json(enriched);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ error: 'Failed to fetch role rewards' });
  }
});

router.post('/guild/:guildId/rewards', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { roleId, requiredLevel } = req.body;
  if (!roleId || requiredLevel == null) return res.status(400).json({ error: 'roleId and requiredLevel required' });

  try {
    const reward = await RoleReward.findOneAndUpdate(
      { guildId: req.params.guildId, roleId },
      { guildId: req.params.guildId, roleId, requiredLevel },
      { upsert: true, new: true }
    );
    res.json(reward);
  } catch (error) {
    console.error('Error creating reward:', error);
    res.status(500).json({ error: 'Failed to create role reward' });
  }
});

router.delete('/guild/:guildId/rewards/:rewardId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await RoleReward.findByIdAndDelete(req.params.rewardId);
    res.json({ message: 'Reward deleted' });
  } catch (error) {
    console.error('Error deleting reward:', error);
    res.status(500).json({ error: 'Failed to delete role reward' });
  }
});

export default router;
