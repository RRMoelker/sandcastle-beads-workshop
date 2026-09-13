<script setup lang="ts">
import { onMounted } from "vue";
import { runnerStore, checkCwd, checkStatus } from "../modules/runner-store";

onMounted(checkStatus);
</script>

<template>
  <div class="runner-config">
    <template v-if="runnerStore.status?.enabled">
      <label class="block text-sm opacity-70 mb-2">Runner secret (paste from your .env)</label>
      <input
        v-model="runnerStore.secret"
        type="password"
        placeholder="SLIDEV_RUNNER_SECRET"
        autocomplete="off"
        class="w-full px-3 py-2 rounded border border-gray-500/40 bg-transparent font-mono text-sm mb-4"
        @change="checkStatus"
      />

      <label class="block text-sm opacity-70 mb-2">Working directory for demo commands</label>
      <div class="flex gap-2 items-center">
        <div
          class="flex-1 flex items-center px-3 py-2 rounded border border-gray-500/40 bg-transparent font-mono text-sm overflow-hidden"
        >
          <span class="opacity-50 whitespace-nowrap">{{ runnerStore.status?.parentPath }}/</span>
          <input
            v-model="runnerStore.subpath"
            type="text"
            placeholder="demo-repo"
            class="flex-1 min-w-0 bg-transparent outline-none"
          />
        </div>
        <button
          class="px-3 py-2 rounded border border-gray-500/40 text-sm"
          :disabled="runnerStore.checking"
          @click="checkCwd"
        >
          {{ runnerStore.checking ? "Checking…" : "Validate" }}
        </button>
      </div>
      <p v-if="runnerStore.checkResult === true" class="text-green-500 text-sm mt-2">
        ✓ Directory exists — ready to run demo commands here.
      </p>
      <p v-if="runnerStore.checkResult === false" class="text-red-500 text-sm mt-2">
        ✗ {{ runnerStore.checkError || "Not found. Check the path and try again." }}
      </p>
      <p class="text-xs opacity-50 mt-4">
        Commands only ever run on this machine (the one serving the deck via <code>npm run dev</code>).
      </p>
    </template>

    <template v-else>
      <p class="text-sm opacity-70">
        Demo runner is not enabled on the server (or the secret above doesn't match yet).
      </p>
      <p class="text-xs opacity-50 mt-2">
        See the "Enabling the demo runner" slide at the end of the deck to set
        <code>SLIDEV_RUNNER_PARENT_PATH</code> and <code>SLIDEV_RUNNER_SECRET</code>, then paste the
        secret below.
      </p>
      <input
        v-model="runnerStore.secret"
        type="password"
        placeholder="SLIDEV_RUNNER_SECRET"
        autocomplete="off"
        class="w-full px-3 py-2 rounded border border-gray-500/40 bg-transparent font-mono text-sm mt-4"
        @change="checkStatus"
      />
      <button class="px-3 py-2 rounded border border-gray-500/40 text-sm mt-2" @click="checkStatus">
        Retry
      </button>
    </template>
  </div>
</template>
