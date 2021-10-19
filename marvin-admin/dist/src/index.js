"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Setup env variables
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const PlaylistController_1 = __importDefault(require("./playlist/PlaylistController"));
const publisher_1 = require("./publisher");
const PORT = process.env.API_PORT;
const app = (0, express_1.default)();
// Register middlewares
app.use((0, cors_1.default)());
// Register routes
app.use('/playlist', PlaylistController_1.default);
app.listen(PORT, () => console.log("Api enabled and listening on port: " + PORT));
(0, publisher_1.setUpConsumer)();
//# sourceMappingURL=index.js.map