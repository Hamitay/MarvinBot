const messages = {
  VOLUME_UPDATE: (newVolume: number) => `Setting the volume to ${newVolume * 100}%`
} as const;

export default messages;
