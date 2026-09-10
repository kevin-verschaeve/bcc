import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	// Only used to suggest names in the setup form: a one-off game may perfectly
	// well be played by people who are not registered players.
	const { data: players } = await supabase.from('players').select('name').order('name');

	return {
		players: players ?? []
	};
};
