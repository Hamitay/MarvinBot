const bind = async (message) => {
  const voiceChannel = message.member.voice.channel;

  if (voiceChannel) {
    const connection = await voiceChannel.join();
    return message.channel.send(`Binding voice channel at guild id ${message.guild.id}, hope you know what you're doing.`)
  } else {
    // Entering voice channel
    return message.channel.send(messages.NOT_IN_VOICE_CHANNEL);
  }
}

module.exports = bind;
