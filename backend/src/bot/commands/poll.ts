import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

const EMOJIS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

export async function handlePoll(interaction: ChatInputCommandInteraction) {
  const question = interaction.options.getString('question', true);
  const optionsRaw = interaction.options.getString('options', true);
  const options = optionsRaw.split('|').map(o => o.trim()).filter(Boolean).slice(0, 5);

  if (options.length < 2) {
    return interaction.reply({ content: 'Please provide at least 2 options separated by `|`.', ephemeral: true });
  }

  const description = options.map((opt, i) => `${EMOJIS[i]} ${opt}`).join('\n\n');

  const embed = new EmbedBuilder()
    .setColor(0x9FA7FF)
    .setTitle(`📊 ${question}`)
    .setDescription(description)
    .setFooter({ text: `Poll by ${interaction.user.username}` })
    .setTimestamp();

  const msg = await interaction.reply({ embeds: [embed], fetchReply: true });

  for (let i = 0; i < options.length; i++) {
    await msg.react(EMOJIS[i]);
  }
}
