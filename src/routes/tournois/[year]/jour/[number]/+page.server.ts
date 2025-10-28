import type { PageServerLoad } from '../$types'

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const { data: tournament } = await supabase.from('tournaments').select('id, year').eq('year', params.year).single();
  const { data: matchs } = await supabase.from('matchs')
    .select(`
      id,
      team1(
        name,
        availabilities,
        player1(
          name,
          tel
        ),
        player2(
          name,
          tel
        )
      ),
      team2(
        name,
        availabilities,
        player1(
          name,
          tel
        ),
        player2(
          name,
          tel
        )
      )`)
    .eq('tournament', tournament.id)
    .eq('number', params.number)
  ;

  const { data: scores } = await supabase.from('match_scores')
    .select('score_team1, score_team2, match!inner(id)')
    .eq('match.tournament', tournament.id)
    .eq('match.number', +params.number)
    .order('created_at');

  return {
    tournament,
    matchs: matchs ?? [],
    scores: scores.length ? Object.groupBy(scores, ({match}) => match?.id) : [],
  }
}
