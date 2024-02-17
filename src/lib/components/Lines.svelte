<script lang="ts">
	export let terminalLines: string[];
</script>

{#each terminalLines as line}
	<p
		class="inline-block"
		class:text-blue-500={line.startsWith('/d')}
		class:text-white={line.startsWith('/f')}
		class:pl-5={line.startsWith('/t')}
	>
		{new RegExp(/\/(f|d)/g).test(line)
			? line.replace(/\/(f|d)/g, '').replace('/t', '')
			: line.replace('/t', '')}
	</p>
{/each}
