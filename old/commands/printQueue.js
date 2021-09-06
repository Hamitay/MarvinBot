const messages = require('../messages');

const printQueue = async (message) => {
  if (!message.member.voice.channel) {
    return message.channel.send(messages.NO_QUEUE);
  };

  const serverQueue = message.client.queue.get(message.guild.id);

  if(!serverQueue) {
    return message.channel.send(messages.EMPTY_QUEUE)
  }

  let queueMessage = messages.QUEUE_HEADER;
  serverQueue.songs.forEach((song) => queueMessage += `- ${song.title}\n`)

  return message.channel.send(queueMessage);
}

module.exports = printQueue;
