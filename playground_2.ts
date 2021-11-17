import { ifError } from "assert";
import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import * as S from "fp-ts/string";
import { sequenceT } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { Semigroup, concatAll } from "fp-ts/lib/Semigroup";
import { concat } from "fp-ts/lib/ReadonlyNonEmptyArray";

const minLength = (s: string): E.Either<string, string> =>
  s.length >= 6 ? E.right(s) : E.left("at least 6 characters");

const oneCapital = (s: string): E.Either<string, string> =>
  /[A-Z]/g.test(s) ? E.right(s) : E.left("at least one capital letter");

const oneNumber = (s: string): E.Either<string, string> =>
  /[0-9]/g.test(s) ? E.right(s) : E.left("at least one number");

const oneSpecialChar = (s: string): E.Either<string, string> =>
  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g.test(s)
    ? E.right(s)
    : E.left("at least one special char");

const validator =
  (s: string) =>
  (...args: ((s1: string) => E.Either<string, string>)[]) => {
    if (args.length === 0) return E.right(s);

    return pipe(
      A.makeBy(args.length, (i) => args[i](s)),
      A.traverse(E.either)(E.of),

      E.map((a) =>
        a.map((e) => A.fromEither(E.swap(e))).reduce((a, b) => a.concat(b))
      ),
      E.swap,
      E.fold(
        (e) => (e.length === 0 ? E.right(s) : E.left(e)),
        (a) => a
      )
    );
  };

pipe(
  validator("")(minLength, oneCapital, oneNumber, oneSpecialChar),
  console.log
);
pipe(
  validator("!A")(minLength, oneCapital, oneNumber, oneSpecialChar),
  console.log
);
pipe(
  validator("!A123")(minLength, oneCapital, oneNumber, oneSpecialChar),
  console.log
);
pipe(
  validator("!A123asasdd")(minLength, oneCapital, oneNumber, oneSpecialChar),
  console.log
);
