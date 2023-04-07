import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  CacheType,
  Interaction,
  ChatInputCommandInteraction,
  StringSelectMenuInteraction,
  ButtonInteraction,
} from "discord.js";
import { singleton } from "tsyringe";
import Commands from "../commands";
import { Logger, pino } from "pino";
import { buildPlayer } from "../song/PlayerBuilder";
import PlaylistSelectInteraction from "../commands/menu/PlaylistSelectInteraction";
import { InteractionHandler } from "../commands/command";

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.APPLICATION_ID || "729334553306726491";
const dev = process.env.DEV || false;

@singleton()
export default class DiscordClient {
  #client: Client;

  #restClient: REST;

  #commands: Commands;

  #logger: Logger;

  constructor(commands: Commands) {
    this.#logger = pino();

    if (!token) {
      this.#logger.error("Undefined discord token");
      return;
    }

    this.#client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
    });

    buildPlayer(this.#client);
    this.#restClient = new REST({ version: "10" }).setToken(token);

    this.#commands = commands;
  }

  registerSlashCommands = async () => {
    const route = dev
      ? Routes.applicationGuildCommands(applicationId, "285128715296571392")
      : Routes.applicationCommands(applicationId);

    await this.#restClient.put(route, {
      body: this.#commands.commandList.map((command) =>
        command.getBuilder().toJSON()
      ),
    });
  };

  async handleChatInputCommand(
    interaction: ChatInputCommandInteraction<CacheType>
  ) {
    const commandName = interaction.commandName;
    const commmand = this.#commands.commandMap.get(commandName);

    if (!commmand) {
      this.#logger.child({ command: commandName });
      this.#logger.error("Unregistered command");

      interaction.reply("Unexpected error!");
      return;
    }

    try {
      await commmand?.execute(interaction);
    } catch (error) {
      this.#logger.child({ error });
      this.#logger.error(
        `Command ${commandName} produce an unexpected error ${error}`
      );

      interaction.followUp("Unexpected error!");
    }
  }

  async handleStringSelectMenuCommand(
    interaction: StringSelectMenuInteraction
  ) {
    const selector = interaction.customId;

    const handler = this.#commands.stringSelectHandlers.get(selector);

    if (!selector) {
      this.#logger.child({ handler: selector });
      this.#logger.error("Unregistered command");

      interaction.reply("Unexpected error with handler!");
      return;
    }

    try {
      await handler?.execute(interaction);
    } catch (error) {
      this.#logger.child({ error });
      this.#logger.error(
        `Handler ${selector} produce an unexpected error ${error}`
      );

      interaction.followUp("Unexpected error with handler!");
    }
  }

  async handleButtonInteraction(interaction: ButtonInteraction) {
    const selector = interaction.customId;

    const handler = this.#commands.buttonHandlers.get(selector);

    if (!selector) {
      this.#logger.child({ handler: selector });
      this.#logger.error("Unregistered command");

      interaction.reply("Unexpected error with handler!");
      return;
    }

    try {
      await handler?.execute(interaction);
    } catch (error) {
      this.#logger.child({ error });
      this.#logger.error(
        `Handler ${selector} produce an unexpected error ${error}`
      );

      interaction.followUp("Unexpected error with handler!");
    }
  }

  public init() {
    this.#client.once(Events.ClientReady, (c) => {
      this.#logger.info("I'm ready and upgraded!");
    });

    this.#client.on(Events.InteractionCreate, async (interaction) => {
      // Handle chat commands
      if (interaction.isChatInputCommand()) {
        await this.handleChatInputCommand(interaction);
      }

      // Handle select interactions
      if (interaction.isStringSelectMenu()) {
        await this.handleStringSelectMenuCommand(interaction);
      }

      //Handle button interactions
      if (interaction.isButton()) {
        await this.handleButtonInteraction(interaction);
      }
    });

    this.#client.login(token);
    this.registerSlashCommands();
  }
}
