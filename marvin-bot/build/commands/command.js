"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommand = exports.Command = void 0;
class Command {
    respond(message) {
        return new Promise((resolve) => resolve(message));
    }
}
exports.Command = Command;
class SlashCommand {
    async getVoiceChannel(interaction) {
        const { guild, user } = interaction;
        const guildMember = await (guild === null || guild === void 0 ? void 0 : guild.members.fetch({ user }));
        return guildMember === null || guildMember === void 0 ? void 0 : guildMember.voice.channel;
    }
}
exports.SlashCommand = SlashCommand;
//# sourceMappingURL=command.js.map