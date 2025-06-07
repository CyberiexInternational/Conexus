<script lang="ts">
	import { T } from '@threlte/core';
	import { type RoomStateType } from './state.svelte';
	import RoomObject from './RoomObject.svelte';
	import { RoundedBoxGeometry } from '@threlte/extras';

	let {
		roomState = $bindable()
	}: {
		roomState: RoomStateType;
	} = $props();
</script>

<T.Group position.y={-1}>
	<T.Mesh position={[-0.05, 1 - 0.099, -roomState.size.x / 2 - 0.1]} receiveShadow castShadow>
		<RoundedBoxGeometry args={[roomState.size.z + 0.18, 2, 0.1]} radius={0.03} />
		<T.MeshStandardMaterial color={roomState.wallColor} />
	</T.Mesh>

	<T.Mesh position={[-roomState.size.z / 2 - 0.1, 1 - 0.099, -0.05]} receiveShadow castShadow>
		<RoundedBoxGeometry args={[0.1, 2, roomState.size.x + 0.18]} radius={0.03} />
		<T.MeshStandardMaterial color={roomState.wallColor} />
	</T.Mesh>

	<T.Mesh position={[-0.05, -0.0502, -0.05]} receiveShadow>
		<RoundedBoxGeometry
			args={[roomState.size.z + 0.15, 0.1, roomState.size.x + 0.15]}
			radius={0.03}
		/>
		<T.MeshStandardMaterial color={roomState.floorColor} />
	</T.Mesh>

	{#each roomState.objects as object, index (object.kind + index.toString())}
		<RoomObject {...object} />
	{/each}
</T.Group>
