import type { PageServerLoad } from './$types'
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const { data: tournament } = await supabase.from('tournaments').select().eq('year', params.year).single();
  const { data: teams } = await supabase.from('teams').select();
  const { data: tournament_teams } = await supabase.from('tournament_teams')
    .select('*, team(name, player1(*), player2(*)))')
    .eq('tournament', tournament.id)
    .order('id', { ascending: false });

  return {
    teams: teams ?? [],
    tournament,
    tournament_teams: tournament_teams ?? [],
  }
}

export const actions = {
	delete: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();

    const res = await supabase.from('tournament_teams').delete().eq('id', formData.get('tournament_team'))

    console.log(res);
	},
	addTeam: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();

    await supabase.from('tournament_teams').insert({team: formData.get('team_id'), tournament: formData.get('tournament_id')})
	}
} satisfies Actions;
