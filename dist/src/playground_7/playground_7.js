"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Console_1 = require("fp-ts/lib/Console");
var function_1 = require("fp-ts/lib/function");
var RA = __importStar(require("fp-ts/ReadonlyArray"));
var C = __importStar(require("graphics-ts/lib/Canvas"));
var Color = __importStar(require("graphics-ts/lib/Color"));
var D = __importStar(require("graphics-ts/lib/Drawing"));
var S = __importStar(require("graphics-ts/lib/Shape"));
var M = __importStar(require("fp-ts/Monoid"));
var GRID_SIZE = 25;
var canvasId = "canvas";
var canvasElem = document.getElementById(canvasId);
/* const triangle: C.Render<void> = D.render(
  D.fill(
    S.path(RA.Foldable)([S.point(75, 50), S.point(100, 75), S.point(100, 25)]),
    D.fillStyle(Color.black)
  )
); */
var nx = canvasElem.width / GRID_SIZE;
var ny = canvasElem.height / GRID_SIZE;
var gridPoints = (0, function_1.pipe)(RA.makeBy(nx, function (xi) {
    return RA.makeBy(ny, function (yi) { return [xi * GRID_SIZE, yi * GRID_SIZE]; });
}), RA.flatten);
var sketch1 = (0, function_1.pipe)(gridPoints, RA.map(function (gridPoint) { return S.circle(gridPoint[0], gridPoint[1], GRID_SIZE / 4); }), RA.map(function (circle) { return D.outline(circle, D.outlineColor(Color.black)); }));
var sketch2 = (0, function_1.pipe)(gridPoints, RA.map(function (gridPoint) { return S.circle(gridPoint[0], gridPoint[1], GRID_SIZE / 8); }), RA.map(function (circle) { return D.fill(circle, D.outlineColor(Color.black)); }));
var sketch = D.translate(GRID_SIZE / 2, GRID_SIZE / 2, M.concatAll(D.monoidDrawing)(sketch1.concat(sketch2)));
console.log(gridPoints);
C.renderTo(canvasId, function () {
    return (0, Console_1.error)("[ERROR]: Unable to find canvas with id ".concat(canvasId));
})(D.render(sketch))();
