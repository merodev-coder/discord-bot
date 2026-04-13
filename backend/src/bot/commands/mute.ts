import { ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { ModLog } from '../../models/index.js';

export async function handleMute(interaction: ChatInputCommandInteraction) {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers)) {
    return interaction.reply({ content: 'You do not have permission to timeout members.', ephemeral: true });
  }

  const user = interaction.options.getUser('user', true);
  const duration = interaction.options.getInteger('duration') || 5;
  const reason = interaction.options.getString('reason') || 'No reason provided';

  const member = await interaction.guild?.members.fetch(user.id).catch(() => null);
  if (!member) return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
  if (!member.moderatable) return interaction.reply({ content: 'I cannot timeout this user.', ephemeral: true });

  await member.timeout(duration * 60 * 1000, reason);

  await ModLog.create({
    guildId: interaction.guildId,
    action: 'MUTE',
    targetId: user.id,
    moderatorId: interaction.user.id,
    reason,
    details: { duration },
  });

  const embed = new EmbedBuilder()
    .setColor(0x5864F1)
    .setTitle('Member Timed Out')
    .addFields(
      { name: 'User', value: `${user.tag}`, inline: true },
      { name: 'Duration', value: `${duration} minutes`, inline: true },
      { name: 'Reason', value: reason }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
