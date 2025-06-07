<script lang="ts">
	import { deleteImage, getAllImageNames, getImage, openDB, saveImage } from '$lib/room/images.svelte';
	import { onMount } from 'svelte';
	import * as Popover from '$lib/components/base/popover';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/base/button';
	import { editorState } from './editorState.svelte';

	// Open the IndexedDB on component mount
	onMount(async () => {
		await openDB();

		loadImages();
	});

	// Save the selected image
	async function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			for (const file of target.files) {
				const compressedFile = await compressImage(file);
				saveImage(new Date().getTime().toString() + crypto.randomUUID(), compressedFile);
			}
			await loadImages();

			// select the first image
			if (images.length > 0) {
				handleSelectImage(images[0]);
			}
		}
	}

	export function compressImage(file: File, maxSize: number = 100 * 1024): Promise<Blob> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			const reader = new FileReader();

			reader.onload = (e) => {
				if (!e.target?.result) {
					return reject(new Error('Failed to read file.'));
				}
				img.src = e.target.result as string;
			};

			reader.onerror = (err) => reject(err);
			reader.readAsDataURL(file);

			img.onload = () => {
				let width = img.width;
				let height = img.height;
				const maxDimension = 512;

				if (width > maxDimension || height > maxDimension) {
					if (width > height) {
						height = Math.round((maxDimension / width) * height);
						width = maxDimension;
					} else {
						width = Math.round((maxDimension / height) * width);
						height = maxDimension;
					}
				}

				console.log('Width:', width);
				console.log('Height:', height);

				// Create a canvas to draw the image
				const canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext('2d');
				if (!ctx) return reject(new Error('Failed to get canvas context.'));
				ctx.drawImage(img, 0, 0, width, height);

				// Function to try compressing at a given quality
				let quality = 1.0;
				function attemptCompression() {
					canvas.toBlob(
						(blob) => {
							if (!blob) {
								return reject(new Error('Compression failed.'));
							}
							// If the blob is under our size limit, or quality is too low, resolve it
							if (blob.size <= maxSize || quality < 0.5) {
								console.log('Compression successful. Blob size:', blob.size);
								console.log('Quality:', quality);
								resolve(blob);
							} else {
								// Otherwise, reduce the quality and try again
								quality -= 0.1;
								attemptCompression();
							}
						},
						'image/jpeg',
						quality
					);
				}

				attemptCompression();
			};

			img.onerror = (err) => reject(err);
		});
	}

	let images = $state<
		{
			name: string;
			url: string;
		}[]
	>([]);

	let inputRef = $state<HTMLInputElement | null>(null);

	async function loadImages() {
		const names = await getAllImageNames();
		images = (
			await Promise.all(
				names.map(async (name) => ({
					name,
					url: await getImage(name)
				}))
			)
		).sort((a, b) => b.name.localeCompare(a.name));
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'copy';
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		const file = event.dataTransfer?.files[0];
		if (file) {
			handleFileChange({ target: { files: [file] } } as unknown as Event);
		}
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'none';
		}
	}

	async function handleSelectImage(image: { name: string; url: string }) {
		if (editorState.selectedObject) {
			editorState.selectedObject.image = 'local:' + image.name;
		}
	}
</script>

<Popover.Root>
	<Popover.Trigger class={cn('mt-2 cursor-pointer')}>
		<div
			class={buttonVariants({
				size: 'icon'
			})}
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
					d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
				/>
			</svg>
		</div>
	</Popover.Trigger>
	<Popover.Content side="left" sideOffset={10}>
		<div class="text-base-900 dark:text-base-50 max-w-xl p-4">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				ondragover={handleDragOver}
				ondrop={handleDrop}
				ondragleave={handleDragLeave}
				onclick={() => {
					inputRef?.click();
				}}
				class="dark:bg-accent-600/5 hover:bg-accent-400/10 dark:hover:bg-accent-600/10 border-accent-400 bg-accent-400/5 dark:border-accent-800 flex h-24 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed p-4 transition-colors duration-200"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="text-accent-600 dark:text-accent-400 size-10"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
					/>
				</svg>

				<span class="text-accent-600 dark:text-accent-400 font-medium"
					>Drag and drop or browse to upload image</span
				>

				<input
					type="file"
					accept="image/*"
					onchange={handleFileChange}
					class="hidden"
					multiple
					bind:this={inputRef}
				/>
			</div>

			<div class="mt-4 grid grid-cols-3 gap-4">
				{#each images as image}
					<div
						class={cn(
							'border-base-200 dark:border-base-800 relative isolate aspect-square rounded-2xl border object-cover',
							editorState.selectedObject?.image === image.url
								? 'border-accent-600 dark:border-accent-400'
								: ''
						)}
					>
						<img
							src={image.url}
							alt="Loaded from IndexedDB"
							class="absolute inset-0 h-full w-full overflow-hidden rounded-2xl object-cover"
						/>

						<button
							onclick={() => {
								deleteImage(image.name);
								loadImages();
							}}
							class="bg-accent-600/10 dark:bg-accent-400/10 text-accent-600 dark:text-accent-400 absolute -top-2 -left-2 z-10 flex size-6 cursor-pointer items-center justify-center rounded-full p-1 backdrop-blur-sm"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
							</svg>

							<span class="sr-only">Delete</span>
						</button>

						<button
							onclick={() => handleSelectImage(image)}
							class="absolute inset-0 cursor-pointer"
						>
							<span class="sr-only">select image</span>
						</button>
					</div>
				{/each}
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
