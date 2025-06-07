<script lang="ts">
	import '../app.css';

	import { onMount } from 'svelte';
	import { initClient, login } from '$lib/oauth';
	import BlueskyLoginModal from '$lib/components/base/modal/BlueskyLoginModal.svelte';
	import Head from '$lib/components/base/head/Head.svelte';
	import { base } from '$app/paths';
	import { Toaster } from '$lib/components/base/sonner';

	let { children } = $props();

	onMount(() => {
		initClient();
	});
</script>

{@render children()}

<BlueskyLoginModal {login} />

<Head
	emojiFavicon="🏠"
	title="my room"
	description="my tiny bluesky room"
	image={base + '/og-image.jpg'}
/>

<Toaster />
