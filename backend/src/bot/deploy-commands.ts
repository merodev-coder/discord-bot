import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const commands = [
  new SlashCommandBuilder().setName('ban').setDescription('Ban a user from the server')
    .addUserOption(o => o.setName('user').setDescription('The user to ban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for the ban')),

  new SlashCommandBuilder().setName('kick').setDescription('Kick a user from the server')
    .addUserOption(o => o.setName('user').setDescription('The user to kick').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for the kick')),

  new SlashCommandBuilder().setName('mute').setDescription('Timeout a user')
    .addUserOption(o => o.setName('user').setDescription('The user to timeout').setRequired(true))
    .addIntegerOption(o => o.setName('duration').setDescription('Duration in minutes').setMinValue(1).setMaxValue(40320))
    .addStringOption(o => o.setName('reason').setDescription('Reason for the timeout')),

  new SlashCommandBuilder().setName('warn').setDescription('Warn a user')
    .addUserOption(o => o.setName('user').setDescription('The user to warn').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for the warning')),

  new SlashCommandBuilder().setName('clear').setDescription('Bulk delete messages')
    .addIntegerOption(o => o.setName('amount').setDescription('Number of messages to delete (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)),

  new SlashCommandBuilder().setName('rank').setDescription('View your or another user\'s rank')
    .addUserOption(o => o.setName('user').setDescription('The user to check')),

  new SlashCommandBuilder().setName('leaderboard').setDescription('View the server XP leaderboard'),

  new SlashCommandBuilder().setName('help').setDescription('View all bot commands'),

  new SlashCommandBuilder().setName('serverinfo').setDescription('View server information'),

  new SlashCommandBuilder().setName('userinfo').setDescription('View user information')
    .addUserOption(o => o.setName('user').setDescription('The user to check')),

  new SlashCommandBuilder().setName('8ball').setDescription('Ask the magic 8-ball')
    .addStringOption(o => o.setName('question').setDescription('Your question').setRequired(true)),

  new SlashCommandBuilder().setName('meme').setDescription('Get a random meme'),

  new SlashCommandBuilder().setName('ping').setDescription('Check bot and API latency'),

  new SlashCommandBuilder().setName('avatar').setDescription('View a user\'s avatar')
    .addUserOption(o => o.setName('user').setDescription('The user to check')),

  new SlashCommandBuilder().setName('poll').setDescription('Create a poll')
    .addStringOption(o => o.setName('question').setDescription('The poll question').setRequired(true))
    .addStringOption(o => o.setName('options').setDescription('Options separated by | (e.g. Yes | No | Maybe)').setRequired(true)),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    const clientId = process.env.DISCORD_CLIENT_ID!;
    console.log(`Registering ${commands.length} slash commands...`);

    // Clear global commands to remove duplicates
    await rest.put(Routes.applicationCommands(clientId), { body: [] });
    console.log('Cleared global commands.');

    // Register as guild commands only (instant, no duplicates)
    const guildsRes: any = await rest.get(Routes.userGuilds());
    for (const guild of guildsRes) {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guild.id),
        { body: commands }
      );
      console.log(`Registered commands in guild: ${guild.name} (${guild.id})`);
    }

    console.log('Successfully registered all slash commands!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();
