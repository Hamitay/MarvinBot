import { Client, Message } from 'discord.js';
import { injectable } from 'tsyringe';
import Commands from '../commands';
import SampleCommand from '../commands/SampleCommand';

const token = process.env.DISCORD_TOKEN;

const alias = '_m';

@injectable()
export default class MarvinBot {

  _commands: Commands;

  constructor(commands: Commands) {
    this._commands = commands;
  }

  private _setUp(client: Client): Promise<string> {
    client.once('ready', () => {
      console.log('Im ready');
    });

    client.once('reconnecting', () => {
      console.log('Im trying to reconnect');
    });

    client.once('disconnect', () => {
      console.log('Im disconnected');
    });

    // Register commands here
    client.on('message', (message: Message) => {
      const { content } = message;

      if (content.startsWith(alias)) {
        this._commands.executeCommand('sample', []);
        return message.channel.send("Working without recursion")
      }
    })

    return client.login(token);
  }


  public listen(): Promise<string> {
    let client = new Client();
    return this._setUp(client);
  }
}
