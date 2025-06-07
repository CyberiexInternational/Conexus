<script lang="ts">
	import * as THREE from 'three';
	import { T } from '@threlte/core';
	import { roomState } from './state.svelte';
	import RoomObject from './RoomObject.svelte';
	import { Grid, RoundedBoxGeometry, TransformControls } from '@threlte/extras';
	import {
		getPossiblePlacementForPlacingObject,
		editorState,
		placeObject,
		applyTransformOfSelected
	} from '$lib/editor/editorState.svelte';

	type PointerEvent = {
		stopPropagation: () => void;
		point: { x: number; y: number; z: number };
		normal: { x: number; y: number; z: number };
	};
</script>

<T.Group position.y={-1}>
	<T.Mesh
		onpointermove={(e: PointerEvent) => {
			if (getPossiblePlacementForPlacingObject() !== 'wall') return;

			e.stopPropagation();

			if (editorState.placingObject) {
				editorState.placingObject.placement = 'wallZ';
				editorState.placingObject.position = [e.point.x, e.point.y + 1, e.point.z];
			}
		}}
		onclick={(e: PointerEvent) => {
			if (getPossiblePlacementForPlacingObject() !== 'wall') return;

			e.stopPropagation();

			if (editorState.placingObject) {
				editorState.placingObject.placement = 'wallZ';
				placeObject({ x: e.point.x, y: e.point.y + 1, z: e.point.z });
			}
		}}
		position={[-0.05, 1 - 0.099, -roomState.size.x / 2 - 0.1]}
		receiveShadow
		castShadow
		ondblclick={() => {
			if (editorState.selectedObject) {
				applyTransformOfSelected();

				editorState.selectedObject = null;
			}
		}}
	>
		<RoundedBoxGeometry args={[roomState.size.z + 0.18, 2, 0.1]} radius={0.03} />
		<T.MeshStandardMaterial color={roomState.wallColor} />
	</T.Mesh>

	<T.Mesh
		onpointermove={(e: PointerEvent) => {
			if (getPossiblePlacementForPlacingObject() !== 'wall') return;

			e.stopPropagation();

			if (editorState.placingObject) {
				editorState.placingObject.placement = 'wallX';
				editorState.placingObject.position = [e.point.x, e.point.y + 1, e.point.z];
			}
		}}
		onclick={(e: PointerEvent) => {
			if (getPossiblePlacementForPlacingObject() !== 'wall') return;

			e.stopPropagation();

			if (editorState.placingObject) {
				editorState.placingObject.placement = 'wallX';
				placeObject({ x: e.point.x, y: e.point.y + 1, z: e.point.z });
			}
		}}
		position={[-roomState.size.z / 2 - 0.1, 1 - 0.099, -0.05]}
		receiveShadow
		castShadow
		ondblclick={() => {
			if (editorState.selectedObject) {
				applyTransformOfSelected();

				editorState.selectedObject = null;
			}
		}}
	>
		<RoundedBoxGeometry args={[0.1, 2, roomState.size.x + 0.18]} radius={0.03} />
		<T.MeshStandardMaterial color={roomState.wallColor} />
	</T.Mesh>

	<Grid
		gridSize={[roomState.size.z * 2, roomState.size.x * 2]}
		scale={0.5}
		sectionThickness={0}
		name="grid"
	/>

	<T.Mesh
		position={[-0.05, -0.0502, -0.05]}
		onpointermove={(e: PointerEvent) => {
			if (getPossiblePlacementForPlacingObject() !== 'floor') return;

			e.stopPropagation();

			if (editorState.placingObject) {
				editorState.placingObject.position = [e.point.x, e.point.y + 1, e.point.z];
			}
		}}
		onclick={(e: PointerEvent) => {
			if (getPossiblePlacementForPlacingObject() !== 'floor') return;

			e.stopPropagation();

			placeObject({ x: e.point.x, y: e.point.y + 1, z: e.point.z });
		}}
		ondblclick={() => {
			if (editorState.selectedObject) {
				applyTransformOfSelected();

				editorState.selectedObject = null;
			}
		}}
		receiveShadow
	>
		<RoundedBoxGeometry
			args={[roomState.size.z + 0.15, 0.1, roomState.size.x + 0.15]}
			radius={0.03}
		/>
		<!-- <T.BoxGeometry args={[roomState.size.z, 0.1, roomState.size.x]} /> -->
		<T.MeshStandardMaterial color={roomState.floorColor} />
	</T.Mesh>

	{#each roomState.objects as object, index (object.kind + index.toString())}
		{#if editorState.selectedObject === object}
			<TransformControls
				bind:controls={editorState.transformControls}
				position={object.position}
				showX={object.placement !== 'wallX'}
				showZ={object.placement !== 'wallZ'}
				rotation={[
					object.placement === 'wallX' ? object.rotation : 0,
					object.placement === 'floor' ? object.rotation : 0,
					object.placement === 'wallZ' ? object.rotation : 0
				]}
				enableRotate={false}
				onchange={(e) => {
					if (!e.target || !e.target.object) return;

					e.target.object.position.clamp(
						new THREE.Vector3(-roomState.size.z / 2 - 0.1, 0, -roomState.size.x / 2 - 0.1),
						new THREE.Vector3(roomState.size.z / 2 + 0.1, 2, roomState.size.x / 2 + 0.1)
					);
				}}
			>
				<RoomObject
					kind={object.kind}
					colors={object.colors}
					placement={object.placement}
					image={object.image}
					isEditing
				/>
			</TransformControls>
		{:else}
			<T.Group
				onclick={(evt: PointerEvent) => {
					if (editorState.placingObject) {
						if (getPossiblePlacementForPlacingObject() !== 'floor') return;

						evt.stopPropagation();
						placeObject({ x: evt.point.x, y: evt.point.y + 1, z: evt.point.z });
						return;
					}
					evt.stopPropagation();

					applyTransformOfSelected();

					editorState.selectedObject = null;

					setTimeout(() => {
						editorState.selectedObject = object;
					}, 0);
				}}
				onpointermove={(e: PointerEvent) => {
					if (editorState.placingObject) {
						if (getPossiblePlacementForPlacingObject() !== 'floor') return;

						editorState.placingObject.position = [e.point.x, e.point.y + 1, e.point.z];
						e.stopPropagation();
					}
				}}
			>
				<RoomObject {...object} isEditing />
			</T.Group>
		{/if}
	{/each}

	{#if editorState.placingObject}
		<RoomObject
			isEditing
			{...editorState.placingObject}
			colors={['#f1f1f1', '#f1f1f1', '#f1f1f1', '#f1f1f1', '#f1f1f1']}
			opacity={0.8}
		/>
	{/if}
</T.Group>
