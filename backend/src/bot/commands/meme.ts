import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export async function handleMeme(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const response = await fetch('https://meme-api.com/gimme');
    const data = await response.json();

    const embed = new EmbedBuilder()
      .setColor(0x9FA7FF)
      .setTitle(data.title || 'Random Meme')
      .setImage(data.url)
      .setFooter({ text: `👍 ${data.ups || 0} | r/${data.subreddit || 'memes'}` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch {
    await interaction.editReply({ content: 'Failed to fetch a meme. Try again later!' });
  }
}
