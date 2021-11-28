"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var O = __importStar(require("fp-ts/Option"));
var Apply_1 = require("fp-ts/Apply");
var function_1 = require("fp-ts/function");
var NE = __importStar(require("fp-ts/lib/NonEmptyArray"));
var doubler = function (n) { return n * 2; };
var options = function (arr) { return (0, function_1.pipe)(arr, NE.map(O.of)); };
var arr = [O.of("a"), O.of("b"), O.of(1)];
(0, function_1.pipe)((0, Apply_1.sequenceT)(O.Apply)(O.of("a"), O.of("b"), O.of(1), O.of("a"), O.of("b"), O.of(1)), console.log);
