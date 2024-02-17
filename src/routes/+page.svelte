<script lang="ts">
	import { fileData, runCommand } from '$lib';
	import CommandInput from '$lib/components/CommandInput.svelte';
	import Lines from '$lib/components/Lines.svelte';
	import { TerminalManager } from '$lib';
	import { onMount } from 'svelte';

	let terminalLines = [
		'KittenOS [Version 10.0.22621.3007]',
		'(c) Purrs and Paws Corporation. All catnaps reserved.',
		'Write "help" to get started'
	];
	let dir = ['\\'];
	let editMode = false;
	let editName: string = '';
	let terminalManager: TerminalManager;
	onMount(() => {
		const localData = JSON.parse(localStorage.getItem('data') || '');
		terminalManager = new TerminalManager(localData || fileData);
	});
	let scrollDiv: HTMLDivElement;
</script>

<svelte:window
	on:keydown={() => {
		setTimeout(() => {
			scrollDiv.scrollTo({ top: scrollDiv.scrollHeight });
		}, 50);
	}}
/>
<div
	bind:this={scrollDiv}
	class="flex flex-col justify-start items-start max-h-full h-full w-full overflow-y-auto"
>
	<Lines {terminalLines} />
	<CommandInput
		bind:dir
		{editMode}
		runCommand={(cmd) => {
			const { newLines, newDir, edit, editfile } = runCommand(
				terminalLines,
				terminalManager,
				dir,
				cmd,
				editMode,
				editName
			);
			terminalLines = newLines;
			dir = newDir;
			editMode = edit;
			editName = editfile || '';
			localStorage.setItem('data', JSON.stringify(terminalManager.fileData));
		}}
	/>
</div>
