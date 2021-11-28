import { error } from "fp-ts/lib/Console";
import { pipe } from "fp-ts/lib/function";
import * as R from "graphics-ts/es6/";
import * as T from "fp-ts/Tuple";
import * as RA from "fp-ts/ReadonlyArray";
import * as C from "graphics-ts/lib/Canvas";
import * as Color from "graphics-ts/lib/Color";
import * as D from "graphics-ts/lib/Drawing";
import * as S from "graphics-ts/lib/Shape";
import * as M from "fp-ts/Monoid";
import { ReadonlyArrayType, ReadonlyType } from "io-ts";
import { cons } from "fp-ts-contrib/lib/List";

const GRID_SIZE = 25;
const canvasId = "canvas";
const canvasElem = document.getElementById(canvasId) as HTMLCanvasElement;

/* const triangle: C.Render<void> = D.render(
  D.fill(
    S.path(RA.Foldable)([S.point(75, 50), S.point(100, 75), S.point(100, 25)]),
    D.fillStyle(Color.black)
  )
); */

const nx = canvasElem.width / GRID_SIZE;
const ny = canvasElem.height / GRID_SIZE;
type GridPoint = [number, number];
const gridPoints = pipe(
  RA.makeBy(nx, (xi) =>
    RA.makeBy(ny, (yi) => [xi * GRID_SIZE, yi * GRID_SIZE] as GridPoint)
  ),
  RA.flatten
);

const sketch1 = pipe(
  gridPoints,
  RA.map((gridPoint) => S.circle(gridPoint[0], gridPoint[1], GRID_SIZE / 4)),
  RA.map((circle) => D.outline(circle, D.outlineColor(Color.black)))
);

const sketch2 = pipe(
  gridPoints,
  RA.map((gridPoint) => S.circle(gridPoint[0], gridPoint[1], GRID_SIZE / 8)),
  RA.map((circle) => D.fill(circle, D.outlineColor(Color.black)))
);

const sketch = D.translate(
  GRID_SIZE / 2,
  GRID_SIZE / 2,
  M.concatAll(D.monoidDrawing)(sketch1.concat(sketch2))
);

console.log(gridPoints);

C.renderTo(canvasId, () =>
  error(`[ERROR]: Unable to find canvas with id ${canvasId}`)
)(D.render(sketch))();
