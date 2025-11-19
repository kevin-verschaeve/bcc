import type { PageServerLoad } from '../$types'

export const load: PageServerLoad = async ({ params, locals: { supabase }, setHeaders }) => {
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


  const { data, error } = await supabase
    .from('matchs')
    .select('number')
    .eq('tournament', tournament.id)
    .order('number', { ascending: false })
    .limit(1)
    .maybeSingle();

  const lastDay = data?.number ?? 1;

  setHeaders({
    'cache-control': 'public, max-age=30, s-maxage=60'
  });

  return {
    tournament,
    lastDay,
    matchs: matchs ?? [],
    scores: scores.length ? Object.groupBy(scores, ({match}) => match?.id) : [],
  }
}
