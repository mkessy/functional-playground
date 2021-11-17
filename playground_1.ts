// getting comfortable with some basic funcitonal programming concepts
// using the Pokemon API and the fp-ts ecosystem
//

//lets create a functional wrapper around our API request
import * as D from "io-ts/Decoder";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import * as Random from "fp-ts/Random";
import { pipe } from "fp-ts/function";
import axios, { AxiosResponse } from "axios";
import assert from "assert";
import { monoid, string } from "fp-ts";
import { Either } from "fp-ts/Either";

const pokeEndpoint = "https://pokeapi.co/api/v2/pokemon/";

//function which takes an Id: number and returns a formed pokeUrl or error

// returns an Either: right if n is an integer, left otherwise
const eitherFromInteger = (n: number): E.Either<string, number> => {
  return pipe(
    n,
    E.fromPredicate(
      (n) => Number.isInteger(n) && n >= 1,
      () => "error: value must be a positive integer"
    )
  );
};
//declare const makePokeUrl: (id: number) => E.Either<string, string>;
const makePokeUrl = (pokeId: number): E.Either<string, string> => {
  return pipe(
    pokeId,
    eitherFromInteger,
    E.chain((n) => E.right(`${pokeEndpoint}${n}`))
  );
};

//io-ts
//lets create the struct representing the fields we want from our pokemon
const PokemonDecode = D.struct({
  id: D.number,
  name: D.string,
  height: D.number,
  weight: D.number,
});

//get type of Pokemon from our Decoder struct
type Pokemon = D.TypeOf<typeof PokemonDecode>;

const axiosGet = (
  url: string
): (() => Promise<AxiosResponse<Pokemon, any>>) => {
  return () => {
    console.log(`fetching ${url}`);
    return axios.get<Pokemon>(url, {
      validateStatus: function (status) {
        return status === 200; //tell axios to throw if the response code is anything but OK
      },
      timeout: 2000,
    });
  };
};

//declare const fetchPokemon: (pokeId: number) => TE.TaskEither<String, Pokemon>;
const fetchPokemon = (pokeId: number) => {
  const url = pipe(pokeId, makePokeUrl);
  return pipe(
    url,
    TE.fromEither,
    TE.chain((url) =>
      TE.tryCatch(
        () => axiosGet(url)().then((res) => res.data),
        (reason) => `${reason}`
      )
    ),

    TE.chain((pokemon) => {
      const decodedPokemon = PokemonDecode.decode(pokemon);
      return E.isLeft(decodedPokemon)
        ? TE.left(String(decodedPokemon.left))
        : TE.right(decodedPokemon.right);
    })
  );
};

//fetch an n number of pokemons with each pokemon selected randomly (1118 total pokemon)

const fetchPokemonsTraverse = async (n: number) => {
  return pipe(
    await pipe(
      A.makeBy(n, Random.randomInt(1, 1118)),
      A.map(fetchPokemon),
      A.sequence(T.task)
    )(),
    A.map(O.fromEither),
    A.compact
  );
  // returns TaskEither<left, right[]> but fails fast)
};

/* const getPokeData = async (pokeId: number) => {
  const pokeData = await fetchPokemon(pokeId)();
}; */

// now we have a function fetchPokemon that returns a TaskEither<ErrorString, Pokemon>
// how can we compose this further?

// fetch an array of pokemon data in

(async () => {
  const pokemons = await fetchPokemonsTraverse(8);
  console.log(pokemons);
})();

//---------------TESTS---------------

assert.deepStrictEqual(
  PokemonDecode.decode({ id: 10, name: "Pokemon", height: 10, weight: 10 }),

  E.right({ id: 10, name: "Pokemon", height: 10, weight: 10 })
);
assert.deepStrictEqual(
  E.isLeft(PokemonDecode.decode({ id: 10, name: "Pokemon", height: 10 })),

  E.isLeft(E.left("left"))
);

assert.deepStrictEqual(
  makePokeUrl(10),
  E.right("https://pokeapi.co/api/v2/pokemon/10")
);
assert.deepStrictEqual(
  makePokeUrl(-1),
  E.left("error: value must be a positive integer")
);
assert.deepStrictEqual(eitherFromInteger(10), E.right(10));
assert.deepStrictEqual(
  eitherFromInteger(-1),
  E.left("error: value must be a positive integer")
);
assert.deepStrictEqual(
  eitherFromInteger(0),
  E.left("error: value must be a positive integer")
);
