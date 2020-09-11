const Discord = require('discord.js');

const {
  prefix,
} = require('./config.json');

const token = process.env.DISCORD_TOKEN;

const ytdl = require('ytdl-core');
const fs = require('fs');
const shuffle = require('shuffle-array');

const client = new Discord.Client();
const queue = new Map();

const messages = require('./messages');

const commands = {
  'help': {
    function: printHelp,
    description: 'Gives all the possible commands. But you probably already know this.'
  },
  'play': {
    function: execute,
    description: 'Plays a song from a youtube link or puts it at the bottom of the queue.',
  },
  'stop': {
    function: stop,
    description: 'Stops the current song and clears the queue.',
  },
  'skip': {
    function: skip,
    description: 'Skips the current song and plays the next one on the queue.',
  },
  'volume': {
    function: setVolume,
    description: 'Changes the volume of the stream.',
  },
  'queue': {
    function: printQueue,
    description: 'Prints the current queue',
  },
  'playlist': {
    function: playlist,
    description: 'Sets the queue to one of the premades playlists; \n\t **This will clear the current queue**',
  },
  'menu': {
    function: printMenu,
    description: 'Prints the available playlists',
  }
};

client.login(token);

client.once('ready', () => {
  console.log(messages.DEFAULT_MESSAGE);
});

client.once('reconnecting', () => {
  console.log(messages.DEFAULT_FAILURE_MESSAGE);
});

client.once('disconnect', () => {
  console.log(messages.DEFAULT_GOODBYE);
});

client.on('message', async (message) => {
  if(message.author.bot) return;

  if(!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  const args = message.content.split(" ");

  const command = args[1];

  if (command in commands) {
    return commands[command].function(message, serverQueue);
  }

  return message.channel.send(messages.ASK_FOR_HELP_MESSAGE);
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return message.channel.send(messages.NOT_ON_VOICE_CHANNEL);
  }

  const songInfo = await ytdl.getInfo(args[2]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url,
    isYoutube: true,
  };

  if (!serverQueue) {
    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: undefined,
      songs: [],
      volume: 1,
      playing: true,
    };

    // Add that channels queue to the server queues
    queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    try {
      const connection = await voiceChannel.join();
      queueConstruct.connection = connection;

      play(message.guild, queueConstruct.songs[0], message.channel);
    } catch (err) {
      console.error(err);
      queue.delete(message.guild.id);

      return message.channel.send(messages.UNKNOWN_ERROR(err));
    }

  } else {
    serverQueue.songs.push(song);
    return message.channel.send(messages.PLAYING_SONG(song.title));
  }
}

async function playlist(message, serverQueue) {

  const playlistName = message.content.split(" ")[2];

  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return message.channel.send(messages.NOT_ON_VOICE_CHANNEL);
  }

  const dir = fs.readdir(`./playlists/${playlistName}`, async (err, files) => {
    if (err) {
      // Handle error
      return message.channel.send(messages.UNKNOWN_PLAYLIST)
    }

    const songs = shuffle(
      files.map((file) => ({
      title: file,
      url: `./playlists/${playlistName}/${file}`,
      isYoutube: false,
    })));

    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: undefined,
      songs,
      volume: 1,
      playing: true,
    };

    queue.set(message.guild.id, queueConstruct);

    try {
      const connection = await voiceChannel.join();
      queueConstruct.connection = connection;

      play(message.guild, queueConstruct.songs[0], message.channel);
    } catch (err) {
      console.error(err);
      queue.delete(message.guild.id);

      return message.channel.send(messages.UNKNOWN_ERROR(error));
    }
  });
}

function setVolume(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return message.channel.send(messages.NOT_ON_VOICE_CHANNEL);
  }

  const volume = args[2]/100;

  if (serverQueue.isBroadcast) {
    serverQueue.connection.dispatcher.broadcast.player.dispatcher.setVolume(volume);
  } else {
    serverQueue.connection.dispatcher.setVolume(volume);
  }

  serverQueue.volume = volume;
  return message.channel.send(messages.CHANGE_VOLUME);
}

async function printMenu(message) {
  const dir = fs.readdir('./playlists', async (err, files) => {
    if(err) {
      // Handle error
      return message.channel.send(messages.UNKNOWN_ERROR(err));
    };

    const menu = files.map((file) => `-> ${file}`);

    return message.channel.send([messages.MENU_HEADER, ...menu]);
  })
}

function play(guild, song, channel) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
                                .play(song.isYoutube ? ytdl(song.url) : song.url)
                                .on("finish", () => {
                                  serverQueue.songs.shift();
                                  play(guild, serverQueue.songs[0], channel)
                                }).on("error", (err) => {
                                  console.error(err);
                                  channel.send(`It appears I have failed: ${err}`);
                                  serverQueue.songs = [];
                                  serverQueue.connection.dispatcher.end();
                                });

  dispatcher.setVolume(serverQueue.volume);
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel) {
    return message.channel.send(messages.NOT_ON_VOICE_CHANNEL);
  };

  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel) {
    return message.channel.send(messages.NOT_ON_VOICE_CHANNEL);
  };

  if(!serverQueue) {
    return message.channel.send(messages.NON_SKIPPABLE);
  };

  serverQueue.connection.dispatcher.end();
}

function printQueue(message, serverQueue) {
  if (!message.member.voice.channel) {
    return message.channel.send(messages.NO_QUEUE);
  };

  if(!serverQueue) {
    return message.channel.send(messages.EMPTY_QUEUE)
  }

  let queueMessage = messages.QUEUE_HEADER;
  serverQueue.songs.forEach((song) => queueMessage += `- ${song.title}\n`)

  return message.channel.send(queueMessage);
}

function printHelp(message) {
  const helpCommands =
    Object.entries(commands).map((command) => `-> **${command[0]}**: ${command[1].description} \n`).join('\n');

  const helpMessage = messages.HELP_HEADER + helpCommands;
  return message.channel.send(helpMessage);
}
