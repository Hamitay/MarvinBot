import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  VoiceBasedChannel,
  CommandInteraction,
} from "discord.js";
import { singleton } from "tsyringe";
import Commands from "../commands";
import { GuildQueueEvent, Player, PlayerEvent } from "discord-player";
import { Logger, pino } from "pino";
import { buildPlayer } from "../song/PlayerBuilder";

const token = process.env.DISCORD_TOKEN;
const applicationId = "729334553306726491";

@singleton()
export default class DiscordClient {
  #client: Client;

  #restClient: REST;

  #commands: Commands;

  #player: Player;

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

    this.#player = buildPlayer(this.#client);

    this.#commands = commands;

    this.#restClient = new REST({ version: "10" }).setToken(token);
  }

  registerSlashCommands = async () => {
    await this.#restClient.put(Routes.applicationCommands(applicationId), {
      body: this.#commands.commandList.map((command) =>
        command.getBuilder().toJSON()
      ),
    });
  };

  public init() {
    this.#client.once(Events.ClientReady, (c) => {
      this.#logger.info("I'm ready and upgraded");
    });

    this.#client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

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

        throw error;
      }
    });

    this.#client.login(token);
    this.registerSlashCommands();
  }
}

/*
@singleton()
export default class DiscordClient {
  _client: Client;

  constructor() {
    this._client = new Client({ intents: [GatewayIntentBits.Guilds] });
  }

  public init(messageHandler: (arg0: Message) => void): Promise<string> {
    this._client.once("ready", () => {
      console.log("Im ready");
    });

    this._client.once("reconnecting", () => {
      console.log("Im trying to reconnect");
    });

    this._client.once("disconnect", () => {
      console.log("Im disconnected");
    });

    this._client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      console.log(interaction);
    });

    // Register commands here
    //this._client.on("message", messageHandler);

    return this._client.login(token);
  }

  public async postMessage(channelId: string, messageBody: string) {
    const channel = this._client.channels.cache.get(channelId) as
      | TextChannel
      | undefined;

    if (channel) {
      try {
        return await channel.send(messageBody);
      } catch (e) {
        console.error(e);
        throw new Error("Error sending message");
      }
    } else {
      throw new Error("Invalid channel id");
    }
  }
}
*/
