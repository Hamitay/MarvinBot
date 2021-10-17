import { Message } from 'discord.js';
import { injectable } from 'tsyringe';
import { Command } from '../command';
import commonMessages from '../commonMessages';
import messages from './messages';

const DIRECTIVE = 'bind';

@injectable()
export default class BindCommand extends Command {
  getDirective(): string {
    return DIRECTIVE;
  }

  getHelpMessage(): string {
    return 'Returns the chat id for hackerman purposes.';
  }

  async execute(message: Message, args: string[]): Promise<string> {
    const voiceChannel = message.member?.voice.channel;

    if (!voiceChannel) {
      return this.respond(commonMessages.NOT_IN_VOICE_CHANNEL);
    }

    await voiceChannel.join();
    return this.respond(messages.BIND_ID(message.channel.id));
  }
}
