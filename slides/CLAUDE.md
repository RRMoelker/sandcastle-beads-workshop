# CLAUDE.md

## Dev server

Run the dev server with `npm run dev`. It starts without opening a browser (no `--open` flag).

## Slide spacing convention

Every slide in `slides.md` and the included `slides/*.md` files must be spaced like this:

```
---
...
---

content
1
2
3
---
```

That is: one blank line after a slide's opening `---`/frontmatter block, then the slide's content, then exactly **three** blank lines, then the `---` that starts the next slide. Apply this consistently to every slide when editing these files.
