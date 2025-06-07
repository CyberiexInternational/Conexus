<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/room/Scene.svelte';
	import { onMount } from 'svelte';
	import Heading from '$lib/components/base/heading/Heading.svelte';

	import EditorUi from '$lib/editor/EditorUI.svelte';
	import PreviewUi from '$lib/editor/PreviewUI.svelte';
	import SignInSuccessModal from '$lib/ui/SignInSuccessModal.svelte';
	import { editorState, tryLoadingRoomFromLocalStorage } from '$lib/editor/editorState.svelte';
	import { loadRoomFromBluesky } from '$lib/room/bluesky';
	import { roomState } from '$lib/room/state.svelte';

	let loading = $state(true);

	onMount(async () => {
		// get handle from url search params
		let handle = new URLSearchParams(window.location.search).get('handle');
		if (!handle) {
			tryLoadingRoomFromLocalStorage();
			loading = false;
			editorState.isEditing = true;
			return;
		}

		await loadRoomFromBluesky(handle);

		loading = false;
	});
</script>

<div class="fixed inset-0 -z-20 h-[100dvh] w-screen">
	<Canvas>
		<Scene />
	</Canvas>
</div>

{#if editorState.isEditing}
	<EditorUi />
{:else if !loading}
	<PreviewUi />
{:else}
	<div
		class="bg-base-100 dark:bg-base-950 fixed inset-0 flex h-[100dvh] w-screen items-center justify-center"
	>
		<Heading>Loading...</Heading>
	</div>
{/if}

<SignInSuccessModal />
