import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types'

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const { data: tournament } = await supabase.from('tournaments').select().eq('year', params.year).single();
  const { data: teams } = await supabase.from('teams').select();
  const { data: matchs } = await supabase.from('matchs')
    .select('*, team1(*), team2(*)')
    .eq('tournament', tournament.id)
    .eq('number', params.number)
  ;

  const { data: scores } = await supabase.from('match_scores')
    .select('*, match!inner(*, team1(*), team2(*))')
    .eq('match.tournament', tournament.id)
    .eq('match.number', +params.number)
    .order('created_at', { ascending: false });

  return {
    tournament,
    matchs: matchs ?? [],
    teams: teams ?? [],
    scores: scores.length ? Object.groupBy(scores, ({match}) => match?.id) : [],
  }
}

export const actions = {
  addMatch: async ({ request, params, locals: { supabase } }) => {
    const formData = await request.formData();
    const team1 = +formData.get('team1');
    const team2 = +formData.get('team2');

    // find match
    let { data: match } = await supabase
      .from('matchs')
      .select()
      .eq('tournament', +formData.get('tournament'))
      .or(`team1.eq.${team1},team2.eq.${team1}`)
      .or(`team1.eq.${team2},team2.eq.${team2}`)
      .eq('number', params.number)
      .single();

    // add match score
    await supabase.from('match_scores').insert({
      match: match.id,
      score_team1: +formData.get('score_team1'),
      score_team2: +formData.get('score_team2'),
    });
  },
} satisfies Actions;
