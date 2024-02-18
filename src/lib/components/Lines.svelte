<script lang="ts">
	export let terminalLines: string[];
</script>

{#each terminalLines as line}
	<p
		class="inline-block"
		class:text-blue-500={line.startsWith('/b')}
		class:text-white={line.startsWith('/w')}
		class:text-red-600={line.startsWith('/r')}
		class:pl-5={line.startsWith('/t')}
	>
		{line.replace(/^\/(r|w|b|t)/g, '')}
	</p>
{/each}
