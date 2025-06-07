<script>
	import { Avatar } from '$lib/components/base/avatar';
	import { Button } from '$lib/components/base/button';
	import { Heading } from '$lib/components/base/heading';
	import Modal from '$lib/components/base/modal/Modal.svelte';
	import { client } from '$lib/oauth';
	import { roomState } from '$lib/room/state.svelte';
	import { modals } from '$lib/room/ui-state.svelte';
	import { editorState, tryLoadingRoomFromLocalStorage } from './editorState.svelte';
</script>

<div class="pointer-events-none fixed top-8 right-4 left-4 flex items-center justify-center gap-2">
	{#if roomState.profile?.handle}
		<Avatar src={roomState.profile?.avatar} />
	{/if}
	<Heading>
		{#if roomState.profile?.handle}
			<a
				href={`https://bsky.app/profile/${roomState.profile?.handle}`}
				target="_blank"
				class="hover:text-accent-600 dark:hover:text-accent-500 pointer-events-auto"
				>{roomState.profile.handle}'s</a
			>
		{:else}
			my
		{/if}
		room</Heading
	>
</div>

<div class="pointer-events-none fixed right-4 bottom-4 left-4 flex justify-between">
	<Button
		size="lg"
		onclick={() => {
			modals.infoModalState = true;
		}}
		variant="secondary"
	>
		Info
	</Button>

	<Button
		size="lg"
		onclick={() => {
			if (client.profile?.handle == roomState.profile?.handle) {
				editorState.isEditing = true;
				return;
			}

			tryLoadingRoomFromLocalStorage(true);

			editorState.isEditing = true;

			history.replaceState(null, '', location.pathname);
		}}
	>
		{client.profile?.handle == roomState.profile?.handle ? 'Edit room' : 'Create room'}
	</Button>
</div>

<Modal bind:open={modals.infoModalState} class="text-base-900 dark:text-base-50">
	<div>
		This is an experimental web app for creating tiny 3d rooms (and sharing them on bluesky) built
		by
		<a
			href="https://flo-bit.dev"
			target="_blank"
			class="text-accent-700 dark:text-accent-400 hover:text-accent-600 dark:hover:text-accent-500 font-medium"
			>flo-bit</a
		>
	</div>
	<div>
		It's still a work in progress, but it's open source (<a
			href="https://github.com/flo-bit/room"
			target="_blank"
			class="text-accent-700 dark:text-accent-400 hover:text-accent-600 dark:hover:text-accent-500 font-medium"
			>source code available here</a
		>), so feel free to contribute or suggest features on github 😊
	</div>

	<div>
		You can also send me a message on <a
			href="https://bsky.app/profile/flo-bit.dev"
			target="_blank"
			class="text-accent-700 dark:text-accent-400 hover:text-accent-600 dark:hover:text-accent-500 font-medium"
			>bluesky</a
		> (or tag me when sharing your room so I can admire your creation 😊)
	</div>
</Modal>
