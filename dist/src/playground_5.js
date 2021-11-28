"use strict";
// Paginator with Reader
// IO-TS Codecs
// sequenceT ?
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
var countPerPage = function (countPerPage) {
    return function (deps) {
        return countPerPage <= 0 || countPerPage >= deps.limit
            ? deps.limit
            : countPerPage;
    };
};
var totalPageCount = function () { return function (deps) {
    return deps.totalCount % deps.limit === 0
        ? Math.floor(deps.totalCount / deps.limit)
        : Math.floor(deps.totalCount / deps.limit) + 1;
}; };
var makePaginator = function (deps) {
    return function (count) { return function (pageNum) {
        var tpp = totalPageCount()(deps);
        var cpp = countPerPage(count)(deps);
        if (pageNum > tpp)
            return O.none;
        if (pageNum < 0)
            return O.none;
        return O.some(deps.makePageUrl(cpp, cpp * pageNum));
    }; };
};
var makePageUrl = function (count, offset) {
    return "https://pokeapi.co/api/v2/pokemon?offset=".concat(offset, "&limit=").concat(count);
};
var pokePaginator = makePaginator({
    totalCount: 1118,
    limit: 20,
    makePageUrl: makePageUrl,
})(10);
console.log(pokePaginator(10));
console.log(pokePaginator(0));
console.log(pokePaginator(1));
console.log(pokePaginator(2));
console.log(pokePaginator(-1));
console.log(pokePaginator(1209));
