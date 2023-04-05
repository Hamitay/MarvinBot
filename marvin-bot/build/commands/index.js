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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const PlayCommand_1 = __importDefault(require("./play/PlayCommand"));
const StopCommand_1 = __importDefault(require("./stop/StopCommand"));
const SkipCommand_1 = __importDefault(require("./skip/SkipCommand"));
const QueueCommand_1 = __importDefault(require("./queue/QueueCommand"));
let Commands = class Commands {
    constructor(playCommand, stopCommand, skipCommand, queueCommand) {
        this.commandList = [playCommand, stopCommand, skipCommand, queueCommand];
        this.commandMap = this.buildCommandMap(this.commandList);
    }
    buildCommandMap(commands) {
        const map = new Map();
        commands.forEach((command) => {
            map.set(command.getName(), command);
        });
        return map;
    }
};
Commands = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [PlayCommand_1.default,
        StopCommand_1.default,
        SkipCommand_1.default,
        QueueCommand_1.default])
], Commands);
exports.default = Commands;
//# sourceMappingURL=index.js.map