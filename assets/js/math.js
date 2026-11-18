/* Render LaTeX with Temml (temml.min.js must load first).
 *
 *   inline:   $x^2$   or  \( x^2 \)
 *   display:  $$x^2$$ or  \[ x^2 \]
 *
 * Need a literal dollar sign? Put it inside a <code> tag (those are skipped),
 * or write &#36;.
 * Inside HTML, write \lt and \gt instead of < and >, and \& instead of &.
 */
document.addEventListener("DOMContentLoaded", () => {
  temml.renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false },
      { left: "$", right: "$", display: false }, // must come after $$
    ],
  });
});
