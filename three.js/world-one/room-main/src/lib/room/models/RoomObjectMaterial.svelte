<script lang="ts">
	import { T, type Props } from '@threlte/core';
	import { defaultColorImage, defaultColors } from './types';
	import type { MeshStandardMaterial } from 'three';

	let {
		index,
		colors,
		opacity,
		youtube,
		isImage,
		...props
	}: {
		index?: number;
		colors?: string[];
		opacity?: number;
		youtube?: string;
	} & Props<MeshStandardMaterial> = $props();

	function getColor() {
		return colors?.[index ?? 0] ?? defaultColors[index ?? 0];
	}
</script>

<T.MeshStandardMaterial
	color={getColor()}
	{opacity}
	transparent={opacity ? opacity < 1 : false}
	{...props}
/>
