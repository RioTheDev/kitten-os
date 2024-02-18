import { fileData } from '$lib';
import { commandHelp } from './help';
import type { FileInterface, RouteInterface } from './interfaces/routes.interface';
import tinyColor from 'tinycolor2';
export class TerminalManager {
	fileData: RouteInterface[] = [];
	constructor(terminalLines: string[]) {
		const data = localStorage.getItem('data');
		if (data) {
			this.fileData = JSON.parse(data);
		} else {
			this.fileData = fileData;
		}
		const exceptions = ['getCurrentDir', 'constructor', 'verifyExists'];
		const commands = Object.getOwnPropertyNames(TerminalManager.prototype).filter(
			(x) => !exceptions.includes(x)
		);
		const documentedCmds = [];
		for (let i = 0; i < commandHelp.length; i++) {
			documentedCmds.push(commandHelp[i].split(' ')[0]);
		}
		for (let i = 0; i < commands.length; i++) {
			if (!documentedCmds.includes(commands[i])) {
				terminalLines.push(`/rDev: Command "${commands[i]}" Isn't documented!!`);
			}
		}
	}
	async ipinfo(ip?: string): Promise<{ newLines: string[] }> {
		if (ip && !new RegExp(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/g).test(ip)) {
			return { newLines: ['Enter a valid IP!!'] };
		}
		console.log(ip);
		const answer = await (await fetch(`https://ipinfo.io/${ip || ''}/json`)).json();
		return { newLines: [...Object.entries(answer).map((x) => `${x[0]} - ${x[1]}`)] };
	}
	getCurrentDir(dir: string[]) {
		let currentPaths: RouteInterface[] = this.fileData;
		let currentDir = null;
		for (let i = 0; i < dir.length; i++) {
			const foundDir = currentPaths.find((x) => {
				return x.route == dir[i];
			});

			if (foundDir == undefined || foundDir.type == 'file') {
				break;
			}
			currentPaths = foundDir.paths;
			currentDir = foundDir;
		}
		return { currentPaths, currentDir };
	}
	verifyExists(dir: string[], path: string, type?: 'file' | 'folder') {
		const { currentPaths } = this.getCurrentDir(dir);
		const chosenPath = currentPaths.find((x) => x.route == path && (type ? x.type == type : true));
		if (!chosenPath) {
			return null;
		}
		return chosenPath;
	}
	ls(dir: string[]): { newLines: string[] } {
		const { currentPaths } = this.getCurrentDir(dir);
		const lines = [];
		for (let i = 0; i < currentPaths.length; i++) {
			if (currentPaths[i].type == 'folder') {
				lines.push('/b' + currentPaths[i].route);
				continue;
			}
			lines.push('/w' + currentPaths[i].route);
		}
		return { newLines: lines };
	}
	cd(dir: string[], folder: string): { newLines: string[]; dir: string[] } {
		if (folder == '..' && dir.length > 1) {
			return { dir: dir.slice(0, dir.length - 1), newLines: [] };
		}
		const chosenFolder = this.verifyExists(dir, folder, 'folder');

		if (chosenFolder) {
			return { dir: [...dir, chosenFolder.route], newLines: [] };
		} else {
			return { dir, newLines: ["Kittens couldn't find this path :<"] };
		}
	}

	cat(dir: string[], file: string): { newLines: string[] } {
		const chosenFile = this.verifyExists(dir, file, 'file') as FileInterface;
		if (!chosenFile) {
			return { newLines: ["Kittens couldn't find this file :<"] };
		}
		console.log(chosenFile);
		return { newLines: chosenFile.data.split('\n').map((x) => '/w' + x) };
	}
	mkdir(dir: string[], folder: string): { newLines: string[] } {
		if (!folder || !folder.trim()) {
			return { newLines: ["The name format isn't good enough for the kittens :<"] };
		}
		const { currentPaths } = this.getCurrentDir(dir);
		const chosenFolder = this.verifyExists(dir, folder);
		if (chosenFolder) {
			return { newLines: ['This path already exists meow :<'] };
		}
		currentPaths.push({ type: 'folder', paths: [], route: folder });
		return { newLines: ['Kittens created your folder :>'] };
	}
	rm(dir: string[], path: string): { newLines: string[] } {
		const { currentDir, currentPaths } = this.getCurrentDir(dir);
		if (currentDir) {
			if (path == '*') {
				currentDir.paths = [];
				return { newLines: ['Kittens deleted every file/folder in the folder.', 'Scary'] };
			}
			currentDir.paths = currentPaths.filter((x) => x.route != path);
		}
		return { newLines: ['Kittens deleted the file :>'] };
	}
	edit(dir: string[], file: string): { newLines: string[]; edit: boolean } {
		const chosenFile = this.verifyExists(dir, file, 'file');
		if (!chosenFile) {
			return { newLines: ["Kittens couldn't find this file :<"], edit: false };
		}

		return {
			newLines: ['Going into editing mode!', 'Write save_file for ur kittens to stop editing :>'],
			edit: true
		};
	}
	touch(dir: string[], file: string): { newLines: string[] } {
		if (!file || !file.trim()) {
			return { newLines: ["The name format isn't good enough for the kittens :<"] };
		}
		const { currentPaths } = this.getCurrentDir(dir);
		const chosenFile = this.verifyExists(dir, file, 'file');
		if (chosenFile) {
			return { newLines: ['This file already exists meow :<'] };
		}
		currentPaths.push({ type: 'file', data: '', route: file });
		return { newLines: ['Kittens created your file :>'] };
	}
	color(col: string): { newLines: string[] } {
		if (!col || !tinyColor(col).isValid()) {
			return { newLines: ['Specify a valid color!!'] };
		}
		const inRGB = tinyColor(col).toRgb();
		const val = 10;
		if (inRGB.r < val && inRGB.g < val && inRGB.b < val) {
			return { newLines: ["the color is too dark u'll hurt ur eyes :<"] };
		}
		localStorage.setItem('text-color', col);

		window.location.reload();
		return { newLines: ['The kittens changed the color!'] };
	}
	run(dir: string[], file: string): { newLines: string[] } {
		const fileData = this.verifyExists(dir, file, 'file') as FileInterface;
		if (!fileData) {
			return { newLines: ["Kittens couldn't find this file!"] };
		}

		try {
			eval(fileData.data);
			return { newLines: ['Kittens executed the file!'] };
		} catch (error) {
			return { newLines: ['/r' + (error as any).toString()] };
		}

		return { newLines: [] };
	}
}
