<script setup lang="ts">
import { ref } from "vue";
import { runnerStore, enqueue, b64ToUtf8 } from "../modules/runner-store";

const props = defineProps<{ codeB64: string }>();

const justQueued = ref(false);

async function run() {
  await enqueue(b64ToUtf8(props.codeB64));
  justQueued.value = true;
  setTimeout(() => (justQueued.value = false), 500);
}
</script>

<template>
  <div class="runnable-wrap">
    <button
      class="runnable-btn"
      :title="runnerStore.cwd ? `Queue in ${runnerStore.cwd}` : 'Set a working directory first'"
      @click="run"
    >
      {{ justQueued ? "✓" : "▶" }}
    </button>
    <slot />
  </div>
</template>

<style>
.runnable-wrap {
  position: relative;
}
.runnable-wrap > .runnable-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.15s ease;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  line-height: 24px;
  font-size: 11px;
  cursor: pointer;
}
.runnable-wrap:hover > .runnable-btn {
  opacity: 0.85;
}
.runnable-wrap > .runnable-btn:hover {
  opacity: 1;
}
</style>
