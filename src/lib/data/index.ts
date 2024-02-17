import type { RouteInterface } from '$lib/interfaces/routes.interface';

export const fileData: RouteInterface[] = [
	{
		route: '\\',
		type: 'folder',
		paths: [
			{ route: 'hello-world', type: 'folder', paths: [] },
			{ type: 'file', data: 'Hello World!\n This is a text file', route: 'file.txt' }
		]
	}
];
