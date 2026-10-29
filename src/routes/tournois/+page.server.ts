import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad, Actions } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data: tournaments } = await supabase.from('tournaments').select().order('id', {ascending: false});

  return {
    tournaments: tournaments ?? []
  }
}

export const actions = {
  create: async ({ request, cookies, locals: { supabase } }) => {
    const formData = await request.formData();

    const { error } = await supabase.from('tournaments').insert({
      name: (formData.get('name') as string) || null,
      month_start: Number(formData.get('month_start')),
      year: new Date().getFullYear(),
      status: 'not_started',
    });
    if (error) {
      setFlash({ type: 'error', message: error.message }, cookies);
      return fail(500, { message: error.message });
    }
    setFlash({ type: 'success', message: 'Tournoi créé avec succès !' }, cookies);
  },

} satisfies Actions;
