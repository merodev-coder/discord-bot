import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

const responses = [
  'It is certain.', 'It is decidedly so.', 'Without a doubt.',
  'Yes, definitely.', 'You may rely on it.', 'As I see it, yes.',
  'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.',
  'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.',
  'Cannot predict now.', 'Concentrate and ask again.',
  'Don\'t count on it.', 'My reply is no.', 'My sources say no.',
  'Outlook not so good.', 'Very doubtful.',
];

export async function handle8ball(interaction: ChatInputCommandInteraction) {
  const question = interaction.options.getString('question', true);
  const answer = responses[Math.floor(Math.random() * responses.length)];

  const embed = new EmbedBuilder()
    .setColor(0x9FA7FF)
    .setTitle('🎱 Magic 8-Ball')
    .addFields(
      { name: 'Question', value: question },
      { name: 'Answer', value: answer }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
