import * as fs from 'fs';
import * as path from 'path';

// Helper: Remove file extension from a filename
function removeExtension(fileName: string): string {
	return fileName.replace(/\.svelte$/, '');
}

// Helper: Convert snake_case or kebab-case to PascalCase
function toPascalCase(str: string): string {
	return str
		.split(/[_-]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');
}

// Main function to process .svelte files and generate the output string
function generateModels(folder: string, base: string): string {
	const files = fs.readdirSync(folder);
	const svelteFiles = files.filter((file) => file.endsWith('.svelte'));

	const importStatements: string[] = [];
	const modelEntries: string[] = [];

	// Regex to match: <RoomObjectMaterial index={X} {colors} {opacity} />
	// where X is a single digit
	const indexRegex = /<RoomObjectMaterial\s+index=\{(\d)\}\s+\{colors\}\s+\{opacity\}\s*\/>/g;

	for (const file of svelteFiles) {
		const filePath = path.join(folder, file);
		const content = fs.readFileSync(filePath, 'utf-8');

		// Find all index values in the file
		const indices: number[] = [];
		let match: RegExpExecArray | null;
		while ((match = indexRegex.exec(content)) !== null) {
			indices.push(Number(match[1]));
		}

		if (indices.length === 0) {
			throw new Error(`No RoomObjectMaterial with index found in ${file}`);
		}

		// Verify indices form a continuous sequence from 0 to n-1.
		indices.sort((a, b) => a - b);
		for (let i = 0; i < indices.length; i++) {
			if (indices[i] !== i) {
				throw new Error(`File ${file}: expected index ${i} but found ${indices[i]}`);
			}
		}

		const colorsCount = indices.length;

		// Check if file contains the image component pattern:
		// <RoomObjectMaterial {image} {colors} {opacity} />
		const image = content.includes(`<RoomObjectMaterial {image} {colors} {opacity} />`);

		// visible is always true.
		const visible = true;

		// Create component variable name and key based on the file name.
		const keyName = removeExtension(file); // e.g. "component_a"
		const componentVar = toPascalCase(keyName); // e.g. "ComponentA"

		// Construct the import statement.
		importStatements.push(`import KayKit${componentVar} from '${base}/${file}';`);

		// Construct the model entry.
		const modelEntry = `'kaykit-furniture-kit-${keyName}': {
  component: KayKit${componentVar},
  colors: ${colorsCount},
  visible: ${visible},
  image: ${image}
}`;
		modelEntries.push(modelEntry);
	}

	// Build the final string output.
	const output =
		importStatements.join('\n') + '\n\n' + 'const models = {\n' + modelEntries.join(',\n') + '\n};';

	return output;
}

const result = generateModels('./kaykit-furniture-kit', './models/kaykit-furniture-kit/');
console.log(result);
