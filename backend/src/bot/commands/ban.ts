import { ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { ModLog } from '../../models/index.js';

export async function handleBan(interaction: ChatInputCommandInteraction) {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers)) {
    return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
  }

  const user = interaction.options.getUser('user', true);
  const reason = interaction.options.getString('reason') || 'No reason provided';

  const member = await interaction.guild?.members.fetch(user.id).catch(() => null);
  if (!member) return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
  if (!member.bannable) return interaction.reply({ content: 'I cannot ban this user.', ephemeral: true });

  await member.ban({ reason });

  await ModLog.create({
    guildId: interaction.guildId,
    action: 'BAN',
    targetId: user.id,
    moderatorId: interaction.user.id,
    reason,
  });

  const embed = new EmbedBuilder()
    .setColor(0xD73357)
    .setTitle('Member Banned')
    .addFields(
      { name: 'User', value: `${user.tag}`, inline: true },
      { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
      { name: 'Reason', value: reason }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
