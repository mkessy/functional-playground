"use strict";
// getting comfortable with some basic funcitonal programming concepts
// using the Pokemon API and the fp-ts ecosystem
//
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
//lets create a functional wrapper around our API request
var D = __importStar(require("io-ts/Decoder"));
var TE = __importStar(require("fp-ts/TaskEither"));
var T = __importStar(require("fp-ts/Task"));
var O = __importStar(require("fp-ts/Option"));
var E = __importStar(require("fp-ts/Either"));
var A = __importStar(require("fp-ts/Array"));
var Random = __importStar(require("fp-ts/Random"));
var function_1 = require("fp-ts/function");
var axios_1 = __importDefault(require("axios"));
var assert_1 = __importDefault(require("assert"));
var pokeEndpoint = "https://pokeapi.co/api/v2/pokemon/";
//function which takes an Id: number and returns a formed pokeUrl or error
// returns an Either: right if n is an integer, left otherwise
var eitherFromInteger = function (n) {
    return (0, function_1.pipe)(n, E.fromPredicate(function (n) { return Number.isInteger(n) && n >= 1; }, function () { return "error: value must be a positive integer"; }));
};
//declare const makePokeUrl: (id: number) => E.Either<string, string>;
var makePokeUrl = function (pokeId) {
    return (0, function_1.pipe)(pokeId, eitherFromInteger, E.chain(function (n) { return E.right("".concat(pokeEndpoint).concat(n)); }));
};
//io-ts
//lets create the struct representing the fields we want from our pokemon
var PokemonDecode = D.struct({
    id: D.number,
    name: D.string,
    height: D.number,
    weight: D.number,
});
var axiosGet = function (url) {
    return function () {
        console.log("fetching ".concat(url));
        return axios_1.default.get(url, {
            validateStatus: function (status) {
                return status === 200; //tell axios to throw if the response code is anything but OK
            },
            timeout: 2000,
        });
    };
};
//declare const fetchPokemon: (pokeId: number) => TE.TaskEither<String, Pokemon>;
var fetchPokemon = function (pokeId) {
    var url = (0, function_1.pipe)(pokeId, makePokeUrl);
    return (0, function_1.pipe)(url, TE.fromEither, TE.chain(function (url) {
        return TE.tryCatch(function () { return axiosGet(url)().then(function (res) { return res.data; }); }, function (reason) { return "".concat(reason); });
    }), TE.chain(function (pokemon) {
        var decodedPokemon = PokemonDecode.decode(pokemon);
        return E.isLeft(decodedPokemon)
            ? TE.left(String(decodedPokemon.left))
            : TE.right(decodedPokemon.right);
    }));
};
//fetch an n number of pokemons with each pokemon selected randomly (1118 total pokemon)
//this method fails if the number n is too high as too high of concurrency crashses
var fetchPokemonsTraverse = function (n) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = function_1.pipe;
                return [4 /*yield*/, (0, function_1.pipe)(A.makeBy(n, Random.randomInt(1, 1118)), A.traverse(T.task)(fetchPokemon))()];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), A.map(O.fromEither),
                    A.compact])];
        }
    });
}); };
/* const getPokeData = async (pokeId: number) => {
  const pokeData = await fetchPokemon(pokeId)();
}; */
// now we have a function fetchPokemon that returns a TaskEither<ErrorString, Pokemon>
// how can we compose this further?
// fetch an array of pokemon data in
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var pokemons;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchPokemonsTraverse(8)];
            case 1:
                pokemons = _a.sent();
                console.log(pokemons);
                return [2 /*return*/];
        }
    });
}); })();
//---------------TESTS---------------
assert_1.default.deepStrictEqual(PokemonDecode.decode({ id: 10, name: "Pokemon", height: 10, weight: 10 }), E.right({ id: 10, name: "Pokemon", height: 10, weight: 10 }));
assert_1.default.deepStrictEqual(E.isLeft(PokemonDecode.decode({ id: 10, name: "Pokemon", height: 10 })), E.isLeft(E.left("left")));
assert_1.default.deepStrictEqual(makePokeUrl(10), E.right("https://pokeapi.co/api/v2/pokemon/10"));
assert_1.default.deepStrictEqual(makePokeUrl(-1), E.left("error: value must be a positive integer"));
assert_1.default.deepStrictEqual(eitherFromInteger(10), E.right(10));
assert_1.default.deepStrictEqual(eitherFromInteger(-1), E.left("error: value must be a positive integer"));
assert_1.default.deepStrictEqual(eitherFromInteger(0), E.left("error: value must be a positive integer"));
