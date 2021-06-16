"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = void 0;
var CONST_WORLD = 'world';
function hello(world) {
    if (world === void 0) { world = CONST_WORLD; }
    return "Hello " + world + ";";
}
exports.hello = hello;
console.log(hello());
//# sourceMappingURL=index.js.map