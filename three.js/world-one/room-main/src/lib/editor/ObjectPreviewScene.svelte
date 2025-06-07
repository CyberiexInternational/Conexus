<script lang="ts">
	import RoomObject from '$lib/room/RoomObject.svelte';
	import { T, useTask } from '@threlte/core';
	import { Align, interactivity } from '@threlte/extras';

	interactivity();
	let { kind } = $props();

	let rotation = $state(0);

	useTask((delta) => {
		if (rotating) {
			rotation += delta;
		}
	});

	let rotating = false;
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 2]} fov={50} near={1} far={10}
></T.PerspectiveCamera>

<T.HemisphereLight args={[0xaaaaaa, 0x444444, 1]} />
<T.DirectionalLight args={[0xffffff, 1]} position={[1, 1, 1]} />

<T.Group rotation={[0.5, rotation + 0.5, 0]}>
	<RoomObject
		onpointerenter={() => {
			rotating = true;
		}}
		onpointerleave={() => {
			rotating = false;
		}}
		{kind}
		scale={0.4}
		colors={['#fbcfe8', '#f472b6', '#db2777', '#9d174d', '#500724']}
	/>
</T.Group>
