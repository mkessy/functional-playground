"use strict";
// consider a type representing a paginated url response
// for the Pokemon API
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var O = __importStar(require("fp-ts/Option"));
var function_1 = require("fp-ts/lib/function");
var S = __importStar(require("fp-ts/string"));
var D = __importStar(require("io-ts/Decoder"));
var A = __importStar(require("fp-ts/Array"));
var TE = __importStar(require("fp-ts/TaskEither"));
var RA = __importStar(require("fp-ts/ReadonlyNonEmptyArray"));
var RO = __importStar(require("fp-ts/ReadonlyArray"));
var Prism_1 = require("monocle-ts/lib/Prism");
var assert_1 = __importDefault(require("assert"));
var axios_1 = __importDefault(require("axios"));
var PokemonDecode = D.struct({
    id: D.number,
    name: D.string,
    height: D.number,
    weight: D.number,
});
// knowing the limit and count we should be able to create a function that
// generates a url for the next x items
var makePageUrl = function (count, offset) {
    return "https://pokeapi.co/api/v2/pokemon?offset=".concat(offset, "&limit=").concat(count);
};
var reverseGetPageUrl = function (urlStr) {
    var _a = (0, function_1.pipe)(urlStr, S.split("?"), RA.tail, RO.chain(S.split("&")), RO.map(S.split("=")), RO.map(RO.tail), RO.traverse(O.option)(function (a) { return a; }), RO.fromOption, RO.chain(function (a) { return RO.flatten(a); }), RO.map(parseInt)), offset = _a[0], limit = _a[1];
    return offset / limit;
};
var makePaginator = function (totalCount, limit) {
    if (limit === void 0) { limit = 20; }
    return function (countPerPage) {
        countPerPage =
            countPerPage <= 0 || countPerPage >= limit ? limit : countPerPage;
        var totalPageCount = totalCount % limit === 0
            ? Math.floor(totalCount / limit)
            : Math.floor(totalCount / limit) + 1; // extra page with remainder
        return function (page) {
            if (page > totalPageCount)
                return O.none;
            if (page < 0)
                return O.none;
            return O.some(makePageUrl(countPerPage, countPerPage * page));
        };
    };
};
var axiosGet = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("fetching ".concat(url));
        return [2 /*return*/, axios_1.default
                .get(url, {
                validateStatus: function (status) {
                    return status === 200; //tell axios to throw if the response code is anything but OK
                },
                timeout: 2000,
            })
                .then(function (res) { return res.data; })];
    });
}); };
var axiosGetTask = TE.tryCatchK(axiosGet, function (reason) { return "".concat(reason); });
var fetchPokemonPage = function (pageUrl) {
    return (0, function_1.pipe)(axiosGetTask(pageUrl), TE.map(function (pokePage) { return pokePage; }));
};
var loadPokemonPage = function (paginator) { return function (pageNumber) {
    return (0, function_1.pipe)(paginator(pageNumber), O.fold(function () { return TE.left("Failed to generate url for page = ".concat(pageNumber)); }, function (url) { return fetchPokemonPage(url); }), TE.map(function (pokePage) { return pokePage.results; }));
}; };
var totalPages = 1118;
var pokePerPage = 10;
var limit = 20;
var pokePaginator = makePaginator(totalPages, limit)(pokePerPage);
var pokePaginatorPrism = (0, Prism_1.prism)(pokePaginator, reverseGetPageUrl);
var pagesAround = function (pagesAround, maxPages) { return function (page) {
    return (0, function_1.pipe)(A.makeBy(pagesAround * 2, function (i) { return page - pagesAround + i; }), A.filter(function (_page) { return _page >= 0 && _page !== page && _page <= maxPages; }), A.map(pokePaginatorPrism.getOption), A.sequence(O.option));
}; };
var paginateAndLoad = function (totalCount, limit) {
    var paginator = makePaginator(totalCount, limit);
    return function (countPerPage) {
        return (0, function_1.pipe)(countPerPage, paginator, loadPokemonPage);
    };
};
var paginateAndLoader = paginateAndLoad(1118, 20);
paginateAndLoader(5)(19)().then(function (a) { return console.log(a); });
//--------TESTS--------
var count = 1118;
assert_1.default.deepStrictEqual(makePaginator(count, 20)(20)(reverseGetPageUrl("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20")), O.some("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20"));
assert_1.default.deepStrictEqual(makePaginator(count, 20)(20)(reverseGetPageUrl("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20")), O.some("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20"));
assert_1.default.ok(O.isNone(makePaginator(count, 20)(20)(-1)));
assert_1.default.ok(O.isNone(makePaginator(count, 20)(20)(200123)));
assert_1.default.deepStrictEqual(makePaginator(count, 20)(20)(reverseGetPageUrl("https://pokeapi.co/api/v2/pokemon?offset=20&limit=20")), O.some("https://pokeapi.co/api/v2/pokemon?offset=20&limit=20"));
assert_1.default.deepStrictEqual(makePaginator(count, 20)(20)(reverseGetPageUrl("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20")), O.some("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20"));
assert_1.default.deepStrictEqual(makePaginator(count, 20)(20)(reverseGetPageUrl("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20")), O.some("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20"));
assert_1.default.deepStrictEqual(makePaginator(count, 20)(20)(reverseGetPageUrl("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20")), O.some("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20"));
