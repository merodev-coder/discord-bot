import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

// In-memory reminders (production should use a database)
const activeReminders = new Map<string, NodeJS.Timeout>();

function parseDuration(input: string): number | null {
  const match = input.match(/^(\d+)\s*(s|sec|m|min|h|hr|hour|d|day)s?$/i);
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 's': case 'sec': return value * 1000;
    case 'm': case 'min': return value * 60 * 1000;
    case 'h': case 'hr': case 'hour': return value * 60 * 60 * 1000;
    case 'd': case 'day': return value * 24 * 60 * 60 * 1000;
    default: return null;
  }
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''}`;
}

export async function handleReminder(interaction: ChatInputCommandInteraction) {
  const durationStr = interaction.options.getString('duration', true);
  const message = interaction.options.getString('message', true);
  const ms = parseDuration(durationStr);

  if (!ms) {
    return interaction.reply({
      content: 'Invalid duration format. Use formats like `30m`, `2h`, `1d`, `90s`.',
      ephemeral: true,
    });
  }

  if (ms > 7 * 24 * 60 * 60 * 1000) {
    return interaction.reply({
      content: 'Reminders cannot be set for more than 7 days.',
      ephemeral: true,
    });
  }

  const fireAt = new Date(Date.now() + ms);

  const embed = new EmbedBuilder()
    .setColor(0x9FA7FF)
    .setTitle('⏰ Reminder Set')
    .setDescription(`I'll remind you in **${formatDuration(ms)}**.`)
    .addFields(
      { name: 'Message', value: message },
      { name: 'Fires At', value: `<t:${Math.floor(fireAt.getTime() / 1000)}:F>` },
    )
    .setFooter({ text: 'You will receive a DM when the time is up.' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });

  const timeout = setTimeout(async () => {
    try {
      const dmEmbed = new EmbedBuilder()
        .setColor(0x9FA7FF)
        .setTitle('⏰ Reminder!')
        .setDescription(message)
        .setFooter({ text: `Reminder set ${formatDuration(ms)} ago` })
        .setTimestamp();

      await interaction.user.send({ embeds: [dmEmbed] });
    } catch {
      // If DMs are closed, try replying in the channel
      try {
        await interaction.followUp({
          content: `<@${interaction.user.id}> ⏰ **Reminder:** ${message}`,
        });
      } catch {}
    }
    activeReminders.delete(interaction.user.id);
  }, ms);

  activeReminders.set(interaction.user.id, timeout);
}
