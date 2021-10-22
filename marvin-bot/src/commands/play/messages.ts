const messages = {
  PLAYING_SONG: (title: string) =>
    `Do you really want me to play: ${title}, it is awful`,
  ERROR_PLAYING_SONG: (error: unknown) =>
    `There has been an error playing your song: \n **${error}**`,
} as const;

export default messages;
