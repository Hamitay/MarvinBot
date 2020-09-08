const Discord = require('discord.js');

const {
  prefix,
  token,
} = require('./config.json');

const ytdl = require('ytdl-core');
const fs = require('fs');
const shuffle = require('shuffle-array');

const client = new Discord.Client();
const queue = new Map();

client.login(token);

client.once('ready', () => {
  console.log('Don\'t talk to me about life');
});

client.once('reconnecting', () => {
  console.log('Oh I failed, how marvelous');
});

client.once('disconnect', () => {
  console.log('Farewell');
});

client.on('message', async (message) => {
  if(message.author.bot) return;
  if(!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix} play `)) {
    return execute(message, serverQueue);
  }

  if (message.content.startsWith(`${prefix} stop`)) {
    return stop(message, serverQueue);
  }

  if (message.content.startsWith(`${prefix} skip`)) {
    return skip(message, serverQueue);
  }

  if (message.content.startsWith(`${prefix} volume`)) {
    return setVolume(message, serverQueue);
  }

  if (message.content.startsWith(`${prefix} queue`)) {
    return printQueue(message, serverQueue);
  }

  if (message.content.startsWith(`${prefix} playlist`)) {
    return playlist(message, serverQueue);
  }

  return message.channel.send("Don't talk to me about life!");
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return message.channel.send('How do you expect me to play anything? I\'m not in a voice channel');
  }
  //To do add voicechannel permissions management

  const songInfo = await ytdl.getInfo(args[2]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url,
  };

  if (!serverQueue) {
    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: undefined,
      songs: [],
      volume: 50,
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

      return message.channel.send(`Unsurprisingly there has been an error: ${error}`);
    }

  } else {
    serverQueue.songs.push(song);
    console.log(`Server queue: ${serverQueue.songs}`);
    return message.channel.send(`Do you really want me to play: ${song.title}, it is awful`);
  }

}

function setVolume(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return message.channel.send('How do you expect me to play anything? I\'m not in a voice channel');
  }

  let volume = args[2];

  const dispatcher = serverQueue.connection.dispatcher;

  if (serverQueue.isBroadcast) {
    volume = volume/100;
    serverQueue.connection.dispatcher.broadcast.player.dispatcher.setVolume(volume);
  } else {
    serverQueue.connection.dispatcher.setVolume(volume);
  }

  serverQueue.volume = volume;
  return message.channel.send('Yeah I will change the volume, it is not like you care if I can listen to it!');
}

async function playlist(message, serverQueue) {

  const playlist = message.content.split(" ")[2];

  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return message.channel.send('How do you expect me to play anything? I\'m not in a voice channel');
  }

  const dir = fs.readdir(`./playlists/${playlist}`, async (err, files) => {
    if (err) {
      // Handle error
      return message.channel.send('I believe this is a non-existant playlist')
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

      return message.channel.send(`Unsurprisingly there has been an error: ${error}`);
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
  serverQueue.textChannel.send(`*Sigh*, I'm playing **${song.title}**`);
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
                                });

  dispatcher.setVolume(serverQueue.volume);
  serverQueue.textChannel.send(`*Sigh*, I'm playing **${song.title}**`);
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel) {
    return message.channel.send('How do you expect me to play anything? I\'m not in a voice channel');
  };

  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel) {
    return message.channel.send('How do you expect me to play anything? I\'m not in a voice channel');
  };

  if(!serverQueue) {
    return message.channel.send('There is not any song for me to skip, it is all silence and horror like the void of space');
  };

  serverQueue.connection.dispatcher.end();
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
