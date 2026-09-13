<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { runnerStore, terminalLines, checkStatus, clearTerminal } from "../modules/runner-store";

const el = ref<HTMLElement | null>(null);
const bottom = ref<HTMLElement | null>(null);

// Whether the bottom sentinel is currently in view — i.e. the user hasn't
// scrolled up to read earlier output. Tracked natively via IntersectionObserver
// rather than manual scrollTop/scrollHeight bookkeeping.
const stickToBottom = ref(true);
let observer: IntersectionObserver | null = null;

// Runs on every mount (i.e. every time this runnable slide is shown) — cheap
// no-op if the secret hasn't changed and the stream is already connected;
// this is what keeps the single shared session wired up across navigation.
onMounted(() => {
  checkStatus();
  if (el.value && bottom.value) {
    observer = new IntersectionObserver(([entry]) => (stickToBottom.value = entry.isIntersecting), {
      root: el.value,
      threshold: 1,
    });
    observer.observe(bottom.value);
  }
  nextTick(() => bottom.value?.scrollIntoView({ block: "end" }));
});

onUnmounted(() => observer?.disconnect());

watch(
  () => terminalLines.length,
  () => {
    // Only follow new output if the user was already at the bottom — lets
    // them scroll up to read earlier commands without being yanked back down.
    if (stickToBottom.value) nextTick(() => bottom.value?.scrollIntoView({ block: "end" }));
  },
);
</script>

<template>
  <div class="demo-terminal-wrap">
    <button class="demo-terminal-clear" title="Clear terminal" @click="clearTerminal">✕</button>
    <div class="demo-terminal" ref="el">
      <div v-if="!runnerStore.status?.enabled" class="demo-terminal-empty">
        Demo runner not connected. Set the secret on the Demo config slide.
      </div>
      <div v-for="(line, i) in terminalLines" :key="i" class="demo-terminal-line" :class="line.kind">
        <pre>{{ line.text }}</pre>
      </div>
      <div ref="bottom" class="demo-terminal-bottom" />
    </div>
  </div>
</template>

<style>
/* The two-cols layout's right column is a grid item with no explicit height
   constraint of its own, so a plain `height: 100%` on our wrap doesn't reliably
   cap it — the terminal grows with its content instead of scrolling internally.
   Making the column a min-height:0 flex column (the standard fix for
   "overflow:auto box growing past its parent") pins it to the slide's height. */
.col-right {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.demo-terminal-wrap {
  position: relative;
  flex: 1 1 0;
  min-height: 0;
}
.demo-terminal {
  height: 100%;
  overflow-y: auto;
  overflow-anchor: none;
  background: #0d0d0d;
  color: #ddd;
  font-family: monospace;
  font-size: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  box-sizing: border-box;
}
.demo-terminal-bottom {
  height: 1px;
}
.demo-terminal-clear {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.15s ease;
  background: rgba(255, 255, 255, 0.1);
  color: #ddd;
  border: none;
  border-radius: 4px;
  width: 22px;
  height: 22px;
  line-height: 22px;
  font-size: 11px;
  cursor: pointer;
}
.demo-terminal-wrap:hover > .demo-terminal-clear {
  opacity: 0.7;
}
.demo-terminal-clear:hover {
  opacity: 1 !important;
}
.demo-terminal-empty {
  opacity: 0.5;
  font-style: italic;
}
.demo-terminal-line pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}
.demo-terminal-line.cmd pre {
  color: #7dd3fc;
  margin-top: 0.5rem;
}
.demo-terminal-line.err pre {
  color: #f87171;
}
.demo-terminal-line.exit-ok pre {
  color: #4ade80;
  opacity: 0.7;
}
.demo-terminal-line.exit-fail pre {
  color: #f87171;
  opacity: 0.8;
}
</style>
