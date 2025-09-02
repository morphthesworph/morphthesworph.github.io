function integrate(f, xStart, xEnd, n = 1000) {
    const dx = (xEnd - xStart) / n;
    let sum = 0.5 * (f(xStart) + f(xEnd)); // trapezoidal endpoints

    for (let i = 1; i < n; i++) {
        const x = xStart + i * dx;
        sum += f(x);
    }

    return sum * dx;
}
// Map a math x-coordinate to canvas pixel using an arbitrary origin
function xToCanvas(x, originX, scaleX) {
    return originX + x * scaleX;
}

// Map a math y-coordinate to canvas pixel using an arbitrary origin
function yToCanvas(y, originY, scaleY) {
    return originY - y * scaleY; // Subtract because canvas y goes down
}

// Draw axes centered at a specified origin
function drawAxes(ctx, width, height, originX, originY) {
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 1;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();
}

// Generic function to draw any function f(x) on a canvas with an origin
function drawFunctionOnCanvas(canvas, f, options = {}) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Options with defaults
    const origin = options.origin ?? { x: width / 2, y: height / 2 }; // pixels
    const scaleX = options.scaleX ?? 20 / width; // objective units per pixel
    const scaleY = options.scaleY ?? 20 / height; // objective units per pixel
    const color = options.color ?? 'blue';
    const lineWidth = options.lineWidth ?? 2;
    const step = options.step ?? 1 / scaleX; // step in objective units
    

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    let first = true;
    const xMin = options.xMin ?? -origin.x / scaleX;
    const xMax = options.xMax ?? (width - origin.x) / scaleX;

    for (let x = xMin; x <= xMax; x += step) {
        const y = f(x);
        const cx = xToCanvas(x, origin.x, scaleX);
        const cy = yToCanvas(y, origin.y, scaleY);

        if (first) {
            ctx.moveTo(cx, cy);
            first = false;
        } else {
            ctx.lineTo(cx, cy);
        }
    }

    ctx.stroke();
}
function drawFunctionArc(canvas, f, xStart, xEnd, options = {}) {
    const ctx = canvas.getContext('2d');
    const origin = options.origin ?? { x: canvas.width / 2, y: canvas.height / 2 };
    const scaleX = options.scaleX ?? 420;
    const scaleY = options.scaleY ?? 40;
    const color = options.color ?? 'red';
    const lineWidth = options.lineWidth ?? 2;
    const step = options.step ?? 1 / scaleX;

    function xToCanvas(x) {
        return origin.x + x * scaleX;
    }
    function yToCanvas(y) {
        return origin.y - y * scaleY;
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    let first = true;
    for (let x = xStart; x <= xEnd; x += step) {
        const y = f(x);
        const cx = xToCanvas(x);
        const cy = yToCanvas(y);

        if (first) {
            ctx.moveTo(cx, cy);
            first = false;
        } else {
            ctx.lineTo(cx, cy);
        }
    }

    ctx.stroke();
}
function drawParametric(canvas, xFunc, yFunc, options = {}) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const origin = options.origin ?? { x: width / 2, y: height / 2 };
    const scaleX = options.scaleX ?? 40;
    const scaleY = options.scaleY ?? 40;
    const color = options.color ?? 'purple';
    const lineWidth = options.lineWidth ?? 2;
    const tStart = options.tStart ?? 0;
    const tEnd = options.tEnd ?? 10;
    const step = options.step ?? 0.01;

    function xToCanvas(x) { return origin.x + x * scaleX; }
    function yToCanvas(y) { return origin.y - y * scaleY; }

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    let first = true;
    for (let t = tStart; t <= tEnd; t += step) {
        const cx = xToCanvas(xFunc(t));
        const cy = yToCanvas(yFunc(t));

        if (first) {
            ctx.moveTo(cx, cy);
            first = false;
        } else {
            ctx.lineTo(cx, cy);
        }
    }

    ctx.stroke();
}
function drawLine(canvas, p1, p2, options = {}) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const origin = options.origin ?? { x: width / 2, y: height / 2 };
    const scaleX = options.scaleX ?? 40;
    const scaleY = options.scaleY ?? 40;
    const color = options.color ?? 'black';
    const lineWidth = options.lineWidth ?? 2;

    function xToCanvas(x) { return origin.x + x * scaleX; }
    function yToCanvas(y) { return origin.y - y * scaleY; }

    const cx1 = xToCanvas(p1.x);
    const cy1 = yToCanvas(p1.y);
    const cx2 = xToCanvas(p2.x);
    const cy2 = yToCanvas(p2.y);

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(cx1, cy1);
    ctx.lineTo(cx2, cy2);
    ctx.stroke();
}

