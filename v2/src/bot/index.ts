import { Client, Message } from 'discord.js';
import Commands from '../commands';
import SampleCommand from '../commands/SampleCommand';

const token = process.env.DISCORD_TOKEN;

const alias = '_m';

export default class MarvinBot {

  private _setUp(client: Client, commands: Commands): Promise<string> {
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
        commands.executeCommand('sample', []);
        return message.channel.send("Working without recursion")
      }
    })

    return client.login(token);
  }


  public listen(): Promise<string> {
    let sampleCommand = new SampleCommand();
    let commands = new Commands(sampleCommand);

    let client = new Client();
    return this._setUp(client, commands);
  }
}
