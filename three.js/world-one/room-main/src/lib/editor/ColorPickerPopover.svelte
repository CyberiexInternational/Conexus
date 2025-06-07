<script lang="ts">
	import * as Popover from '$lib/components/base/popover';
	import ColorPicker, { type OKhsv } from '$lib/components/extra/color-picker';
	import {
		hex_to_rgb,
		okhsv_to_rgb,
		rgb_to_hex,
		rgb_to_okhsv
	} from '$lib/components/extra/color-picker/color';
	import { cn } from '$lib/utils';

	let {
		okhsv = $bindable({
			h: 0,
			s: 0,
			v: 0
		}),
		hex,
		onChange,
		lastUsedColors = []
	}: {
		okhsv: OKhsv;
		hex: string;
		onChange: ((hex: string) => void) | undefined;
		lastUsedColors?: string[];
	} = $props();
</script>

<Popover.Root>
	<Popover.Trigger class={cn('mt-2 cursor-pointer')}>
		<div
			class="border-base-300 dark:border-base-700 z-10 size-8 rounded-full border"
			style={`background-color: ${hex};`}
		></div>
	</Popover.Trigger>
	<Popover.Content side="left" sideOffset={10}>
		<ColorPicker
			bind:okhsv
			on:change={(e) => {
				const rgb = okhsv_to_rgb(okhsv);
				const hex = rgb_to_hex(rgb);
				onChange?.(hex);
			}}
		/>

		{#if lastUsedColors.length > 0}
			<div class="text-base-800 dark:text-base-200 mx-4 mb-2 text-sm font-medium">
				Colors of last placed
			</div>
			<div class="mx-4 mb-2 flex gap-2">
				<!-- last used colors -->
				<div class="flex flex-wrap gap-2">
					{#each lastUsedColors as color}
						<button
							onclick={() => {
								okhsv = rgb_to_okhsv(hex_to_rgb(color));
								onChange?.(color);
							}}
							class="border-base-300 dark:border-base-700 size-6 cursor-pointer rounded-full border"
							style={`background-color: ${color};`}
						>
							<span class="sr-only">change to {color}</span>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>
