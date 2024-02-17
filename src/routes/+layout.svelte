<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	let color: string;
	onMount(() => {
		color = localStorage.getItem('text-color') || '#4AF626';
	});
</script>

<svelte:head>
	<title>KittenOS</title>
	<meta name="keywords" content="KittenOS, terminal, cmd" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<meta
		name="description"
		content="Play around with KittenOS where cats help you manage your files!"
	/>
</svelte:head>
<main
	style:color
	class="max-w-[100vw] w-screen overflow-clip font-consolas h-screen max-h-screen bg-black font-light text-xs md:text-xl p-2 py-5"
>
	<slot />
</main>
