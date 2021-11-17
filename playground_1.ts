// getting comfortable with some basic funcitonal programming concepts
// using the Pokemon API and the fp-ts ecosystem

//

//lets create a functional wrapper around our API request
import * as D from "io-ts/Decoder";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import axios, { AxiosResponse } from "axios";
import assert from "assert";
import { string } from "fp-ts";

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
  return () =>
    axios.get<Pokemon>(url, {
      validateStatus: function (status) {
        return status === 200; //tell axios to throw if the response code is anything but OK
      },
    });
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

const fetchPokemons = (pokeIds: number[]) => {};

const getPokeData = async (pokeId: number) => {
  const pokeData = await fetchPokemon(pokeId)();
  console.log(pokeData);
};

// now we have a function fetchPokemon that returns a TaskEither<ErrorString, Pokemon>
// how can we compose this further?

// fetch an array of pokemon data in

/* (async () => {
  await getPokeData(10);
})(); */

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
