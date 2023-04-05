"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPlayer = void 0;
const discord_player_1 = require("discord-player");
const buildPlayer = (client) => {
    const player = discord_player_1.Player.singleton(client, {
        ytdlOptions: { quality: "highestaudio", highWaterMark: 1 << 25 },
    });
    //Add player events here
    return player;
};
exports.buildPlayer = buildPlayer;
//# sourceMappingURL=PlayerBuilder.js.map