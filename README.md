# morphthesworph.github.io

My personal page ("Quark"). Plain Jekyll on GitHub Pages — no build step of my own.

## Layout

```
_layouts/default.html      page shell (sidebar, head, scripts)
assets/css/style.css       site styles
assets/css/temml.css       Temml's stylesheet (+ Temml.woff2 next to it)
assets/js/temml.min.js     Temml 0.14.0
assets/js/math.js          turns $...$ / $$...$$ into math on page load
assets/js/graph.js         small canvas-graphing helper
photos/                    backgrounds + favicons
projects/                  one HTML file per project
```

Anything inside a folder starting with `_` is **not** copied to the live site
by Jekyll, so scripts/styles/fonts must live outside `_layouts/`.

## New page

```html
---
layout: default
title: My Page
bg: /photos/SomeBackground.png      # optional, defaults to BFSLDark.png
scripts:                            # optional, loaded with defer, in order
  - /assets/js/graph.js
  - /assets/js/my-page.js
---
<h1>My Page</h1>
<p>Inline math $x^2 + 1$ and display math:</p>
$$\int_0^1 x^2\,dx = \frac{1}{3}$$
```

Pages are *fragments* (front matter + body HTML); the layout supplies
`<html>`, `<head>` and `<body>`.

## Math gotchas

- Write `\lt` / `\gt` / `\&` instead of `<` / `>` / `&` inside math.
- Avoid `{{` and `{%` in LaTeX (Jekyll reads them as Liquid); write `{ {` or wrap in `{% raw %}…{% endraw %}`.
- Text inside `<code>`/`<pre>` is never rendered as math.
