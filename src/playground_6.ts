import * as O from "fp-ts/Option";
import * as RA from "fp-ts/ReadonlyArray";
import { sequenceT } from "fp-ts/Apply";
import { pipe } from "fp-ts/function";
import * as NE from "fp-ts/lib/NonEmptyArray";

const doubler = (n: number) => n * 2;

const options = (
  arr: NE.NonEmptyArray<string | number>
): NE.NonEmptyArray<O.Option<string | number>> => pipe(arr, NE.map(O.of));

type ArrType = NE.NonEmptyArray<
  O.Option<string> | O.Option<number> | O.None
> & { readonly 0: O.Option<any> };

const arr: ArrType = [O.of("a"), O.of("b"), O.of(1)];

pipe(
  sequenceT(O.Apply)(
    O.of("a"),
    O.of("b"),
    O.of(1),
    O.of("a"),
    O.of("b"),
    O.of(1)
  ),
  console.log
);
