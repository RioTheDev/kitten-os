export interface FileInterface {
	route: string;
	type: 'file';
	data: string;
}
export interface FolderInterface {
	route: string;
	type: 'folder';
	paths: RouteInterface[];
}
// Conditional type checking
export type RouteInterface = FolderInterface | FileInterface;
