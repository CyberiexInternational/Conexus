<script lang="ts">
	import { type Props } from '@threlte/core';
	import type * as THREE from 'three';
	import { AllObjects, type RoomObjectKind } from './models';

	let {
		kind,
		selected,
		colors,
		opacity,
		scale,
		rotation,
		placement,
		isEditing,
		...restProps
	}: {
		kind: RoomObjectKind;
		selected?: boolean;
		colors?: string[];
		opacity?: number;
		rotation?: number;
		isEditing?: boolean;
		placement?: 'floor' | 'wallX' | 'wallZ';
	} & Props<THREE.Group> = $props();

	let ObjectComponent = AllObjects[kind]?.component;
</script>

{@render object()}

{#snippet object()}
	<ObjectComponent
		{...restProps}
		{colors}
		{opacity}
		{isEditing}
		scale={scale ?? AllObjects[kind]?.scale ?? 1}
		rotation={[
			placement === 'wallX' ? (rotation ?? 0) : 0,
			(placement === 'floor' ? (rotation ?? 0) : 0) + (placement === 'wallX' ? Math.PI / 2 : 0),
			placement === 'wallZ' ? (rotation ?? 0) : 0
		]}
		{placement}
	/>
{/snippet}
