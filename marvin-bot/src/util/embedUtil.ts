import { EmbedBuilder } from "discord.js";

const EMBED_COLOR = 0x0099ff;

export const buildDefaultEmbed = (title: string, subtitle: string) => {
  return new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle(title)
    .setAuthor({ name: subtitle })
    .setTimestamp();
};
