import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'
import { setFlash } from "sveltekit-flash-message/server";
import { validateScore, canAddScore } from '$lib/scoreUtils';

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
    scores: scores ? scores.reverse() : [],
  }
}

export const actions = {
  updateScore: async ({ request, cookies, locals: { supabase } }) => {
    const formData = await request.formData();
    const scoreId = +formData.get('score_id');
    const scoreTeam1 = +formData.get('score_team1');
    const scoreTeam2 = +formData.get('score_team2');

    const error = validateScore(scoreTeam1, scoreTeam2);
    if (error) {
        setFlash({type: 'error', message: error}, cookies);
        return;
    }

    await supabase.from('match_scores')
      .update({
        score_team1: scoreTeam1,
        score_team2: scoreTeam2,
      })
      .eq('id', scoreId);

    setFlash({type: 'success', message: 'Score modifié avec succès !'}, cookies);
  },

  deleteScore: async ({ request, locals: { supabase }, cookies }) => {
    const formData = await request.formData();
    const scoreId = +formData.get('score_id');

    await supabase.from('match_scores')
      .delete()
      .eq('id', scoreId);

    setFlash({type: 'success', message: 'Score supprimé avec succès !'}, cookies);
  },

  addScore: async ({ request, cookies, params, locals: { supabase } }) => {
    const formData = await request.formData();
    const scoreTeam1 = +formData.get('score_team1');
    const scoreTeam2 = +formData.get('score_team2');

    const error = validateScore(scoreTeam1, scoreTeam2);
    if (error) {
        setFlash({type: 'error', message: error}, cookies);
        return;
    }

    const matchId = +params.id!;
    const canAdd = await canAddScore(supabase, matchId);
    if (!canAdd.allowed) {
      setFlash({type: 'error', message: canAdd.error!}, cookies);
      return;
    }

    await supabase.from('match_scores').insert({
      match: matchId,
      score_team1: scoreTeam1,
      score_team2: scoreTeam2,
    });

    setFlash({type: 'success', message: 'Score ajouté avec succès !'}, cookies);
  },
} satisfies Actions;
