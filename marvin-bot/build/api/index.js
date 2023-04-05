"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _MarvinApi_discordClient;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const tsyringe_1 = require("tsyringe");
const client_1 = __importDefault(require("../client"));
const cors_1 = __importDefault(require("cors"));
const PORT = 5000;
let MarvinApi = class MarvinApi {
    constructor(discordClient) {
        _MarvinApi_discordClient.set(this, void 0);
        __classPrivateFieldSet(this, _MarvinApi_discordClient, discordClient, "f");
    }
    serve() {
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)());
        app.post("/message", (0, body_parser_1.json)(), async (req, res) => {
            const message = req.body;
            try {
                //await this.#discordClient.postMessage(message.id, message.messageBody);
            }
            catch (e) {
                console.error(e);
                res.send(500);
            }
            res.send(200);
        });
        app.listen(PORT, () => console.log("Api enabled and listening on port: " + PORT));
    }
};
_MarvinApi_discordClient = new WeakMap();
MarvinApi = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [client_1.default])
], MarvinApi);
exports.default = MarvinApi;
//# sourceMappingURL=index.js.map