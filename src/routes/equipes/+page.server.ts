import type { PageServerLoad } from './$types'
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const { data: teams } = await supabase.from('teams').select('*, player1(*), player2(*)');
  const { data: players } = await supabase.from('players').select('*');

  return {
    teams: teams ?? [],
    players: players ?? [],
  }
}

export const actions = {
    create: async ({ request, locals: { supabase } }) => {
      const formData = await request.formData();

      await supabase.from('teams').insert({
        name: formData.get('name'),
        player1: formData.get('player1'),
        player2: formData.get('player2'),
      });
    },
    delete: async ({ request, locals: { supabase } }) => {
      const formData = await request.formData();

      await supabase.from('teams').delete().eq('id', formData.get('team'));
    },
} satisfies Actions;
