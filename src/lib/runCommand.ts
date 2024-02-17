import { TerminalManager, formatPath, type FileInterface } from '$lib';
import { helpText } from './help';

export function runCommand(
	terminalLines: string[],
	terminalManager: TerminalManager,
	dir: string[],
	cmd: string,
	edit: boolean,
	editName: string
) {
	let newLines: string[] = [];
	const [cmdName, ...args] = cmd.split(' ');
	let editmode = edit;
	if (!editmode) {
		terminalLines = [...terminalLines, formatPath(dir, cmd)];

		switch (cmdName) {
			case 'color':
				newLines.push(...terminalManager.color(args[0]).newLines);
				break;
			case 'help':
				newLines.push(...helpText.split('\n'));
				break;
			case 'reset':
				localStorage.clear();
				window.location.reload();
				break;
			case 'touch':
				newLines.push(...terminalManager.touch(dir, args[0]).newLines);
				break;
			case 'edit':
				const editAns = terminalManager.edit(dir, args[0]);
				newLines.push(...editAns.newLines);
				editmode = editAns.edit;
				editName = args[0];
				break;
			case 'rm':
				newLines.push(...terminalManager.rm(dir, args[0]).newLines);
				break;
			case 'mkdir':
				newLines.push(...terminalManager.mkdir(dir, args[0]).newLines);
				break;
			case 'cat':
				newLines.push(...terminalManager.cat(dir, args[0]).newLines);
				break;
			case 'clear':
				terminalLines = terminalLines.slice(0, 2);
				break;
			case 'cd':
				const ans = terminalManager.cd(dir, args[0]);
				dir = ans.dir;
				newLines.push(...ans.newLines);
				break;
			case 'ls':
				newLines.push(...terminalManager.ls(dir).newLines);
				break;
			default:
				newLines.push(
					`"${cmdName}" is not recognized as an internal or external command,`,
					'operable paw-gram or batch fur.',
					'write "help" to see all commands!'
				);
		}
		terminalLines = [...terminalLines, ...newLines];
		return { newLines: terminalLines, newDir: dir, edit: editmode, editfile: editName };
	}

	if (cmd == 'save_file') {
		editmode = false;
	} else {
		const { currentPaths, currentDir } = terminalManager.getCurrentDir(dir);
		const file = currentPaths.find((x) => x.route == editName);
		if (!file || file.type != 'file') {
			return { newLines: terminalLines, newDir: dir, edit: false };
		}
		(currentDir?.paths[currentPaths.indexOf(file)] as FileInterface).data += cmd + '\n';
		newLines.push('/f' + cmd);
	}
	terminalLines = [...terminalLines, ...newLines];

	return { newLines: terminalLines, newDir: dir, edit: editmode, editfile: editName };
}
