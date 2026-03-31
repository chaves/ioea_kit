// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session } from '$lib/server/auth';

declare global {
	const __BUILD_ID__: string;
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session | null;
		}
		interface PageData {
			session: Session | null;
			randomPhoto: { year: number; filename: string } | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
