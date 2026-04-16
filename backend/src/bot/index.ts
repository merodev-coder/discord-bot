import { Client, GatewayIntentBits, Events, EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
import { Guild, UserLevel, RoleReward } from '../models/index.js';
import { handleBan } from './commands/ban.js';
import { handleKick } from './commands/kick.js';
import { handleMute } from './commands/mute.js';
import { handleWarn } from './commands/warn.js';
import { handleClear } from './commands/clear.js';
import { handleRank } from './commands/rank.js';
import { handleLeaderboard } from './commands/leaderboard.js';
import { handleHelp } from './commands/help.js';
import { handleServerinfo } from './commands/serverinfo.js';
import { handleUserinfo } from './commands/userinfo.js';
import { handle8ball } from './commands/8ball.js';
import { handleMeme } from './commands/meme.js';
import { handlePing } from './commands/ping.js';
import { handleAvatar } from './commands/avatar.js';
import { handlePoll } from './commands/poll.js';
import { handleTicket } from './commands/ticket.js';
import { handleProfile } from './commands/profile.js';
import { handleReminder } from './commands/reminder.js';
import { handleTranslate } from './commands/translate.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
  ],
});

// Bot command metadata — single source of truth used by API
export const BOT_COMMANDS = [
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
  { name: '/poll', description: 'Create an advanced poll with up to 5 options using button voting.', usage: '/poll [question] [opt1|opt2|...]', category: 'Fun' },
  { name: '/ticket', description: 'Spawns an embed with a "Create Ticket" button for support.', usage: '/ticket', category: 'Utility' },
  { name: '/profile', description: 'Generates a fancy embed with XP, roles, and join date with a progress bar.', usage: '/profile [@user]', category: 'Leveling' },
  { name: '/reminder', description: 'Sets a reminder for a specific duration and sends a DM when time is up.', usage: '/reminder [duration] [message]', category: 'Utility' },
  { name: '/translate', description: 'Translates text into a chosen language.', usage: '/translate [text] [language]', category: 'Utility' },
];

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Discord bot logged in as ${readyClient.user.tag}`);
  console.log(`Serving ${readyClient.guilds.cache.size} guilds`);
});

client.on(Events.GuildCreate, async (guild) => {
  try {
    await Guild.findByIdAndUpdate(
      guild.id,
      { _id: guild.id, name: guild.name, icon: guild.iconURL(), ownerId: guild.ownerId },
      { upsert: true, new: true }
    );
    console.log(`Joined guild: ${guild.name} (${guild.id})`);
  } catch (err) {
    console.error('Error saving guild:', err);
  }
});

client.on(Events.GuildDelete, async (guild) => {
  console.log(`Left guild: ${guild.name} (${guild.id})`);
});

// XP cooldown map (userId:guildId -> last XP timestamp)
const xpCooldowns = new Map<string, number>();
const XP_COOLDOWN_MS = 60_000; // 60 seconds between XP gains

// XP system on message
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.guild) return;

  try {
    const guildDoc = await Guild.findById(message.guild.id);
    if (!guildDoc || !guildDoc.levelingEnabled) return;

    // Check XP cooldown
    const cooldownKey = `${message.author.id}:${message.guild.id}`;
    const now = Date.now();
    const lastXp = xpCooldowns.get(cooldownKey) ?? 0;
    if (now - lastXp < XP_COOLDOWN_MS) {
      // Still on cooldown — only count the message, no XP
      await UserLevel.findOneAndUpdate(
        { guildId: message.guild.id, userId: message.author.id },
        { $inc: { messages: 1 } },
        { upsert: true }
      );
      return;
    }
    xpCooldowns.set(cooldownKey, now);

    const xpGain = Math.floor(Math.random() * 15) + 10; // 10-24 XP per message

    const userLevel = await UserLevel.findOneAndUpdate(
      { guildId: message.guild.id, userId: message.author.id },
      { $inc: { xp: xpGain, messages: 1 }, $set: { lastXpAt: new Date() } },
      { upsert: true, new: true }
    );

    const requiredXp = (userLevel.level + 1) * 100;

    if (userLevel.xp >= requiredXp) {
      const newLevel = userLevel.level + 1;
      await UserLevel.findOneAndUpdate(
        { guildId: message.guild.id, userId: message.author.id },
        { $set: { level: newLevel }, $inc: { xp: -requiredXp } }
      );

      // Level-up embed
      const remainingXp = userLevel.xp - requiredXp;
      const nextRequired = (newLevel + 1) * 100;
      const embed = new EmbedBuilder()
        .setColor(0x9FA7FF)
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
        .setDescription(`🎉 **Level Up!** You are now level **${newLevel}**!`)
        .addFields(
          { name: 'XP Progress', value: `${Math.max(0, remainingXp).toLocaleString()} / ${nextRequired.toLocaleString()}`, inline: true },
          { name: 'Messages', value: `${userLevel.messages.toLocaleString()}`, inline: true },
        )
        .setFooter({ text: 'Keep chatting to earn more XP!' })
        .setTimestamp();
      message.channel.send({ embeds: [embed] }).catch(() => {});

      // Auto-assign role rewards
      try {
        const rewards = await RoleReward.find({ guildId: message.guild.id, requiredLevel: { $lte: newLevel } });
        const member = message.member;
        if (member && rewards.length > 0) {
          for (const reward of rewards) {
            const role = message.guild.roles.cache.get(reward.roleId);
            if (role && !member.roles.cache.has(role.id)) {
              await member.roles.add(role).catch(() => {});
            }
          }
        }
      } catch {}
    }
  } catch (err) {
    // Silently fail for XP
  }
});

// Slash command handler
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    switch (commandName) {
      case 'ban': await handleBan(interaction); break;
      case 'kick': await handleKick(interaction); break;
      case 'mute': await handleMute(interaction); break;
      case 'warn': await handleWarn(interaction); break;
      case 'clear': await handleClear(interaction); break;
      case 'rank': await handleRank(interaction); break;
      case 'leaderboard': await handleLeaderboard(interaction); break;
      case 'help': await handleHelp(interaction); break;
      case 'serverinfo': await handleServerinfo(interaction); break;
      case 'userinfo': await handleUserinfo(interaction); break;
      case '8ball': await handle8ball(interaction); break;
      case 'meme': await handleMeme(interaction); break;
      case 'ping': await handlePing(interaction); break;
      case 'avatar': await handleAvatar(interaction); break;
      case 'poll': await handlePoll(interaction); break;
      case 'ticket': await handleTicket(interaction); break;
      case 'profile': await handleProfile(interaction); break;
      case 'reminder': await handleReminder(interaction); break;
      case 'translate': await handleTranslate(interaction); break;
      default:
        await interaction.reply({ content: 'Unknown command.', ephemeral: true });
    }
  } catch (error) {
    console.error(`Error handling command ${commandName}:`, error);
    const reply = { content: 'An error occurred while executing this command.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

export const startBot = () => {
  const token = process.env.DISCORD_TOKEN;
  if (!token || token === 'your_discord_bot_token_here') {
    console.warn('⚠️  No valid DISCORD_TOKEN found. Bot will not start.');
    return null;
  }
  client.login(token);
  return client;
};

export { client };
export default client;
