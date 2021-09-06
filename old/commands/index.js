const execute = require('./execute');
const stop = require('./stop');
const skip = require('./skip');
const setVolume = require('./setVolume');
const printQueue = require('./printQueue');
const playlist = require('./playlist');
const printMenu = require('./printMenu');
const bind = require('./bind');
const pjson = require('../package.json');

const messages = require('../messages');

const commands = {
  'help': {
    function: printHelp,
    description: 'Gives all the possible commands. But you probably already know this.'
  },
  'play': {
    function: execute,
    description: 'Plays a song from a youtube or soundcloud link or puts it at the bottom of the queue.',
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
  },
  'bind': {
    function: bind,
    description: 'Binds the chat id for hackerman purposes',
  },
};

// TODO: find a better way of avoiding circular import
function printHelp(message) {
  const helpCommands =
    Object.entries(commands).map((command) => `-> **${command[0]}**: ${command[1].description} \n`).join('\n');
  const versionHeader = 'Marvin Bot version: ' + pjson.version + '\n';
  const helpMessage = versionHeader + messages.HELP_HEADER + helpCommands;
  return message.channel.send(helpMessage);
}

module.exports = commands;
