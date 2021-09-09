const messages = {
  PLAYING_PLAYLIST: (title: string) =>
    `Do you really the want the ${title} playlist, it is terrible`,
} as const;

export default messages;
