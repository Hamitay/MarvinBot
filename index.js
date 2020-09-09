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
    description: 'Plays a song from a youtube link.',
  },
  'stop': {
    function: stop,
    description: 'Stops the current song and destroys the queue.',
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
    description: 'Sets the queue to one of the premades playlists'
  },
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
  };

  if (!serverQueue || serverQueue.isBroadcast) {
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

      play(message.guild, queueConstruct.songs[0]);
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

async function playlist(message, serverQueue) {

  const playlist = message.content.split(" ")[2];

  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return message.channel.send(messages.NOT_ON_VOICE_CHANNEL);
  }

  const dir = fs.readdir(`./playlists/${playlist}`, async (err, files) => {
    if (err) {
      // Handle error
      return message.channel.send(messages.UNKNOWN_PLAYLIST)
    }

    const songs = shuffle(
      files.map((file) => ({
      title: file,
      url: `./playlists/${playlist}/${file}`,
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

      play_broadcast(message.guild, queueConstruct.songs[0]);
    } catch (err) {
      console.error(err);
      queue.delete(message.guild.id);

      return message.channel.send(messages.UNKNOWN_ERROR(error));
    }
  });
}

function play_broadcast(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const broadcast = client.voice.createBroadcast();
  broadcast.play(song.url).on("finish", () => {
    serverQueue.songs.shift();
    play_broadcast(guild, serverQueue.songs[0]);
  })
  .setVolume(serverQueue.volume);

  serverQueue.connection.play(broadcast).on("error", error => console.error(error));
  serverQueue.isBroadcast = true;
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
                                .play(ytdl(song.url))
                                .on("finish", () => {
                                  serverQueue.songs.shift();
                                  play(guild, serverQueue.songs[0])
                                }).on("error", (err) => {
                                  console.error(err);
                                  serverQueue.songs = [];
                                  serverQueue.connection.dispatcher.end();
                                });

  dispatcher.setVolume(serverQueue.volume);
  serverQueue.textChannel.send(`*Sigh*, I'm playing **${song.title}**`);
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
    return message.channel.send('There is not any song for me to skip, it is all silence and horror like the void of space');
  };

  if (serverQueue.isBroadcast) {
    serverQueue.connection.dispatcher.broadcast.player.dispatcher.end();
  } else {
    serverQueue.connection.dispatcher.end();
  }
}

function printQueue(message, serverQueue) {
  if (!message.member.voice.channel) {
    return message.channel.send('There is no queue, how dissapointing. I\'m not in a voice channel');
  };

  if(!serverQueue) {
    return message.channel.send('The queue is empty, it is all silence and horror like the void of space')
  }

  let queueMessage = 'Here are the songs \n';
  serverQueue.songs.forEach((song) => queueMessage += `- ${song.title}\n`)

  return message.channel.send(queueMessage);
}

function printHelp(message, serverQueue) {
  const helpCommands =
    Object.entries(commands).map((command) => `-> **${command[0]}**: ${command[1].description} \n`).join('');

  const helpMessage = messages.HELP_HEADER + helpCommands;
  return message.channel.send(helpMessage);
}
