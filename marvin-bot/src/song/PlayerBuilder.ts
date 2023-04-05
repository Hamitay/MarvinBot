import { Player } from "discord-player";
import { Client } from "discord.js";

export const buildPlayer = (client: Client) => {
  const player = Player.singleton(client, {
    ytdlOptions: { quality: "highestaudio", highWaterMark: 1 << 25 },
  });

  //Add player events here

  return player;
};
