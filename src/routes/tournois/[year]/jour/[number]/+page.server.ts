import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, locals: { supabase }, setHeaders }) => {
  if (!/^\d+$/.test(params.number)) {
    error(404, 'Jour introuvable');
  }

  const { data: tournament } = await supabase.from('tournaments').select('id, year, month_start').eq('year', params.year).single();

  if (!tournament) {
    error(404, 'Tournoi introuvable');
  }

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


  const { data } = await supabase
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
    scores: scores?.length ? Object.groupBy(scores, ({match}) => match?.id) : [],
  }
}
