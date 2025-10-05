import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'
import type { Actions } from './$types';
import { generateTournamentSchedule } from '$lib/MeetGenerator';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const { data: tournament } = await supabase.from('tournaments').select().eq('year', params.year).single();
  const { data: matchs } = await supabase.from('matchs')
    .select()
    .eq('tournament', tournament.id)
    .order('number');

  const { data: teams } = await supabase.from('teams').select();

  const { data: scores } = await supabase.from('match_scores')
    .select('*, match!inner (id, tournament)')
    .eq('match.tournament', tournament.id);

	return {
    tournament,
    days: Object.groupBy(matchs, ({number}) => number) ?? [],
    matchs: matchs ?? [],
		scores: scores ?? [],
    teams: teams ?? [],
  }
}

export const actions = {
    startTournament: async ({ request, locals: { supabase } }) => {
      const formData = await request.formData();

      const { data: tournament } = await supabase.from('tournaments')
        .update({status: 'started'})
        .eq('id', formData.get('tournament'))
        .select()
        .single();

      const { data: teams } = await supabase.from('tournament_teams')
        .select()
        .eq('tournament', formData.get('tournament'));

      const schedule = generateTournamentSchedule(tournament, teams);

      let i = 1;
      for (let day of schedule) {
        for(let meet of day) {
          await supabase.from('matchs').insert({
            number: i,
            tournament: meet.tournament.id,
            team1: meet.team1.team,
            team2: meet.team2.team,
          });
        }
        i++;
      }

      redirect(301, `/tournois/${tournament.year}/rencontres`)
    },
    deleteMatch: async ({ request, locals: { supabase } }) => {
      const formData = await request.formData();

      const res = await supabase.from('matchs').delete().eq('id', +formData.get('match'));
      console.log(res);
    },
    addTeam: async ({ request, locals: { supabase } }) => {
      const formData = await request.formData();

      await supabase.from('tournament_teams').insert({team: formData.get('team_id'), tournament: formData.get('tournament_id')});
    },
} satisfies Actions;
