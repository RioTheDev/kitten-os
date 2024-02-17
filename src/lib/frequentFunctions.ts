export function formatPath(dir: string[], cmd?: string) {
	return 'D:' + dir.reduce((prev, cur, i) => prev + (i != 1 ? '\\' : '') + cur) + '>' + (cmd || '');
}
