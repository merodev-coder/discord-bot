import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { UserLevel } from '../../models/index.js';

export async function handleRank(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getUser('user') || interaction.user;

  const userLevel = await UserLevel.findOne({ guildId: interaction.guildId, userId: user.id });

  if (!userLevel) {
    return interaction.reply({ content: `${user.username} has no XP data yet. Start chatting to earn XP!`, ephemeral: true });
  }

  const { xp, level, messages } = userLevel;
  const requiredXp = (level + 1) * 100;
  const progress = Math.min(Math.round((xp / requiredXp) * 100), 100);

  // Rank based on level first, then XP within same level
  const rank = await UserLevel.countDocuments({
    guildId: interaction.guildId,
    $or: [
      { level: { $gt: level } },
      { level: level, xp: { $gt: xp } },
    ],
  }) + 1;

  const filled = Math.floor(progress / 10);
  const progressBar = '▓'.repeat(filled) + '░'.repeat(10 - filled);

  const embed = new EmbedBuilder()
    .setColor(0x9FA7FF)
    .setAuthor({ name: `${user.username}'s Rank`, iconURL: user.displayAvatarURL() })
    .setThumbnail(user.displayAvatarURL())
    .addFields(
      { name: 'Rank', value: `#${rank}`, inline: true },
      { name: 'Level', value: `${level}`, inline: true },
      { name: 'XP', value: `${xp.toLocaleString()} / ${requiredXp.toLocaleString()}`, inline: true },
      { name: 'Messages', value: `${messages.toLocaleString()}`, inline: true },
      { name: 'Progress', value: `${progressBar} ${progress}%` }
    )
    .setFooter({ text: `Keep chatting to reach Level ${level + 1}!` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
