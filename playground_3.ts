// consider a type representing a paginated url response
// for the Pokemon API

import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";
import * as S from "fp-ts/string";
import * as D from "io-ts/Decoder";
import * as Ord from "fp-ts/Ord";
import * as A from "fp-ts/Array";
import * as N from "fp-ts/number";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as RA from "fp-ts/ReadonlyNonEmptyArray";
import * as RO from "fp-ts/ReadonlyArray";
import { modify, modifyF, prism } from "monocle-ts/lib/Prism";
import { Option } from "fp-ts/Option";
import assert from "assert";
import axios, { AxiosResponse } from "axios";
import { Int } from "io-ts";
import { Applicative } from "fp-ts/lib/Applicative";

type PaginatedPokeResponse = {
  count: number; // total count of the requested resource
  offset: number;
  next?: string;
  previous?: string;
  limit: number;
};

const PokemonDecode = D.struct({
  id: D.number,
  name: D.string,
  height: D.number,
  weight: D.number,
});

//get type of Pokemon from our Decoder struct
type Pokemon = D.TypeOf<typeof PokemonDecode>;

// knowing the limit and count we should be able to create a function that
// generates a url for the next x items

const makePageUrl = (count: number, offset: number) => {
  return `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${count}`;
};

const reverseGetPageUrl = (urlStr: string) => {
  const [offset, limit] = pipe(
    urlStr,
    S.split("?"),
    RA.tail,
    RO.chain(S.split("&")),
    RO.map(S.split("=")),
    RO.map(RO.tail),
    RO.traverse(O.option)((a) => a),
    RO.fromOption,
    RO.chain((a) => RO.flatten(a)),
    RO.map(parseInt)
  );

  return offset / limit;
};

type PokemonPaginatedPage = {
  count: number;
  next?: string;
  previous: string;
  results: {
    name: string;
    url: string;
  }[];
};

const paginator =
  (totalCount: number, limit: number = 20) =>
  (countPerPage: number) => {
    const totalPageCount =
      totalCount % limit === 0
        ? Math.floor(totalCount / limit)
        : Math.floor(totalCount / limit) + 1;

    return (page: number): O.Option<string> => {
      if (page > totalPageCount) return O.none;
      if (page < 0) return O.none;

      return O.some(makePageUrl(countPerPage, countPerPage * page));
    };
  };

const axiosGet = <T>(url: string): (() => Promise<AxiosResponse<T, any>>) => {
  return () => {
    console.log(`fetching ${url}`);
    return axios.get<T>(url, {
      validateStatus: function (status) {
        return status === 200; //tell axios to throw if the response code is anything but OK
      },
      timeout: 2000,
    });
  };
};

const fetchPokemonPage = (
  pageNumber: number
): TE.TaskEither<string, PokemonPaginatedPage> => {
  return pipe(
    pokePaginatorPrism.getOption(pageNumber),
    O.fold(
      () => TE.left("error getting url"),
      (url) => TE.right(url)
    ),
    TE.chain((url) =>
      TE.tryCatch(
        () => axiosGet<PokemonPaginatedPage>(url)().then((res) => res.data),
        (reason) => `${reason}`
      )
    )
    /*  TE.chain((aUrl) => TE.tryCatch(
        () => axiosGet()().then((res) => res.data),
        (reason) => `${reason}` */
  );
};
const totalPages = 1118;
const pokePerPage = 10;
const limit = 20;

const pokePaginator = paginator(totalPages, limit)(pokePerPage);
const pokePaginatorPrism = prism(pokePaginator, reverseGetPageUrl);
const pagesAround: Applicative<Array<number>> =
  (pagesAround: number, maxPages: number) => (page: number) => {
    const pages = pipe(
      A.makeBy(pagesAround * 2, (i) => page - pagesAround + i),
      A.filter((_page) => _page >= 0 && _page !== page && _page <= maxPages),
      A.Apply
    );

    return modifyF((n: number) => pages);
  };

//--------TESTS--------
const count = 1118;

assert.deepStrictEqual(
  paginator(count, 20)(20)(
    reverseGetPageUrl("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20")
  ),
  O.some("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20")
);
assert.deepStrictEqual(
  paginator(count, 20)(20)(
    reverseGetPageUrl("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20")
  ),
  O.some("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20")
);
assert.ok(O.isNone(paginator(count, 20)(20)(-1)));
assert.ok(O.isNone(paginator(count, 20)(20)(200123)));
assert.deepStrictEqual(
  paginator(count, 20)(20)(
    reverseGetPageUrl("https://pokeapi.co/api/v2/pokemon?offset=20&limit=20")
  ),
  O.some("https://pokeapi.co/api/v2/pokemon?offset=20&limit=20")
);

assert.deepStrictEqual(
  paginator(count, 20)(20)(
    reverseGetPageUrl("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20")
  ),
  O.some("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20")
);
assert.deepStrictEqual(
  paginator(count, 20)(20)(
    reverseGetPageUrl("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20")
  ),
  O.some("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20")
);
assert.deepStrictEqual(
  paginator(count, 20)(20)(
    reverseGetPageUrl("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20")
  ),
  O.some("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20")
);
