import type { PageServerLoad } from '../$types'

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const { data: tournament } = await supabase.from('tournaments').select().eq('year', params.year).single();
  const { data: teams } = await supabase.from('teams').select();
  const { data: matchs } = await supabase.from('matchs')
    .select('*, team1(*, player1(*), player2(*)), team2(*, player1(*), player2(*))')
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
