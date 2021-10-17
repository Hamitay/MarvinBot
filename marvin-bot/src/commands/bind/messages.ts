const messages = {
  BIND_ID: (channelId: string) => `Binding voice channel at guild id ${channelId}, hope you know what you're doing.`,
} as const;

export default messages;
