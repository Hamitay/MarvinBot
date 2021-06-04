import { Client, Message } from 'discord.js';
import { singleton } from 'tsyringe';

const token = process.env.DISCORD_TOKEN;

@singleton()
export default class DiscordClient {

  _client: Client;

  constructor() {
    this._client = new Client();
  }

  public init(messageHandler: (arg0: Message) => void): Promise<string> {
    this._client.once('ready', () => {
      console.log('Im ready');
    });

    this._client.once('reconnecting', () => {
      console.log('Im trying to reconnect');
    });

    this._client.once('disconnect', () => {
      console.log('Im disconnected');
    });

    // Register commands here
    this._client.on('message', messageHandler)

    return this._client.login(token);
  }
}

