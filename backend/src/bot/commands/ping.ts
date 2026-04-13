import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export async function handlePing(interaction: ChatInputCommandInteraction) {
  const sent = await interaction.reply({ content: '🏓 Pinging...', fetchReply: true });
  const latency = sent.createdTimestamp - interaction.createdTimestamp;
  const apiLatency = Math.round(interaction.client.ws.ping);

  const embed = new EmbedBuilder()
    .setColor(0x9FA7FF)
    .setTitle('🏓 Pong!')
    .addFields(
      { name: 'Bot Latency', value: `${latency}ms`, inline: true },
      { name: 'API Latency', value: `${apiLatency}ms`, inline: true }
    )
    .setTimestamp();

  await interaction.editReply({ content: '', embeds: [embed] });
}
