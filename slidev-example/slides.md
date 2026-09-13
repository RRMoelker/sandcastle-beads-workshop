---
theme: default
title: Slidev Layout Showcase
info: |
  ## Slidev Layout Showcase
  A vanilla Slidev deck demonstrating every built-in layout.
class: text-center
transition: slide-left
mdc: true
name: Title
---

# Slidev Layout Showcase

A tour of every built-in layout from [sli.dev/builtin/layouts](https://sli.dev/builtin/layouts)

---
layout: default
name: Table of Contents
hideInToc: true
---

# Table of Contents

<Toc columns="2" minDepth="1" maxDepth="1" />

---
layout: cover
background: https://picsum.photos/1920/1080?random=1
name: cover
---

# `cover`

## Full-bleed background image for opening slides

Sandcastle AI — LLM Orchestration Training

2026-09-13

---
layout: intro
name: intro
---

# `intro`

## Speaker & topic introduction

Ruurd Moelker

Dignitas — Training by Me

---
layout: default
name: default
---

# `default`

The plain default layout — a heading plus body content, left-aligned with standard padding, no special positioning.

- Bullet one
- Bullet two
- Bullet three

```ts
console.log('code blocks work the same as any other slide')
```

---
layout: center
name: center
---

# `center`

Content is centered both horizontally **and** vertically on the slide — compare this to `default`, which is left/top aligned.

Great for a single short statement or a QR code.

---
layout: full
name: full
---

# `full`

<img src="https://picsum.photos/1600/900?random=5" class="rounded" />

The slotted content receives `w-full h-full` automatically, so a single image or diagram stretches to fill all the space `default` would otherwise leave empty.

---
layout: none
name: none
---

# `none`

<div class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
  <h1 class="text-white text-5xl">No wrapper, no padding, no styling</h1>
</div>

<p class="absolute bottom-4 left-4 text-sm text-white/70">
`layout: none` renders zero slidev-layout wrapper — you own 100% of the slide's markup and CSS.
</p>

---
layout: image
image: https://picsum.photos/1920/1080?random=2
name: image
---

# `image`

Background image fills the entire slide; your content is overlaid on top of it.

---
layout: image-left
image: https://picsum.photos/800/1000?random=3
name: image-left
---

# `image-left`

Image on the left half, content on the right half.

Handy for showing a screenshot or diagram alongside explanatory text.

- Point A
- Point B
- Point C

---
layout: image-right
image: https://picsum.photos/800/1000?random=4
name: image-right
---

# `image-right`

Content on the left half, image on the right half — the mirror of `image-left`.

- Point A
- Point B
- Point C

---
layout: two-cols
name: two-cols
---

# Left column

Left column content goes here.

- Point A
- Point B
- Point C

::right::

# Right column

Right column content goes here.

- Point D
- Point E
- Point F

---
layout: two-cols-header
name: two-cols-header
---

# `two-cols-header`

A shared header spans the full width, with two independent columns below it.

::left::

## Left

- Point A
- Point B
- Point C

::right::

## Right

- Point D
- Point E
- Point F

::bottom::

<div class="text-sm opacity-50">There's also an optional ::bottom:: slot spanning both columns, aligned to the bottom of the slide.</div>

---
layout: iframe
url: https://sli.dev
name: iframe
---

---
layout: iframe-left
url: https://sli.dev
name: iframe-left
---

# `iframe-left`

Embedded live webpage on the left, your own content on the right.

- Scroll and interact with the embedded page
- Content here behaves like a normal `default` slide

---
layout: iframe-right
url: https://sli.dev
name: iframe-right
---

# `iframe-right`

Your own content on the left, embedded live webpage on the right — the mirror of `iframe-left`.

- Scroll and interact with the embedded page
- Content here behaves like a normal `default` slide

---
layout: quote
name: quote
---

# "Simplicity is the ultimate sophistication."

Leonardo da Vinci

---
layout: section
name: section
---

# Section Break

Use `layout: section` to mark the start of a new part of your talk — bigger type, centered, no bullets.

---
layout: statement
name: statement
---

# Every great presentation starts with a clear statement.

`layout: statement` — one bold sentence, nothing else competing for attention.

---
layout: fact
name: fact
---

# 100%

## of built-in layouts covered in this deck

`layout: fact` is for a single big number or fact.

---
layout: end
name: end
---

# That's all the built-in layouts!

Thanks for watching 👋
