// Paginator with Reader
// IO-TS Codecs
// sequenceT ?

import { pipe } from "fp-ts/function";
import * as R from "fp-ts/Reader";
import * as O from "fp-ts/Option";
import { deepStrictEqual } from "assert";

// integrating with React

// totalCount is the total number of the resource we want to paginate
// limit is the highest number of items we can request per API call
// countPerPage is the number of resources we want displayed per page

// dependencies are totalCount: number, limit: number, makePageUrl(count, offset) => string

interface PaginatorDependencies {
  totalCount: number;
  limit: number;
  makePageUrl: (count: number, offset: number) => string;
}

type Paginator = (countPerPage: number) => (page: number) => O.Option<string>;

const countPerPage =
  (countPerPage: number): R.Reader<PaginatorDependencies, number> =>
  (deps) => {
    return countPerPage <= 0 || countPerPage >= deps.limit
      ? deps.limit
      : countPerPage;
  };

const totalPageCount =
  (): R.Reader<PaginatorDependencies, number> => (deps) => {
    return deps.totalCount % deps.limit === 0
      ? Math.floor(deps.totalCount / deps.limit)
      : Math.floor(deps.totalCount / deps.limit) + 1;
  };

const makePaginator: R.Reader<PaginatorDependencies, Paginator> = (deps) => {
  return (count: number) => (pageNum: number) => {
    const tpp = totalPageCount()(deps);
    const cpp = countPerPage(count)(deps);

    if (pageNum > tpp) return O.none;
    if (pageNum < 0) return O.none;
    return O.some(deps.makePageUrl(cpp, cpp * pageNum));
  };
};

const makePageUrl = (count: number, offset: number) => {
  return `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${count}`;
};

const pokePaginator = makePaginator({
  totalCount: 1118,
  limit: 20,
  makePageUrl,
})(10);

console.log(pokePaginator(10));
console.log(pokePaginator(0));
console.log(pokePaginator(1));
console.log(pokePaginator(2));
console.log(pokePaginator(-1));
console.log(pokePaginator(1209));
