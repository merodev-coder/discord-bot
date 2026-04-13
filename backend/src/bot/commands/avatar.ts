import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export async function handleAvatar(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getUser('user') || interaction.user;
  const avatarUrl = user.displayAvatarURL({ size: 512, extension: 'png' });

  const embed = new EmbedBuilder()
    .setColor(0x9FA7FF)
    .setTitle(`${user.username}'s Avatar`)
    .setImage(avatarUrl)
    .addFields({ name: 'Links', value: `[PNG](${user.displayAvatarURL({ extension: 'png', size: 1024 })}) • [JPG](${user.displayAvatarURL({ extension: 'jpg', size: 1024 })}) • [WEBP](${user.displayAvatarURL({ extension: 'webp', size: 1024 })})` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
