<script lang="ts">
	import { Button } from '$lib/components/base/button';
	import { AllObjects } from '$lib/room/models';
	import { client } from '$lib/oauth';
	import { roomState } from '$lib/room/state.svelte';
	import ColorPickerPopover from './ColorPickerPopover.svelte';

	import * as Popover from '$lib/components/base/popover';
	import {
		hex_to_rgb,
		okhsv_to_rgb,
		rgb_to_hex,
		rgb_to_okhsv
	} from '$lib/components/extra/color-picker/color';
	import { ColorPicker } from '$lib/components/extra/color-picker';
	import { cn } from '$lib/utils';
	import Modal from '$lib/components/base/modal/Modal.svelte';
	import { Heading, Subheading } from '$lib/components/base/heading';
	import NumberInput from '$lib/components/base/number-input/NumberInput.svelte';
	import { Input } from '$lib/components/base/input';
	import { modals } from '$lib/room/ui-state.svelte';
	import { blueskyLoginModalState } from '$lib/components/base/modal/BlueskyLoginModal.svelte';
	import { toast } from 'svelte-sonner';
	import Picker from './ObjectPicker.svelte';
	import ImageSelector from './ImageSelector.svelte';
	import { logout, saveRoomToBluesky } from '$lib/oauth/auth.svelte';
	import { onMount } from 'svelte';
	import { loadRoomFromBluesky } from '$lib/room/bluesky';
	import {
		editorState,
		saveRoomToLocalStorage,
		deleteSelectedObject,
		rotateRight,
		rotateLeft,
		applyTransformOfSelected,
		makeSelectedObjectPlacingObject
	} from './editorState.svelte';

	let lastUsedColors = $derived.by(() => {
		let colors = [];

		for (const object of roomState.objects.toReversed()) {
			for (const color of object.colors) {
				colors.push(color);
			}
		}
		// filter out  default colors (#f1f1f1, #a1a1a1)
		colors = colors.filter((color, index, self) => {
			return color !== '#f1f1f1' && color !== '#a1a1a1';
		});

		// filter out duplicates
		colors = Array.from(new Set(colors));

		// return first 14 colors
		return colors.slice(0, 14);
	});

	let okhsv = $state({ h: 180, s: 0.0, v: 0.95 });
	let okhsv2 = $state({ h: 180, s: 0.0, v: 0.95 });
	let okhsv3 = $state({ h: 180, s: 0.0, v: 0.95 });
	let okhsv4 = $state({ h: 180, s: 0.0, v: 0.95 });
	let okhsv5 = $state({ h: 180, s: 0.0, v: 0.95 });

	let okhsv_wall = $state({ h: 180, s: 0.0, v: 0.95 });
	let okhsv_floor = $state({ h: 180, s: 0.0, v: 0.95 });

	let link = $state('');

	$effect(() => {
		if (!editorState.selectedObject) return;

		okhsv = rgb_to_okhsv(hex_to_rgb(editorState.selectedObject.colors[0]));
		okhsv2 = rgb_to_okhsv(hex_to_rgb(editorState.selectedObject.colors[1]));
		okhsv3 = rgb_to_okhsv(hex_to_rgb(editorState.selectedObject.colors[2]));

		okhsv_wall = rgb_to_okhsv(hex_to_rgb(roomState.wallColor));
		okhsv_floor = rgb_to_okhsv(hex_to_rgb(roomState.floorColor));
	});

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'x') {
			deleteSelectedObject();

			if (editorState.placingObject) {
				editorState.placingObject = null;
			}
		}
		if (e.key === 'd' || e.key === 'ArrowRight') {
			rotateRight();
		} else if (e.key === 'a' || e.key === 'ArrowLeft') {
			rotateLeft();
		}

		// escape
		if (e.key === 'Escape') {
			editorState.placingObject = null;

			applyTransformOfSelected();
			editorState.selectedObject = null;
		}

		if (e.key === 'g') {
			makeSelectedObjectPlacingObject();
		}

		if (e.key === 'c') {
			// duplicate selected object
			if (editorState.selectedObject) {
				editorState.placingObject = JSON.parse(JSON.stringify(editorState.selectedObject));

				applyTransformOfSelected();
				editorState.selectedObject = null;
			}
		}
	}

	async function saveRoom() {
		applyTransformOfSelected();

		editorState.selectedObject = null;

		return saveRoomToBluesky(roomState);
	}
</script>

<Button
	class="fixed bottom-4 left-4 -z-10"
	size="iconLg"
	onclick={() => {
		modals.selectCategoryModalOpen = true;
	}}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="2.5"
		stroke="currentColor"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
	</svg>
</Button>

<div class="fixed top-4 left-4 -z-10 flex flex-col items-start gap-2">
	<Button
		size="iconLg"
		onclick={() => {
			modals.roomSettingsModalState = true;
		}}
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
			<path
				fill-rule="evenodd"
				d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
				clip-rule="evenodd"
			/>
		</svg>
	</Button>

	{#if editorState.selectedObject}
		<Button
			variant="red"
			size="icon"
			class="mt-8"
			onclick={() => {
				deleteSelectedObject();
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="size-6"
			>
				<path
					fill-rule="evenodd"
					d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
					clip-rule="evenodd"
				/>
			</svg>

			<span class="sr-only">Delete selected object</span>
		</Button>

		<Button
			size="icon"
			onclick={() => {
				makeSelectedObjectPlacingObject();
			}}
			variant="secondary"
			class="mt-4"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
				/>
			</svg>
		</Button>

		<div class="mt-2">
			<Button
				size="icon"
				onclick={() => {
					rotateLeft();
				}}
				variant="secondary"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="-scale-x-100"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
					/>
				</svg>
			</Button>

			<Button
				size="icon"
				onclick={() => {
					rotateRight();
				}}
				variant="secondary"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class=""
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
					/>
				</svg>
			</Button>
		</div>

		<ColorPickerPopover
			{lastUsedColors}
			bind:okhsv
			hex={editorState.selectedObject.colors[0]}
			onChange={(hex) => {
				if (!editorState.selectedObject) return;

				editorState.selectedObject.colors[0] = hex;
				saveRoomToLocalStorage();
			}}
		/>

		{#if AllObjects[editorState.selectedObject.kind].colors > 1}
			<ColorPickerPopover
				{lastUsedColors}
				bind:okhsv={okhsv2}
				hex={editorState.selectedObject.colors[1]}
				onChange={(hex) => {
					if (!editorState.selectedObject) return;

					editorState.selectedObject.colors[1] = hex;
					saveRoomToLocalStorage();
				}}
			/>
		{/if}

		{#if AllObjects[editorState.selectedObject.kind].colors > 2}
			<ColorPickerPopover
				{lastUsedColors}
				bind:okhsv={okhsv3}
				hex={editorState.selectedObject.colors[2]}
				onChange={(hex) => {
					if (!editorState.selectedObject) return;

					editorState.selectedObject.colors[2] = hex;
					saveRoomToLocalStorage();
				}}
			/>
		{/if}

		{#if AllObjects[editorState.selectedObject.kind].colors > 3}
			<ColorPickerPopover
				{lastUsedColors}
				bind:okhsv={okhsv4}
				hex={editorState.selectedObject.colors[3]}
				onChange={(hex) => {
					if (!editorState.selectedObject) return;

					editorState.selectedObject.colors[3] = hex;
					saveRoomToLocalStorage();
				}}
			/>
		{/if}

		{#if AllObjects[editorState.selectedObject.kind].colors > 4}
			<ColorPickerPopover
				{lastUsedColors}
				bind:okhsv={okhsv5}
				hex={editorState.selectedObject.colors[4]}
				onChange={(hex) => {
					if (!editorState.selectedObject) return;

					editorState.selectedObject.colors[4] = hex;
					saveRoomToLocalStorage();
				}}
			/>
		{/if}

		{#if AllObjects[editorState.selectedObject.kind].link}
			<Button
				size="icon"
				onclick={() => {
					modals.linkModalState = true;
				}}
				class="mt-2"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
					/>
				</svg>
			</Button>
		{/if}

		{#if AllObjects[editorState.selectedObject.kind].image}
			<ImageSelector />
		{/if}
	{/if}
</div>
<div class="fixed top-4 right-4 -z-10 flex flex-col items-end gap-2">
	{#if !client || !client.isLoggedIn}
		<Button
			onclick={() => {
				applyTransformOfSelected();

				blueskyLoginModalState.open = true;
			}}
		>
			<svg
				role="img"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				fill="currentColor"
				><path
					d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"
				/></svg
			>
			Login</Button
		>
	{:else}
		<Button
			onclick={() => {
				toast.promise(saveRoom(), {
					loading: 'Saving...',
					success: 'Room saved to your profile',
					error: 'Failed to save room, please try again'
				});
			}}>Save & Share</Button
		>
	{/if}

	<Popover.Root>
		<Popover.Trigger class={cn('mt-5 ml-1 cursor-pointer')}>
			<div
				class="border-base-300 dark:border-base-700 z-10 size-8 rounded-full border"
				style={`background-color: ${roomState.wallColor};`}
			></div>
		</Popover.Trigger>
		<Popover.Content side="right" sideOffset={10}>
			<ColorPicker
				bind:okhsv={okhsv_wall}
				on:change={(e) => {
					const rgb = okhsv_to_rgb(okhsv_wall);
					roomState.wallColor = rgb_to_hex(rgb);
					saveRoomToLocalStorage();
				}}
			/>
		</Popover.Content>
	</Popover.Root>

	<Popover.Root>
		<Popover.Trigger class={cn('mt-5 ml-1 cursor-pointer')}>
			<div
				class="border-base-300 dark:border-base-700 z-10 size-8 rounded-full border"
				style={`background-color: ${roomState.floorColor};`}
			></div>
		</Popover.Trigger>
		<Popover.Content side="right" sideOffset={10}>
			<ColorPicker
				bind:okhsv={okhsv_floor}
				on:change={(e) => {
					const rgb = okhsv_to_rgb(okhsv_floor);
					roomState.floorColor = rgb_to_hex(rgb);
					saveRoomToLocalStorage();
				}}
			/>
		</Popover.Content>
	</Popover.Root>
</div>

<Modal bind:open={modals.roomSettingsModalState}>
	<div class="flex flex-col items-start gap-4">
		<Heading>Room settings</Heading>

		<div class="mt-4 flex gap-2">
			<Button
				variant="secondary"
				onclick={() => {
					applyTransformOfSelected();
					editorState.selectedObject = null;
					// @ts-ignore
					roomState.profile = client.profile;
					editorState.isEditing = false;
					modals.roomSettingsModalState = false;
				}}
			>
				Stop editing & Preview
			</Button>

			{#if client.isLoggedIn}
				<Button
					variant="secondary"
					onclick={async () => {
						await logout();
						window.location.reload();
					}}
				>
					Logout
				</Button>
			{/if}
		</div>

		<Subheading class="mt-2">Room Size</Subheading>
		<div class="flex items-center gap-2">
			<NumberInput
				bind:value={roomState.size.x}
				min={1}
				max={3}
				onchange={() => saveRoomToLocalStorage()}
			/>
			<span class="text-accent-700 dark:text-accent-300">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="3"
					stroke="currentColor"
					class="size-4"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
			</span>
			<NumberInput
				bind:value={roomState.size.z}
				min={1}
				max={3}
				onchange={() => saveRoomToLocalStorage()}
			/>
		</div>
		<Subheading>Export</Subheading>

		<div class="flex flex-wrap gap-2">
			<Button
				variant="secondary"
				onclick={async () => {
					const json = JSON.stringify(roomState, null, 2);
					const blob = new Blob([json], { type: 'application/json' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = 'room.json';
					a.click();
				}}
			>
				Export as json
			</Button>

			<Button
				variant="secondary"
				onclick={async () => {
					document.dispatchEvent(new Event('exportSTL'));
				}}
			>
				Export as stl
			</Button>
		</div>

		<Subheading class="mt-2">Danger zone</Subheading>
		<div class="mt-4 flex flex-wrap gap-2">
			<Button
				variant="red"
				onclick={() => {
					const file = document.createElement('input');
					file.type = 'file';
					file.accept = '.json';
					file.onchange = (e) => {
						// @ts-ignore
						if (!e.target?.files) {
							console.error('no files found');
							return;
						}
						// @ts-ignore
						const file = e.target.files[0];
						const reader = new FileReader();
						reader.onload = (e) => {
							if (!e.target?.result) {
								console.error('no result found');
								return;
							}

							const json = JSON.parse(e.target.result as string);
							roomState.floorColor = json.floorColor;
							roomState.wallColor = json.wallColor;
							roomState.objects = json.objects;
							roomState.size = json.size;
							roomState.id = json.id;
							roomState.version = json.version;

							saveRoomToLocalStorage();
						};
						reader.readAsText(file);
					};
					file.click();
				}}
			>
				Import from json
			</Button>

			{#if client.isLoggedIn}
				<Button
					variant="red"
					onclick={async () => {
						if (!client.profile?.handle) {
							console.error('no handle found');
							return;
						}
						await loadRoomFromBluesky(client.profile.handle);
						modals.roomSettingsModalState = false;
					}}
				>
					Load from bluesky
				</Button>
			{/if}

			<Button
				variant="red"
				onclick={() => {
					roomState.objects = [];
					editorState.selectedObject = null;
					roomState.size = { x: 2, z: 3 };
					roomState.wallColor = '#f1f1f1';
					roomState.floorColor = '#a1a1a1';

					saveRoomToLocalStorage();
					modals.roomSettingsModalState = false;
				}}
			>
				Clear room
			</Button>
		</div>
	</div>
</Modal>

<Modal bind:open={modals.linkModalState}>
	<div class="flex flex-col gap-4">
		<Subheading class="mb-4">Enter a youtube link:</Subheading>
		<Input bind:value={link} placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
		<Button
			onclick={() => {
				modals.linkModalState = false;
				if (!link || !editorState.selectedObject) return;

				editorState.selectedObject.link = link;
			}}>Save</Button
		>
	</div>
</Modal>

<Modal bind:open={modals.successModalState}>
	<Heading class="flex items-center gap-4">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="text-accent-600 dark:text-accent-400 size-8"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
			/>
		</svg>

		Room saved to your profile</Heading
	>
	<Button
		size="lg"
		class="mt-4 py-3"
		href={'https://bsky.app/intent/compose?text=' +
			encodeURIComponent(
				`Check out my tiny room: https://flo-bit.dev/room/?handle=${client.profile?.handle}`
			)}
		target="_blank"
	>
		<svg
			role="img"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			fill="currentColor"
			><path
				d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"
			/></svg
		>
		Share on Bluesky</Button
	>

	<Button
		variant="secondary"
		class="py-3"
		onclick={() => {
			navigator.clipboard.writeText(`https://flo-bit.dev/room/?handle=${client.profile?.handle}`);
			toast.success('Share link copied to clipboard');
		}}
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
			<path
				fill-rule="evenodd"
				d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z"
				clip-rule="evenodd"
			/>
		</svg>

		Copy share link</Button
	>
</Modal>

<Picker bind:selectCategoryModalOpen={modals.selectCategoryModalOpen} />
