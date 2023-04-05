"use strict";
// import { injectable } from "tsyringe";
// import { Command } from "../command";
// import PlaylistService from "../../playlist/PlaylistService";
// const DIRECTIVE = "menu";
// @injectable()
// export default class MenuCommand extends Command {
//   #playlistService: PlaylistService;
//   constructor(playlistService: PlaylistService) {
//     super();
//     this.#playlistService = playlistService;
//   }
//   getDirective(): string {
//     return DIRECTIVE;
//   }
//   getHelpMessage(): string {
//     return "Prints the available playlists";
//   }
//   async execute(): Promise<string> {
//     let playlistResponse = "";
//     try {
//       const playlistMap = await this.#playlistService.getAllPlaylists();
//       playlistMap.forEach((_, key) => {
//         playlistResponse += `-> ${key}\n`;
//       });
//     } catch (err) {
//       playlistResponse = `There has been the following error:\n *${err}*`;
//     }
//     return this.respond(playlistResponse);
//   }
// }
//# sourceMappingURL=MenuCommand.js.map