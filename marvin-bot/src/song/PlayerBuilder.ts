import { Player } from "discord-player";
import { Client } from "discord.js";

export const buildPlayer = (client: Client) => {
  const player = Player.singleton(client, {
    ytdlOptions: { quality: "highestaudio", highWaterMark: 1 << 25 },
  });

  //Add player events here
  player.on("debug", async (message) => {
    // Emitted when the player sends debug info
    // Useful for seeing what dependencies, extractors, etc are loaded
    console.log(`General player debug event: ${message}`);
  });

  player.events.on("debug", async (queue, message) => {
    // Emitted when the player queue sends debug info
    // Useful for seeing what state the current queue is at
    console.log(`Player debug event: ${message}`);
  });

  return player;
};
