import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export async function handleHelp(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0x9FA7FF)
    .setTitle('UltimateBot Commands')
    .setDescription('Here are all available commands:')
    .addFields(
      { name: '🛡️ Moderation', value: '`/ban` `/kick` `/mute` `/warn` `/clear`' },
      { name: '📊 Leveling', value: '`/rank` `/leaderboard`' },
      { name: ' Fun', value: '`/8ball` `/meme` `/poll`' },
      { name: 'ℹ️ General', value: '`/help` `/serverinfo` `/userinfo` `/ping` `/avatar`' }
    )
    .setFooter({ text: 'UltimateBot — 15 commands • Evolve Your Digital Empire' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
