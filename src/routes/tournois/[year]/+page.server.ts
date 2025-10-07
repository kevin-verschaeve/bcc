import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'
import type { Actions } from './$types';
import { generateTournamentSchedule } from '$lib/MeetGenerator';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const { data: tournament } = await supabase.from('tournaments').select().eq('year', params.year).single();
  const { data: matchs } = await supabase.from('matchs')
    .select('number')
    .eq('tournament', tournament.id)
    .order('number');

  const { data: summary } = await supabase.from('tournament_summary')
    .select()
    .eq('tournament', tournament.id)
    .order('number')
    .order('team_name');

	return {
    tournament,
    days: new Set(matchs.map(({ number }) => number)),
    summary: Object.groupBy(summary, ({ team_name }) => team_name),
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

      setFlash({type: 'success', message: 'Tournoi démarré avec succès !'}, cookies);

      redirect(301, `/tournois/${tournament.year}/rencontres`)
    },
} satisfies Actions;
