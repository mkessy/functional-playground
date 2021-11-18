// consider a type representing a paginated url response
// for the Pokemon API

import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";
import * as S from "fp-ts/string";
import * as A from "fp-ts/Array";
import * as RA from "fp-ts/ReadonlyNonEmptyArray";
import * as RO from "fp-ts/ReadonlyArray";

type PaginatedPokeResponse = {
  count: number; // total count of the requested resource
  offset: number;
  next?: string;
  previous?: string;
  limit: number;
};

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

  return [offset, limit];
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

console.log(paginator(1118, 20)(20)(5));
console.log(
  reverseGetPageUrl("https://pokeapi.co/api/v2/pokemon?offset=100&limit=20")
);
