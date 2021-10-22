import { Client, Message, TextChannel } from "discord.js";
import { singleton } from "tsyringe";

const token = process.env.DISCORD_TOKEN;

@singleton()
export default class DiscordClient {
  _client: Client;

  constructor() {
    this._client = new Client();
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

    // Register commands here
    this._client.on("message", messageHandler);

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
