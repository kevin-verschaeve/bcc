import { redirect, error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'
import type { Actions } from './$types';
import { generateTournamentSchedule } from '$lib/MatchGenerator';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const { data: tournament } = await supabase.from('tournaments').select().eq('year', params.year).single();

  // Handle tournament not found
  if (!tournament) {
    error(404, 'Tournoi introuvable');
  }

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
    days: new Set(matchs?.map(({ number }) => number) ?? []),
    summary: Object.groupBy(summary ?? [], ({ team_name }) => team_name),
  }
}

export const actions = {
    startTournament: async ({ request, cookies, locals: { supabase } }) => {
      const formData = await request.formData();

      const { data: teams } = await supabase.from('tournament_teams')
        .select()
        .eq('tournament', formData.get('tournament'));

      if (!teams?.length) {
        setFlash({type: 'error', message: 'Sélectionner des teams !'}, cookies);
        return;
      }

      if (teams.length % 2 !== 0) {
        setFlash({type: 'error', message: 'Le nombre d\'équipes doit être pair pour démarrer le tournoi.'}, cookies);
        return fail(400, {message: 'Nombre d\'équipes impair'});
      }

      const { data: tournament, error: tournamentError } = await supabase.from('tournaments')
        .select()
        .eq('id', formData.get('tournament'))
        .single();
      if (tournamentError || !tournament) {
        const message = tournamentError?.message ?? 'Tournoi introuvable';
        setFlash({type: 'error', message}, cookies);
        return fail(500, {message});
      }

      const matchs = generateTournamentSchedule(tournament, teams).flatMap((day, index) =>
        day.map((meet) => ({
          number: index + 1,
          tournament: tournament.id,
          team1: meet.team1.team,
          team2: meet.team2.team,
        }))
      );

      // Un seul insert (atomique) : tout le calendrier ou rien.
      const { error: insertError } = await supabase.from('matchs').insert(matchs);
      if (insertError) {
        setFlash({type: 'error', message: insertError.message}, cookies);
        return fail(500, {message: insertError.message});
      }

      // Le statut ne change qu'une fois le calendrier créé.
      const { error: updateError } = await supabase.from('tournaments')
        .update({status: 'started'})
        .eq('id', tournament.id);
      if (updateError) {
        // Évite un calendrier orphelin sur un tournoi resté « not_started ».
        await supabase.from('matchs').delete().eq('tournament', tournament.id);
        setFlash({type: 'error', message: updateError.message}, cookies);
        return fail(500, {message: updateError.message});
      }

      setFlash({type: 'success', message: 'Tournoi démarré avec succès !'}, cookies);
    },
} satisfies Actions;
