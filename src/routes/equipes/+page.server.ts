import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types'
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const { data: teams } = await supabase.from('teams').select('id, name, player1(*), player2(*)');
  const { data: players } = await supabase.from('players').select('*');

  return {
    teams: teams ?? [],
    players: players ?? [],
  }
}

export const actions = {
    create: async ({ request, cookies, locals: { supabase } }) => {
      const formData = await request.formData();

      const { error } = await supabase.from('teams').insert({
        name: formData.get('name'),
        player1: formData.get('player1'),
        player2: formData.get('player2'),
      });
      if (error) {
        setFlash({type: 'error', message: error.message}, cookies);
        return fail(500, {message: error.message});
      }
      setFlash({type: 'success', message: 'Équipe créée avec succès !'}, cookies);
    },
    delete: async ({ request, cookies, locals: { supabase } }) => {
      const formData = await request.formData();

      const { error } = await supabase.from('teams').delete().eq('id', formData.get('team'));
      if (error) {
        setFlash({type: 'error', message: error.message}, cookies);
        return fail(500, {message: error.message});
      }
      setFlash({type: 'success', message: 'Équipe supprimée avec succès !'}, cookies);
    },
} satisfies Actions;
