const execute = require("../execute");

const { play } = require("../../player")
jest.mock("../../player");

const messages = require("../../messages");

describe("execute", () => {

  const guildId = 'guild-id';

  const guild = {
    id: guildId,
  };

  const client = {
    queue: new Map(),
  };

  const voiceChannel = {
    id: 0,
    join: async () => undefined,
  }

  const message = {
    channel: {
      send: jest.fn(),
    },
    client,
    guild,
    content: "_marvin play Mr Finish Line",
    member: {
      voice: {
        channel: voiceChannel,
      },
    },
  };

  beforeEach(() => {
    jest.resetModules();
  });

  it("should exit and send NOT_IN_VOICE_CHANNEL_MESSAGE if there is no voice channel", () => {
    const mockMessage = {
      ...message,
      member: {
        voice: {
          channel: undefined,
        },
      },
    };

    execute(mockMessage);
    expect(mockMessage.channel.send).toHaveBeenCalledWith(messages.NOT_IN_VOICE_CHANNEL);
  });

  it("should build a server-queue, if there is no queue",  async () => {
    await execute(message);

    const { queue } = client;

    const newQueue = queue.get(guild.id);

    expect(newQueue).toMatchObject({
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: undefined,
      volume: 0.2,
      playing: true,
    });
  });
});
