module.exports = Object.freeze({
  DEFAULT_MESSAGE: 'Don\'t talk to me about life',
  DEFAULT_FAILURE_MESSAGE: 'Oh I failed, how marvelous',
  DEFAULT_GOODBYE: 'Farewell',
  NOT_ON_VOICE_CHANNEL: 'How do you expect me to play anything? I\'m not in a voice channel',
  UNKNOWN_ERROR: (error) => `Unsurprisingly there has been an error: ${error}`,
  PLAYING_SONG: (title) => `Do you really want me to play: ${title}, it is awful`,
  CHANGE_VOLUME: 'Yeah I will change the volume, it is not like you care if I can listen to it!',
  UNKNOWN_PLAYLIST: 'I believe this is a non-existant playlist',
  ASK_FOR_HELP_MESSAGE: 'Well it appears you are speaking gibberish. I suppose I could **help** you if you ask nicely.',
  HELP_HEADER: 'I have the brain the size of a planet, there is nothing I can\'t do. However those are the things I might do for you if I\'m '+
  'feeling good, which I\'m not \n',
});
