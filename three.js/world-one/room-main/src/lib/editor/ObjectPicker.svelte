<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { View } from '@threlte/extras';
	import Scene from './ObjectPreviewScene.svelte';
	import { objectCategories, visibleObjects, type RoomObjectKind } from '$lib/room/models';
	import Button from '$lib/components/base/button/Button.svelte';
	import Modal from '$lib/components/base/modal/Modal.svelte';
	import Subheading from '$lib/components/base/heading/Subheading.svelte';
	import { editorState, applyTransformOfSelected } from './editorState.svelte';

	let items: { kind: string; dom: HTMLElement | undefined }[] = $state([]);

	$effect(() => {
		items = Object.entries(visibleObjects)
			.filter(([kind, object]) => object.category === category)
			.map(([kind, object]) => ({
				kind: kind,
				dom: undefined
			}));
	});

	let open = $state(false);

	let categoryIndex = $state(0);
	let category = $derived(objectCategories[categoryIndex]);

	function humanReadableName(key: string): string {
		// Remove a common prefix if present (adjust if your keys differ)
		let name = key.replace(/^kaykit-furniture-kit-/, '');
		name = name.replace(/^tiny-treats-bubbly-bathroom-/, '');
		// Replace underscores and dashes with spaces
		name = name.replace(/[-_]+/g, ' ');
		// Capitalize the first letter of each word
		return name
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	let { selectCategoryModalOpen = $bindable(false) }: { selectCategoryModalOpen: boolean } =
		$props();

	async function addObject(kind: RoomObjectKind) {
		if (editorState.placingObject) {
			editorState.placingObject = null;

			// wait 10 ms
			await new Promise((resolve) => setTimeout(resolve, 10));
		}

		applyTransformOfSelected();

		setTimeout(() => {
			editorState.selectedObject = null;
		}, 0);

		editorState.placingObject = {
			kind: kind,
			position: [0, 0, 0],
			rotation: 0,
			colors: ['#f1f1f1', '#f1f1f1', '#f1f1f1', '#f1f1f1', '#f1f1f1'],
			placement: 'floor'
		};
	}
</script>

<Modal bind:open={selectCategoryModalOpen} class="z-[100]">
	<Subheading class="mb-4">Add some furniture:</Subheading>
	<div class="grid grid-cols-2 gap-4">
		{#each objectCategories as category, i}
			<Button
				onclick={() => {
					categoryIndex = i;
					open = true;
					selectCategoryModalOpen = false;
				}}>{category}</Button
			>
		{/each}
	</div>
</Modal>

{#if open}
	<button
		class="fixed inset-0 bg-black/50"
		aria-label="Close"
		onclick={() => {
			open = false;
		}}
	></button>
{/if}

{#key category}
	<div
		class={[
			'bg-base-100 dark:bg-base-900 relative isolate mx-2 my-4 h-full min-h-[80dvh] overscroll-y-none rounded-2xl p-4 sm:mx-20 md:mt-20',
			open ? 'block' : 'hidden'
		]}
	>
		<Button
			size="iconLg"
			class="absolute top-4 left-4 z-[100]"
			onclick={() => {
				open = false;
				selectCategoryModalOpen = true;
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
			</svg>
		</Button>
		<div
			class="relative mx-auto grid h-full max-w-4xl grid-cols-2 gap-4 overflow-y-scroll overscroll-y-none md:grid-cols-3 lg:grid-cols-4"
		>
			{#each items as item, i}
				<button
					id="item"
					class="hover:bg-base-200/40 dark:hover:bg-base-800/40 m-4 inline-block cursor-pointer rounded-2xl p-4 transition-all duration-300 hover:scale-105"
					onclick={() => {
						addObject(item.kind as RoomObjectKind);
						open = false;
					}}
				>
					<div class="aspect-square" bind:this={item.dom}></div>
					<div class="text-base-700 dark:text-base-300 text-sm">{humanReadableName(item.kind)}</div>
				</button>
			{/each}
		</div>
	</div>

	<div id="canvas" class="pointer-events-none fixed top-0 h-full w-full">
		<Canvas>
			{#each items as item}
				<View dom={item.dom}>
					<Scene kind={item.kind} />
				</View>
			{/each}
		</Canvas>
	</div>
{/key}
