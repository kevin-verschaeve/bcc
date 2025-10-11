import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const teamId = parseInt(params.id);

	const { data: team, error: teamError } = await supabase
		.from('teams')
		.select('id, name, availabilities, player1(name), player2(name)')
		.eq('id', teamId)
		.single();

	if (teamError || !team) {
		throw error(404, 'Team not found');
	}

	return {
		team
	};
};

export const actions: Actions = {
	saveAvailabilities: async ({ request, cookies, params, locals: { supabase } }) => {
		const teamId = parseInt(params.id);

		const formData = await request.formData();
		const availabilitiesJson = formData.get('availabilities');

		if (!availabilitiesJson || typeof availabilitiesJson !== 'string') {
			setFlash({type: 'error', message: 'Une erreur est survenue pendant l\'enregistrement des disponibilités.'}, cookies);
			return;
		}

		let availabilities: any[];
		try {
			availabilities = JSON.parse(availabilitiesJson);
			if (!Array.isArray(availabilities)) {
				setFlash({type: 'error', message: 'Une erreur est survenue pendant l\'enregistrement des disponibilités.'}, cookies);
				return;
			}
		} catch {
			setFlash({type: 'error', message: 'Une erreur est survenue pendant l\'enregistrement des disponibilités.'}, cookies);
			return;
		}

		const { error: updateError } = await supabase
			.from('teams')
			.update({ availabilities })
			.eq('id', teamId);

		if (updateError) {
			setFlash({type: 'error', message: updateError.message}, cookies);
			return;
		}


		setFlash({type: 'success', message: 'Disponibilités enregistrées avec succès !'}, cookies);

		return { success: true };
	}
};
