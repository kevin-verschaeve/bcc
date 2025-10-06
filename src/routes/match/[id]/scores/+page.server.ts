import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const { data: match } = await supabase.from('matchs')
    .select('*, team1(*), team2(*), tournament(*)')
    .eq('id', params.id)
    .single();

  const { data: scores } = await supabase.from('match_scores')
    .select()
    .eq('match', params.id)
    .order('created_at', { ascending: false });

  return {
    match,
    scores: scores ?? [],
  }
}

export const actions = {
  updateScore: async ({ request, params, locals: { supabase } }) => {
    const formData = await request.formData();
    const scoreId = +formData.get('score_id');
    const scoreTeam1 = +formData.get('score_team1');
    const scoreTeam2 = +formData.get('score_team2');

    await supabase.from('match_scores')
      .update({
        score_team1: scoreTeam1,
        score_team2: scoreTeam2,
      })
      .eq('id', scoreId);
  },

  deleteScore: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const scoreId = +formData.get('score_id');

    await supabase.from('match_scores')
      .delete()
      .eq('id', scoreId);
  },

  addScore: async ({ request, params, locals: { supabase } }) => {
    const formData = await request.formData();
    const scoreTeam1 = +formData.get('score_team1');
    const scoreTeam2 = +formData.get('score_team2');

    const { data: scores } = await supabase.from('match_scores')
      .select()
      .eq('match', +params.id)
      .order('created_at', { ascending: false });

    const team1Wins = scores?.filter(s => s.score_team1 > 1000).length ?? 0;
    const team2Wins = scores?.filter(s => s.score_team2 > 1000).length ?? 0;

    if (team1Wins >= 2 || team2Wins >= 2) {
      // todo, use fail and display error
      return { error: 'Une équipe a déjà gagné 2 manches' };
    }

    await supabase.from('match_scores').insert({
      match: +params.id,
      score_team1: scoreTeam1,
      score_team2: scoreTeam2,
    });
  },
} satisfies Actions;
