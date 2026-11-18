/* function-warping.js — the diagrams on projects/FunctionWarping.html.
 * Needs graph.js loaded first.
 *
 * Example used throughout: axis function X(t) = sin(t), warped function f(x) = x.
 *   L(t) = arc length of X from 0 to t
 *   W(t) = (t, X(t)) + f(L(t)) / L'(t) * R(d/dt (t, X(t)))
 */

// Arc length L(t) of sin from 0 to T_MAX, tabulated once and linearly interpolated.
const T_MAX = 13.05;
function tabulateIntegral(f, tStart, tEnd, nSteps = 10000) {
  const dt = (tEnd - tStart) / nSteps;
  const table = [0];
  const ts = [tStart];
  let sum = 0;
  for (let i = 1; i <= nSteps; i++) {
    const t = tStart + i * dt;
    sum += 0.5 * (f(t - dt) + f(t)) * dt;
    table.push(sum);
    ts.push(t);
  }
  return t => {
    if (t <= tStart) return 0;
    if (t >= tEnd) return table[table.length - 1];
    const i = Math.floor((t - tStart) / dt);
    const frac = (t - ts[i]) / dt;
    return table[i] * (1 - frac) + table[i + 1] * frac;
  };
}
const arcLength = tabulateIntegral(z => Math.sqrt(1 + Math.cos(z) ** 2), 0, T_MAX);
const warpX = t => t - (Math.cos(t) * arcLength(t)) / Math.sqrt(1 + Math.cos(t) ** 2);
const warpY = t => Math.sin(t) + arcLength(t) / Math.sqrt(1 + Math.cos(t) ** 2);

// The warped curve for t in [0, tEnd], plus the little mirrored piece for t in [0, 1].
Graph.prototype.warpCurve = function (color, tEnd = T_MAX) {
  this.param(warpX, warpY, color, 0, tEnd);
  this.param(t => -warpX(t), t => -warpY(t), color, 0, 1);
};

// Shared base of the "first point" / tangent / orthogonal diagrams.
function pointScene(g) {
  const t = g.t0;
  g.fn(Math.sin, "purple");
  g.warpCurve("gray");
  g.line({ x: t, y: 0 }, { x: t, y: Math.sin(t) }, "cyan");
  g.line({ x: 0, y: 0 }, { x: t, y: 0 }, "red");
  return t;
}

// 1. Regular graphing: go x right, f(x) up.
onDraw("reg", g => {
  const t = g.t0;
  g.fn(x => x, "purple");
  g.line({ x: t, y: 0 }, { x: t, y: t }, "cyan");
  g.line({ x: 0, y: 0 }, { x: t, y: 0 }, "red");
  g.text("x", g.s * Math.PI / 2 + g.ox, g.h - 60, "red");
  g.text("f(x)", g.s * t + g.ox + 5, g.h - 70, "cyan");
  g.dot(t, t);
});

// 2. Warped: x' units along sin, then f(x') up.
onDraw("sinasaxis", g => {
  const t = g.t0;
  g.fn(Math.sin, "gray");
  g.arc(Math.sin, 0, t, "red");
  g.warpCurve("purple");
  g.line({ x: t, y: Math.sin(t) }, { x: warpX(t), y: warpY(t) }, "cyan");
  g.text("x'", g.s * Math.PI / 2 + g.ox, g.h - 60, "red");
  g.text("f(x')", 15 * g.w * Math.PI / 200, g.h - Math.sin(t) - 48, "cyan");
  g.dot(warpX(t), warpY(t));
});

// 3. The first point (t, sin t).
onDraw("firstpoint", g => {
  const t = pointScene(g);
  g.dot(t, Math.sin(t));
});

// 4. Tangent line at that point.
onDraw("tangent-line", g => {
  const t = pointScene(g);
  g.fn(x => Math.cos(t) * (x - t) + Math.sin(t), "yellow");
  g.dot(t, Math.sin(t));
});

// 5. Line orthogonal to the tangent (slope -1 / X'(t)).
onDraw("ortho-tangent-line", g => {
  const t = pointScene(g);
  g.fn(x => -(x - t) / Math.cos(t) + Math.sin(t), "yellow");
  g.dot(t, Math.sin(t));
});

// 6. Interactive: drag t and watch the point and its unit normal.
const slider = document.getElementById("trace");
const redrawTrace = onDraw("techdone", g => {
  const T = parseFloat(slider.value);
  const [wx, wy] = [warpX(T), warpY(T)];
  const d = Math.hypot(wx - T, wy - Math.sin(T));
  const ux = (wx - T) / d + T;                 // tip of the normalised normal vector
  const uy = (wy - Math.sin(T)) / d + Math.sin(T);

  g.fn(Math.sin, "purple");
  g.warpCurve("white", T);
  g.line({ x: T, y: 0 }, { x: T, y: Math.sin(T) }, "cyan");
  g.line({ x: 0, y: 0 }, { x: T, y: 0 }, "red");
  g.line({ x: T, y: Math.sin(T) }, { x: wx, y: wy }, "yellow");
  g.line({ x: T, y: Math.sin(T) }, { x: ux, y: Math.sin(T) }, "magenta");
  g.line({ x: ux, y: Math.sin(T) }, { x: ux, y: uy }, "green");
  g.dot(T, Math.sin(T));
  g.dot(wx, wy);
});
slider.addEventListener("input", redrawTrace);
