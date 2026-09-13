<script setup lang="ts">
import { ref } from "vue";
import { runnerStore, enqueue, b64ToUtf8 } from "../modules/runner-store";

const props = defineProps<{ codeB64: string }>();
const code = b64ToUtf8(props.codeB64);

const justQueued = ref(false);

async function run() {
  await enqueue(code);
  justQueued.value = true;
  setTimeout(() => (justQueued.value = false), 500);
}
</script>

<template>
  <span class="runnable-inline-wrap">
    <code>{{ code }}</code>
    <button
      class="runnable-inline-btn"
      :title="runnerStore.cwd ? `Queue in ${runnerStore.cwd}` : 'Set a working directory first'"
      @click="run"
    >
      {{ justQueued ? "✓" : "▶" }}
    </button>
  </span>
</template>

<style>
.runnable-inline-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.runnable-inline-wrap > .runnable-inline-btn {
  opacity: 0;
  transition: opacity 0.15s ease;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  border-radius: 3px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 9px;
  cursor: pointer;
  vertical-align: middle;
}
.runnable-inline-wrap:hover > .runnable-inline-btn {
  opacity: 0.85;
}
.runnable-inline-wrap > .runnable-inline-btn:hover {
  opacity: 1;
}
</style>
