import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data: tournament } = await supabase
    .from('tournaments')
    .select()
    .eq('status', 'started')
    .single()

    if (tournament !== null) {
        return redirect(301, `/tournois/${tournament.year}`);
    }

    redirect(301, '/tournois');
}
