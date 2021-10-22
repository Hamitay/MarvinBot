import { Message } from "discord.js";
import { injectable } from "tsyringe";
import DiscordClient from "../client";
import Commands from "../commands";

const alias = "_m";
const prefix = "marvin";
@injectable()
export default class MarvinBot {
  _commands: Commands;

  _client: DiscordClient;

  constructor(commands: Commands, discordClient: DiscordClient) {
    this._commands = commands;
    this._client = discordClient;
  }

  private _messageHandler = async (message: Message): Promise<Message | undefined> => {
    const { content } = message;

    if (content.startsWith(alias) || content.startsWith(prefix)) {
      const sanitizedInpute = this.sanitizeInput(content);

      const result = (await this._commands.executeCommand(sanitizedInpute.directive,
        sanitizedInpute.args, message));
      return message.channel.send(result);
    }
  };

  public sanitizeInput(input: string) {
    const args = input.split(" ")
      .filter((element) => element !== "")
      .splice(1);
    return {
      directive: args[0],
      args: args.splice(1),
    };
  }

  public listen(): Promise<string> {
    return this._client.init(this._messageHandler);
  }
}
