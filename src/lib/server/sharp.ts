// Use createRequire to load sharp at runtime, bypassing Vite/Rollup bundling
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export function getSharp() {
	return require('sharp');
}

