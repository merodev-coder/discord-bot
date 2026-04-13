import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export async function handleUserinfo(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getUser('user') || interaction.user;
  const member = await interaction.guild?.members.fetch(user.id).catch(() => null);

  const embed = new EmbedBuilder()
    .setColor(0x9FA7FF)
    .setTitle(`${user.username}`)
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: 'ID', value: user.id, inline: true },
      { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
    );

  if (member) {
    embed.addFields(
      { name: 'Joined Server', value: member.joinedAt ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>` : 'Unknown', inline: true },
      { name: 'Roles', value: member.roles.cache.filter(r => r.id !== interaction.guildId).map(r => `${r}`).join(', ') || 'None', inline: false }
    );
  }

  embed.setTimestamp();
  await interaction.reply({ embeds: [embed] });
}
