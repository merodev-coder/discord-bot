import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { UserLevel } from '../../models/index.js';

export async function handleLeaderboard(interaction: ChatInputCommandInteraction) {
  const results = await UserLevel.find({ guildId: interaction.guildId })
    .sort({ level: -1, xp: -1 })
    .limit(10)
    .select('userId xp level messages');

  if (results.length === 0) {
    return interaction.reply({ content: 'No leaderboard data yet. Start chatting to earn XP!', ephemeral: true });
  }

  const medals = ['🥇', '🥈', '🥉'];
  const lines = results.map((row: any, i: number) => {
    const medal = i < 3 ? medals[i] : `\`#${i + 1}\``;
    const totalXp = row.level * ((row.level + 1) * 100 / 2) + row.xp;
    return `${medal} <@${row.userId}> • Level **${row.level}** • ${row.xp.toLocaleString()} XP • ${row.messages.toLocaleString()} msgs`;
  });

  const embed = new EmbedBuilder()
    .setColor(0x9FA7FF)
    .setTitle(`🏆 ${interaction.guild?.name} Leaderboard`)
    .setDescription(lines.join('\n'))
    .setFooter({ text: `Top ${results.length} members by level` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
