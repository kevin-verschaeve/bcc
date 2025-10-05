import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	const body = await request.json();

    const { data} = await supabase.from('players')
		.insert(body)
		.select()
		.single();

	return json(data);
};
