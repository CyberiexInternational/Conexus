<script lang="ts">
	import type { Props } from '@threlte/core';

	import { HTML } from '@threlte/extras';
	import type { Snippet } from 'svelte';
	import type * as THREE from 'three';
	import VideoPlayer from '$lib/components/extra/video-player/VideoPlayer.svelte';

	let {
		ref = $bindable(),
		videoId,
		size = [270, 150],
		playPause = $bindable(),
		...props
	}: Props<THREE.Group> & {
		ref?: THREE.Group;
		videoId?: string;
		size?: [number, number];
		playPause?: () => void;
	} = $props();
</script>

<HTML transform bind:ref occlude="blending" scale={0.1} pointerEvents="none" {...props}>
	<div
		style="width: {size?.[0] ?? 270}px; height: {size?.[1] ?? 150}px;"
		class="touch-none select-none"
	>
		<VideoPlayer id={videoId} bind:playPause />
	</div>
</HTML>
