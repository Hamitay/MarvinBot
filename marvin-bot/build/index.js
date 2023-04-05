"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const bot_1 = __importDefault(require("./bot"));
const api_1 = __importDefault(require("./api"));
const { API_ENABLED } = process.env;
const bot = tsyringe_1.container.resolve(bot_1.default);
bot.listen();
if (API_ENABLED) {
    const api = tsyringe_1.container.resolve(api_1.default);
    api.serve();
}
//# sourceMappingURL=index.js.map