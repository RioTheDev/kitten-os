import type { RouteInterface } from './interfaces/routes.interface';
import tinyColor from 'tinycolor2';
export class TerminalManager {
	fileData: RouteInterface[] = [];
	constructor(fileData: RouteInterface[]) {
		this.fileData = fileData;
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

	ls(dir: string[]): { newLines: string[] } {
		const { currentPaths } = this.getCurrentDir(dir);
		const lines = [];
		for (let i = 0; i < currentPaths.length; i++) {
			if (currentPaths[i].type == 'folder') {
				lines.push('/d' + currentPaths[i].route);
				continue;
			}
			lines.push('/f' + currentPaths[i].route);
		}
		return { newLines: lines };
	}

	cd(dir: string[], folder: string): { newLines: string[]; dir: string[] } {
		if (folder == '..' && dir.length > 1) {
			return { dir: dir.slice(0, dir.length - 1), newLines: [] };
		}
		const { currentPaths } = this.getCurrentDir(dir);
		const chosenFolder = currentPaths.find((x) => x.route == folder && x.type == 'folder');

		if (chosenFolder) {
			return { dir: [...dir, chosenFolder.route], newLines: [] };
		} else {
			return { dir, newLines: ["Kittens couldn't find this path :<"] };
		}
	}

	cat(dir: string[], file: string): { newLines: string[] } {
		const { currentPaths } = this.getCurrentDir(dir);
		const chosenFile = currentPaths.find((x) => x.route == file && x.type == 'file');
		if (!chosenFile || chosenFile.type == 'folder') {
			return { newLines: ["Kittens couldn't find this file :<"] };
		}

		return { newLines: chosenFile.data.split('\n').map((x) => '/f' + x) };
	}
	mkdir(dir: string[], folder: string): { newLines: string[] } {
		if (!folder || !folder.trim()) {
			return { newLines: ["The name format isn't good enough for the kittens :<"] };
		}
		const { currentPaths } = this.getCurrentDir(dir);
		const chosenFolder = currentPaths.find((x) => x.route == folder && x.type == 'folder');
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
				return { newLines: ['Kittens deleted every file in the folder.', 'Scary'] };
			}
			currentDir.paths = currentPaths.filter((x) => x.route != path);
		}
		return { newLines: ['Kittens deleted the file :>'] };
	}
	edit(dir: string[], file: string): { newLines: string[]; edit: boolean } {
		const { currentPaths } = this.getCurrentDir(dir);
		const chosenFile = currentPaths.find((x) => x.route == file && x.type == 'file');
		if (!chosenFile || chosenFile.type == 'folder') {
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
		const chosenFile = currentPaths.find((x) => x.route == file && x.type == 'file');
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
}
