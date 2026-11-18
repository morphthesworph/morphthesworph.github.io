/* graph.js — tiny canvas graphing helper.
 *
 * Usage:
 *   onDraw("my-canvas-id", g => {
 *     g.fn(Math.sin, "purple");
 *     g.dot(1, Math.sin(1));
 *   });
 *
 * The callback re-runs whenever the window is resized. Coordinates you pass in
 * are graph units (x right, y up) with the origin near the lower-left corner;
 * `g.s` pixels = 1 unit.
 */
class Graph {
  constructor(canvas) {
    // Match the drawing buffer to the CSS size (this also clears the canvas).
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    this.ctx = canvas.getContext("2d");
    this.w = canvas.width;
    this.h = canvas.height;
    this.s = 40;              // pixels per unit
    this.ox = this.w * 0.05;  // origin, in pixels
    this.oy = this.h * 0.9;
    this.t0 = this.w / 200;   // "current" x/t used by the demos (scales with window width)

    const { ctx } = this;
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, this.oy);
    ctx.lineTo(this.w, this.oy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.ox, 0);
    ctx.lineTo(this.ox, this.h);
    ctx.stroke();
  }

  px(x) { return this.ox + x * this.s; }
  py(y) { return this.oy - y * this.s; }

  // Stroke a polyline sampled from lo..hi in steps of `step`; point(u) -> [x, y].
  _path(color, lo, hi, step, point) {
    const { ctx } = this;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    let first = true;
    for (let u = lo; u <= hi; u += step) {
      const [x, y] = point(u);
      if (first) ctx.moveTo(this.px(x), this.py(y));
      else ctx.lineTo(this.px(x), this.py(y));
      first = false;
    }
    ctx.stroke();
  }

  // y = f(x) across the visible width
  fn(f, color) {
    this._path(color, -this.ox / this.s, (this.w - this.ox) / this.s, 1 / this.s, x => [x, f(x)]);
  }

  // y = f(x) for x in [a, b]
  arc(f, a, b, color) {
    this._path(color, a, b, 1 / this.s, x => [x, f(x)]);
  }

  // (fx(t), fy(t)) for t in [a, b]
  param(fx, fy, color, a, b) {
    this._path(color, a, b, 0.01, t => [fx(t), fy(t)]);
  }

  line(p, q, color) {
    const { ctx } = this;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.px(p.x), this.py(p.y));
    ctx.lineTo(this.px(q.x), this.py(q.y));
    ctx.stroke();
  }

  dot(x, y, color = "white") {
    const { ctx } = this;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.px(x), this.py(y), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  // Text at a *pixel* position.
  text(str, x, y, color) {
    this.ctx.font = "12px Arial, sans-serif";
    this.ctx.fillStyle = color;
    this.ctx.fillText(str, x, y);
  }
}

// Draw now and again on every resize. Returns the redraw function.
function onDraw(canvasId, draw) {
  const canvas = document.getElementById(canvasId);
  const run = () => draw(new Graph(canvas));
  run();
  window.addEventListener("resize", run);
  return run;
}
