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
var E = __importStar(require("fp-ts/Either"));
var A = __importStar(require("fp-ts/Array"));
var function_1 = require("fp-ts/lib/function");
var minLength = function (s) {
    return s.length >= 6 ? E.right(s) : E.left("at least 6 characters");
};
var oneCapital = function (s) {
    return /[A-Z]/g.test(s) ? E.right(s) : E.left("at least one capital letter");
};
var oneNumber = function (s) {
    return /[0-9]/g.test(s) ? E.right(s) : E.left("at least one number");
};
var oneSpecialChar = function (s) {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g.test(s)
        ? E.right(s)
        : E.left("at least one special char");
};
var validator = function (s) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 0)
            return E.right(s);
        return (0, function_1.pipe)(A.makeBy(args.length, function (i) { return args[i](s); }), A.traverse(E.either)(E.of), E.map(function (a) {
            return a.map(function (e) { return A.fromEither(E.swap(e)); }).reduce(function (a, b) { return a.concat(b); });
        }), E.swap, E.fold(function (e) { return (e.length === 0 ? E.right(s) : E.left(e)); }, function (a) { return a; }));
    };
};
(0, function_1.pipe)(validator("asdfas")(), console.log);
(0, function_1.pipe)(validator("")(minLength, oneCapital, oneNumber, oneSpecialChar), console.log);
(0, function_1.pipe)(validator("!A")(minLength, oneCapital, oneNumber, oneSpecialChar), console.log);
(0, function_1.pipe)(validator("!A123")(minLength, oneCapital, oneNumber, oneSpecialChar), console.log);
(0, function_1.pipe)(validator("!A123asasdd")(minLength, oneCapital, oneNumber, oneSpecialChar), console.log);
