import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types'
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data: players } = await supabase.from('players').select('*').order('name');

  return {
    players: players ?? [],
  }
}

export const actions = {
    create: async ({ request, cookies, locals: { supabase } }) => {
      const formData = await request.formData();

      const { error } = await supabase.from('players').insert({
        name: formData.get('name'),
        tel: formData.get('tel'),
      });
      if (error) {
        setFlash({type: 'error', message: error.message}, cookies);
        return fail(500, {message: error.message});
      }
      setFlash({type: 'success', message: 'Joueur créé avec succès !'}, cookies);
    },
    update: async ({ request, cookies, locals: { supabase } }) => {
      const formData = await request.formData();

      const { error } = await supabase.from('players')
        .update({
          name: formData.get('name'),
          tel: formData.get('tel'),
        })
        .eq('id', formData.get('id'));
      if (error) {
        setFlash({type: 'error', message: error.message}, cookies);
        return fail(500, {message: error.message});
      }
      setFlash({type: 'success', message: 'Joueur modifié avec succès !'}, cookies);
    },
    delete: async ({ request, cookies, locals: { supabase } }) => {
      const formData = await request.formData();

      const { error } = await supabase.from('players').delete().eq('id', formData.get('id'));
      if (error) {
        setFlash({type: 'error', message: error.message}, cookies);
        return fail(500, {message: error.message});
      }
      setFlash({type: 'success', message: 'Joueur supprimé avec succès !'}, cookies);
    },
} satisfies Actions;
