// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { SupabaseClient, Session, User } from '@supabase/supabase-js'
import type { Database } from './database.types'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
		}
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
