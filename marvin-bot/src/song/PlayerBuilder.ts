import { Player } from "discord-player";
import { Client } from "discord.js";
import pino from "pino";

export const buildPlayer = (client: Client) => {
  const player = Player.singleton(client, {
    ytdlOptions: { quality: "highestaudio", highWaterMark: 1 << 25 },
  });

  const logger = pino();

  //Add player events here
  player.on("debug", async (message) => {
    // Emitted when the player sends debug info
    // Useful for seeing what dependencies, extractors, etc are loaded
    logger.info(`General player debug event: ${message}`);
  });

  player.events.on("debug", async (queue, message) => {
    // Emitted when the player queue sends debug info
    // Useful for seeing what state the current queue is at
    logger.info(`Player debug event: ${message}`);
  });

  return player;
};
