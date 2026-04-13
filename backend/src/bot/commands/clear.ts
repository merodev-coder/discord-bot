import { ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js';
import { ModLog } from '../../models/index.js';

export async function handleClear(interaction: ChatInputCommandInteraction) {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) {
    return interaction.reply({ content: 'You do not have permission to manage messages.', ephemeral: true });
  }

  const amount = Math.min(interaction.options.getInteger('amount', true), 100);

  if (amount < 1) {
    return interaction.reply({ content: 'Please provide a number between 1 and 100.', ephemeral: true });
  }

  const channel = interaction.channel as TextChannel;
  const deleted = await channel.bulkDelete(amount, true);

  await ModLog.create({
    guildId: interaction.guildId,
    action: 'CLEAR',
    moderatorId: interaction.user.id,
    details: { count: deleted.size, channel: channel.id },
  });

  await interaction.reply({
    content: `Cleared **${deleted.size}** messages.`,
    ephemeral: true,
  });
}
