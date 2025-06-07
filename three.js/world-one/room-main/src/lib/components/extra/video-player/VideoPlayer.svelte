<script lang="ts">
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	let {
		class: className,
		id,
		playPause = $bindable()
	}: { class?: string; id?: string; playPause?: () => void } = $props();

	playPause = () => {
		if (player?.paused) {
			player?.play();
		} else {
			player?.pause();
		}
	};

	let Plyr: typeof import('plyr') | undefined = $state();

	onMount(async () => {
		Plyr = (await import('plyr')).default;
	});

	let player: Plyr | undefined = $state();

	$effect(() => {
		if (!Plyr) return;
		if (player) return;

		player = new Plyr('.js-player', {
			controls: ['play-large']
		});

		// set the video player to the id
		if (id) {
			player.source = {
				type: 'video',
				sources: [
					{
						src: id,
						type: 'video/youtube'
					}
				]
			};
		}

		return () => {
			player?.destroy();
		};
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
</svelte:head>

{#key id}
	{#if id}
		<div
			class={cn(
				'relative aspect-video h-full w-full overflow-hidden bg-white object-cover dark:bg-black',
				className
			)}
		>
			<div
				id="player"
				class="h-full w-full overflow-hidden object-cover font-semibold text-black dark:text-white"
			>
				<div
					class="js-player plyr__video-embed"
					id="player"
					data-plyr-provider="youtube"
					data-plyr-embed-id={id}
				></div>
			</div>
		</div>
	{/if}
{/key}

<style>
	* {
		--plyr-color-main: var(--color-accent-500);
	}
</style>
