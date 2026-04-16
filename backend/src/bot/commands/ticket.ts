import { ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export async function handleTicket(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0x9FA7FF)
    .setTitle('🎫 Support Desk')
    .setDescription(
      'Need help? Click the button below to create a support ticket.\n\n' +
      'A private thread will be opened for you and the staff team to discuss your issue.'
    )
    .setFooter({ text: `Support system powered by UltimateBot` })
    .setTimestamp();

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('create_ticket')
      .setLabel('Create Ticket')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('📩')
  );

  await interaction.reply({ embeds: [embed], components: [row] });
}
