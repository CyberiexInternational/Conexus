<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { T, useThrelte } from '@threlte/core';
	import { Environment, OrbitControls } from '@threlte/extras';
	import { interactivity } from '@threlte/extras';
	import { ACESFilmicToneMapping } from 'three';
	import { STLExporter } from 'three/examples/jsm/Addons.js';

	import Room from './Room.svelte';
	import Outline from './Outline.svelte';
	import EditingRoom from './EditingRoom.svelte';
	import { roomState } from './state.svelte';
	import { applyTransformOfSelected, editorState } from '$lib/editor/editorState.svelte';
	interactivity();

	const { renderer, scene } = useThrelte();

	let lightIntensity = $state(0.4);

	onMount(() => {
		renderer.toneMapping = ACESFilmicToneMapping;
		renderer.toneMappingExposure = 0.5;

		let lightModeEnvIntensity = 0.4;
		let darkModeEnvIntensity = 0.1;

		let lightModeLightIntensity = 2;
		let darkModeLightIntensity = 0.3;

		scene.environmentIntensity = window.matchMedia('(prefers-color-scheme: dark)').matches
			? darkModeEnvIntensity
			: lightModeEnvIntensity;
		lightIntensity = window.matchMedia('(prefers-color-scheme: dark)').matches
			? darkModeLightIntensity
			: lightModeLightIntensity;

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			scene.environmentIntensity = e.matches ? darkModeEnvIntensity : lightModeEnvIntensity;
			lightIntensity = e.matches ? darkModeLightIntensity : lightModeLightIntensity;
		});

		// Listen for export event
		document.addEventListener('exportSTL', exportSTL);
	});

	async function exportSTL() {
		const exporter = new STLExporter();

		// apply transform
		applyTransformOfSelected();

		editorState.selectedObject = null;
		editorState.placingObject = null;

		// wait 1 frame
		await new Promise((resolve) => setTimeout(resolve, 1));

		// Clone the scene to avoid modifying the original
		const sceneCopy = scene.clone();

		// Rotate the entire scene copy (convert from Y-up to Z-up)
		sceneCopy.rotation.x = Math.PI / 2;
		sceneCopy.updateMatrixWorld(true); // Apply the transformation

		// Remove the grid from the scene
		const grid = sceneCopy.getObjectByName('grid');
		if (grid) {
			grid.removeFromParent();
		}

		// Export the modified copy
		const stlString = exporter.parse(sceneCopy);
		const blob = new Blob([stlString], { type: 'application/sla' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'room.stl';
		link.click();
	}
</script>

<T.PerspectiveCamera
	makeDefault
	position={[3, 3, 3]}
	oncreate={(ref) => {
		ref.lookAt(0, 0, 0);
	}}
>
	<OrbitControls
		maxDistance={20}
		maxPolarAngle={Math.PI / 2}
		maxAzimuthAngle={2}
		minAzimuthAngle={-1}
	/>
</T.PerspectiveCamera>

{#key roomState.id}
	{#if editorState.isEditing}
		<EditingRoom />
	{:else}
		<Room {roomState} />
	{/if}
{/key}

<T.DirectionalLight position={[0, 10, 10]} intensity={lightIntensity} castShadow />
<T.DirectionalLight position={[-10, 5, 0]} intensity={lightIntensity} castShadow />
<T.AmbientLight intensity={0.1} />

<Outline />

<Environment isBackground={false} url={base + '/env/workshop.jpg'} />
