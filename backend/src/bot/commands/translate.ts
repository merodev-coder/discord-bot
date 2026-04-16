import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

const LANGUAGES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  ar: 'Arabic',
  hi: 'Hindi',
  tr: 'Turkish',
  nl: 'Dutch',
  pl: 'Polish',
};

export async function handleTranslate(interaction: ChatInputCommandInteraction) {
  const text = interaction.options.getString('text', true);
  const targetLang = interaction.options.getString('language', true);
  const langName = LANGUAGES[targetLang] ?? targetLang;

  if (text.length > 1000) {
    return interaction.reply({ content: 'Text must be 1000 characters or fewer.', ephemeral: true });
  }

  await interaction.deferReply();

  try {
    // Use the free LibreTranslate-compatible endpoint
    const res = await fetch('https://api.mymemory.translated.net/get?' + new URLSearchParams({
      q: text,
      langpair: `en|${targetLang}`,
    }));

    const data = await res.json() as { responseData?: { translatedText?: string }; responseStatus?: number };

    if (!data.responseData?.translatedText || data.responseStatus !== 200) {
      return interaction.editReply('Translation failed. Please try again later.');
    }

    const translated = data.responseData.translatedText;

    const embed = new EmbedBuilder()
      .setColor(0x9FA7FF)
      .setTitle('🌐 Translation')
      .addFields(
        { name: 'Original', value: text.slice(0, 1024) },
        { name: `Translated (${langName})`, value: translated.slice(0, 1024) },
      )
      .setFooter({ text: `Requested by ${interaction.user.username}` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch {
    await interaction.editReply('Translation service is unavailable right now. Please try again later.');
  }
}
