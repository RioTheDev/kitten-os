export const commandHelp = [
	'help - displays all the commands (obviously)',
	'reset - resets all saved data!',
	'ls - lists every file/folder in the current directory',
	'cd <name> - changes th directory to the specified one',
	'mkdir <name> - creates a directory with the specified name',
	'touch <name> - creates a file with the specified name',
	'cat <name> - reads out the file with the specified name',
	'edit <name> - lets u edit the specified file',
	'rm <name> - deletes the specified file/directory',
	'run <name> - runs the specified file as javascript',
	'clear - clears the console',
	'color <color> - change the color of the text'
];
export const helpText = [
	'These are all the commands the kittens can help you with!',
	...commandHelp.map((x) => '/t' + x)
];
