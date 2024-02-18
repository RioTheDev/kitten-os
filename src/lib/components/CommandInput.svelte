<script lang="ts">
	import { formatPath } from '$lib';
	export let editMode: boolean;
	export let runCommand: (cmd: string) => void;
	export let dir: string[];
	let currentCmd = '';

	function autoFocus(event: FocusEvent) {
		(event.target as HTMLInputElement).focus();
	}
	function submit(event: SubmitEvent) {
		event.preventDefault();
		runCommand(currentCmd);
		currentCmd = '';
	}
</script>

<div class="flex max-w-[100vw] w-full">
	<p class:hidden={editMode}>{formatPath(dir)}</p>
	<form on:submit={submit} class="flex-grow">
		<!-- svelte-ignore a11y-autofocus -->
		<input
			type="text"
			name="commandInput"
			autocomplete="off"
			spellcheck="false"
			autofocus
			bind:value={currentCmd}
			on:blur={autoFocus}
			class:text-white={editMode}
			class="bg-transparent outline-none w-full"
		/>
	</form>
</div>
