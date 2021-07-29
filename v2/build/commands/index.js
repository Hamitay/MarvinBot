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
const PlayCommand_1 = __importDefault(require("./PlayCommand"));
const SampleCommand_1 = __importDefault(require("./SampleCommand"));
let Commands = class Commands {
    constructor(sampleCommand, playCommand) {
        const commandList = [sampleCommand, playCommand];
        this._commandMap = this._registerCommands(commandList);
    }
    _registerCommands(commands) {
        const map = new Map();
        commands.forEach(command => {
            map.set(command.getDirective(), command);
        });
        return map;
    }
    executeCommand(commandDirective, args, message) {
        const command = this._commandMap.get(commandDirective);
        if (command) {
            return command.execute(message, args);
        }
        return new Promise((resolve) => resolve('error m8'));
    }
};
Commands = __decorate([
    tsyringe_1.injectable(),
    __metadata("design:paramtypes", [SampleCommand_1.default, PlayCommand_1.default])
], Commands);
exports.default = Commands;
//# sourceMappingURL=index.js.map