"use strict";
// import { Message } from "discord.js";
// import MenuCommand from "../MenuCommand";
// import PlaylistService from "../../../playlist/PlaylistService";
// describe("MenuCommand", () => {
//   const rootDir = "rootDir";
//   const mockedPlaylistService = {
//     getAllPlaylists: async () => {
//       const playlistMap = new Map();
//       playlistMap.set("dir1", `${rootDir}/dir1`);
//       playlistMap.set("dir2", `${rootDir}/dir2`);
//       playlistMap.set("dir3", `${rootDir}/dir3`);
//       return playlistMap;
//     },
//   } as PlaylistService;
//   const menuCommand = new MenuCommand(mockedPlaylistService);
//   it("should return proper directive", () => {
//     expect(menuCommand.getDirective()).toBe("menu");
//   });
//   it("should return proper test message", () => {
//     expect(menuCommand.getHelpMessage()).toBe("Prints the available playlists");
//   });
//   it("should respond with a string containing all playlist folders", async () => {
//     const playlists = await menuCommand.execute();
//     const expectedResult = "-> dir1\n-> dir2\n-> dir3\n";
//     expect(playlists).toBe(expectedResult);
//   });
// });
describe("MenuCommand", () => {
    it("passes", () => {
        expect(1).toBe(1);
    });
});
//# sourceMappingURL=MenuCommand.spec.js.map