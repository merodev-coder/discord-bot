import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { UserLevel } from '../../models/index.js';

export async function handleProfile(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser('user') ?? interaction.user;
  const member = interaction.guild?.members.cache.get(target.id) ?? await interaction.guild?.members.fetch(target.id).catch(() => null);

  if (!member) {
    return interaction.reply({ content: 'Could not find that member in this server.', ephemeral: true });
  }

  const userLevel = await UserLevel.findOne({ guildId: interaction.guildId, userId: target.id });
  const level = userLevel?.level ?? 0;
  const xp = userLevel?.xp ?? 0;
  const messages = userLevel?.messages ?? 0;
  const requiredXp = (level + 1) * 100;
  const progress = Math.min(Math.round((xp / requiredXp) * 100), 100);

  // Build a text-based progress bar
  const barLength = 16;
  const filled = Math.round((progress / 100) * barLength);
  const progressBar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

  const roles = member.roles.cache
    .filter(r => r.id !== interaction.guildId)
    .sort((a, b) => b.position - a.position)
    .map(r => `<@&${r.id}>`)
    .slice(0, 10)
    .join(', ') || 'None';

  const embed = new EmbedBuilder()
    .setColor(member.displayColor || 0x9FA7FF)
    .setAuthor({ name: target.username, iconURL: target.displayAvatarURL({ size: 256 }) })
    .setThumbnail(target.displayAvatarURL({ size: 512 }))
    .addFields(
      { name: 'Level', value: `**${level}**`, inline: true },
      { name: 'XP', value: `${xp.toLocaleString()} / ${requiredXp.toLocaleString()}`, inline: true },
      { name: 'Messages', value: `${messages.toLocaleString()}`, inline: true },
      { name: `Progress to Level ${level + 1}`, value: `\`${progressBar}\` ${progress}%` },
      { name: 'Roles', value: roles },
      { name: 'Joined Server', value: member.joinedAt ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>` : 'Unknown', inline: true },
      { name: 'Account Created', value: `<t:${Math.floor(target.createdAt.getTime() / 1000)}:R>`, inline: true },
    )
    .setFooter({ text: `ID: ${target.id}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
