<template>
	<div class="grid grid-cols-12 grid-rows-1 w-full h-full">
		<aside class="col-span-2 bg-primary"></aside>
		<div class="col-span-10 grid grid-cols-10 grid-rows-1 gap-2 items-center">
			<img v-if="image" :src="image" class="-ml-10 col-span-4 max-h-[80%] w-full object-contain" />
			<main class="col-span-6 p-0" :class="{ 'col-start-5': !image }">
				<div class="logo-wrap w-1/2 mt-1 ml-2 mb-2">
					<img :src="logo" class="w-full block" />
					<span class="ai-badge ft-10">AI</span>
				</div>
				<section
					class="title-section slidev-layout-cover p-10 mr-5 min-h-[10vh] content-start justify-items-start">
					<template v-if="$slots.title">
						<h1>
							<slot name="title" />
						</h1>
						<p>
							<slot name="subtitle" />
						</p>
					</template>
					<slot v-else />
				</section>
			</main>
		</div>
	</div>
</template>

<style lang="css">
.title-section {
	border-radius: 30% / 0% 0% 50% 0%;
	background-color: var(--se-color-highlight);
}

h1 {
	font-size: 30px;
	font-weight: bold;
}

.logo-wrap {
	position: relative;
}

.ai-badge {
	position: absolute;
	left: 35.7%;
	top: 39%;
	transform: translate(-50%, -50%) rotate(-70deg);
	background: var(--se-color-primary);
	color: white;
	font-size: 0.6em;
	font-weight: 800;
	line-height: 1;
	padding: 0.1em 0.25em;
	border-radius: 0.2em;
	box-shadow: 0 0 0 2px white;
}
</style>
<script setup lang="ts">
import darkLogo from "@dignitas/slidev-theme/assets/logos/logo-dignitas-se-breed-dark.png";
import lightLogo from "@dignitas/slidev-theme/assets/logos/logo-dignitas-se-breed.png";
import { useDarkMode } from "@slidev/client";
import { computed } from "vue";

const props = defineProps({
	image: { type: String }
});

const { isDark } = useDarkMode();
const logo = computed(() => isDark.value ? darkLogo : lightLogo);
</script>
