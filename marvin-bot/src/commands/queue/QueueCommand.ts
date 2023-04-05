import { injectable } from "tsyringe";
import messages from "./messages";
import commonMessages from "../commonMessages";
import { SlashCommand } from "../command";
import {
  SlashCommandSubcommandsOnlyBuilder,
  SlashCommandBuilder,
  CommandInteraction,
  CacheType,
  EmbedBuilder,
} from "discord.js";
import SongService from "../../song/SongService";

const commandName = "queue";
const commandDescription = "Prints the current queue";

@injectable()
export default class QueueCommand extends SlashCommand {
  #builder: SlashCommandSubcommandsOnlyBuilder;

  #songService: SongService;

  constructor(songService: SongService) {
    super();

    this.#songService = songService;

    this.#builder = new SlashCommandBuilder()
      .setName(commandName)
      .setDescription(commandDescription);
  }

  getName(): String {
    return commandName;
  }

  getBuilder(): SlashCommandSubcommandsOnlyBuilder {
    return this.#builder;
  }

  async execute(interaction: CommandInteraction<CacheType>): Promise<any> {
    const voiceChannel = await super.getVoiceChannel(interaction);

    if (!voiceChannel) {
      return await interaction.followUp(commonMessages.NOT_IN_VOICE_CHANNEL);
    }

    await interaction.deferReply();

    const queue = await this.#songService.getQueue(voiceChannel);

    if (!queue) {
      return await interaction.followUp(messages.EMPTY_LIST);
    }

    const currentTrackName = `- **${queue.currentTrack?.title}**`;

    const queuedTrackNames = queue.tracks.map((track) => {
      `- ${track.title}`;
    });

    const trackNames = [currentTrackName, ...queuedTrackNames]
      .join("\n")
      .slice(0, 4095);

    const queueEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Current queue")
      .setAuthor({
        name: "The queue has the following songs",
      })
      .setDescription(trackNames)
      .setTimestamp();

    return await interaction.followUp({ embeds: [queueEmbed] });
  }
}
