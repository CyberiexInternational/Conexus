<script lang="ts">
	import { Mesh } from 'three';
	import { useTask, useThrelte } from '@threlte/core';
	import {
		BlendFunction,
		EffectComposer,
		EffectPass,
		OutlineEffect,
		RenderPass
	} from 'postprocessing';
	import { editorState } from '$lib/editor/editorState.svelte';

	const { scene, renderer, camera, size, autoRender, renderStage } = useThrelte();

	const composer = new EffectComposer(renderer);

	const renderPass = new RenderPass(scene);
	composer.addPass(renderPass);
	$effect(() => {
		composer.setSize($size.width, $size.height);
	});

	export const outlineEffectOptions: ConstructorParameters<typeof OutlineEffect>[2] = {
		blendFunction: BlendFunction.ALPHA,
		edgeStrength: 100,
		pulseSpeed: 0.0,
		visibleEdgeColor: 0xf59e0b,
		hiddenEdgeColor: 0xf59e0b,
		blur: true
	};

	const outlineEffect = new OutlineEffect(scene, undefined, outlineEffectOptions);
	$effect(() => {
		if (!editorState.transformControls?.object) return;

		setTimeout(() => {
			outlineEffect.selection.clear();

			editorState.transformControls?.object.traverse((child) => {
				if (child instanceof Mesh) {
					outlineEffect.selection.add(child);
				}
			});
		}, 0);

		return () => {
			outlineEffect.selection.clear();
		};
	});

	const outlineEffectPass = new EffectPass(undefined, outlineEffect);
	composer.addPass(outlineEffectPass);

	$effect(() => {
		renderPass.mainCamera = $camera;
		outlineEffect.mainCamera = $camera;
		outlineEffectPass.mainCamera = $camera;
	});

	$effect(() => {
		return () => {
			composer.removeAllPasses();
			outlineEffectPass.dispose();
			renderPass.dispose();
			composer.dispose();
		};
	});

	$effect(() => {
		const last = autoRender.current;
		autoRender.set(false);
		return () => {
			autoRender.set(last);
		};
	});

	useTask(
		(delta) => {
			composer.render(delta);
		},
		{ stage: renderStage, autoInvalidate: false }
	);
</script>
