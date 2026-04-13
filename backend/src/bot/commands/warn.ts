import { ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { Warning, ModLog } from '../../models/index.js';

export async function handleWarn(interaction: ChatInputCommandInteraction) {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers)) {
    return interaction.reply({ content: 'You do not have permission to warn members.', ephemeral: true });
  }

  const user = interaction.options.getUser('user', true);
  const reason = interaction.options.getString('reason') || 'No reason provided';

  await Warning.create({
    guildId: interaction.guildId,
    userId: user.id,
    moderatorId: interaction.user.id,
    reason,
  });

  const totalWarnings = await Warning.countDocuments({
    guildId: interaction.guildId,
    userId: user.id,
  });

  await ModLog.create({
    guildId: interaction.guildId,
    action: 'WARN',
    targetId: user.id,
    moderatorId: interaction.user.id,
    reason,
  });

  const embed = new EmbedBuilder()
    .setColor(0x9FA7FF)
    .setTitle('Member Warned')
    .addFields(
      { name: 'User', value: `${user.tag}`, inline: true },
      { name: 'Total Warnings', value: `${totalWarnings}`, inline: true },
      { name: 'Reason', value: reason }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
