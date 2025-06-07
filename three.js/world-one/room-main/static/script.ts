import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootFolder = './models/tiny-treats-bubbly-bathroom/';

function convertGLTFFiles(folder: string, serveFrom: string | undefined = undefined) {
	const files = fs.readdirSync(folder, { withFileTypes: true });

	console.log(`Processing: ${folder}`);
	for (const file of files) {
		console.log(`Processing: ${file.name}`);
		const fullPath = path.join(folder, file.name);

		if (file.isDirectory()) {
			// If it's a directory, recurse into it
			convertGLTFFiles(fullPath);
		} else if (file.isFile() && file.name.endsWith('glb')) {
			// If it's a .gltf file, convert it
			const command =
				`npx @threlte/gltf@latest -t -s -u "${fullPath}"` + (serveFrom ? ` -r "${serveFrom}"` : '');
			console.log(`Converting: ${fullPath}`);
			try {
				execSync(command);
				console.log(`Converted: ${fullPath}`);
			} catch (error) {
				console.error(`Error converting ${fullPath}:`, error);
			}
		}
	}
}

console.log('Starting conversion...');
// Start the conversion process from the root folder
convertGLTFFiles(rootFolder, '');
