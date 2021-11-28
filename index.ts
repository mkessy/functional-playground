import { error } from "fp-ts/lib/Console";
import { pipe } from "fp-ts/lib/function";
import * as R from "graphics-ts/es6/";
import * as RA from "fp-ts/ReadonlyArray";
import * as C from "graphics-ts/lib/Canvas";
import * as Color from "graphics-ts/lib/Color";
import * as D from "graphics-ts/lib/Drawing";
import * as S from "graphics-ts/lib/Shape";
import { ReadonlyArrayType, ReadonlyType } from "io-ts";

const canvasId = "canvas";

const triangle: C.Render<void> = D.render(
  D.fill(
    S.path(RA.Foldable)([S.point(75, 50), S.point(100, 75), S.point(100, 25)]),
    D.fillStyle(Color.black)
  )
);

C.renderTo(canvasId, () =>
  error(`[ERROR]: Unable to find canvas with id ${canvasId}`)
)(triangle)();
