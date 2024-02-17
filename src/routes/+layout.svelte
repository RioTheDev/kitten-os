<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	let color: string;
	onMount(() => {
		color = localStorage.getItem('text-color') || '#4AF626';
	});
</script>

<main
	style:color
	class="max-w-[100vw] w-screen overflow-clip font-consolas h-screen max-h-screen bg-black font-light text-xs md:text-xl p-2 py-5"
>
	<slot />
</main>
