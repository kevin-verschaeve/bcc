import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'
import { setFlash } from "sveltekit-flash-message/server";

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

    const error = validate(scoreTeam1, scoreTeam2);
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

    const error = validate(scoreTeam1, scoreTeam2);
    if (error) {
        setFlash({type: 'error', message: error}, cookies);
        return;
    }

    const { data: scores } = await supabase.from('match_scores')
      .select()
      .eq('match', +params.id)
      .order('created_at', { ascending: false });

    const team1Wins = scores?.filter(s => s.score_team1 > 1000).length ?? 0;
    const team2Wins = scores?.filter(s => s.score_team2 > 1000).length ?? 0;

    if (team1Wins >= 2 || team2Wins >= 2) {
      setFlash({type: 'error', message: 'Une équie à déjà gagné !'}, cookies);
      return;
    }

    await supabase.from('match_scores').insert({
      match: +params.id,
      score_team1: scoreTeam1,
      score_team2: scoreTeam2,
    });

    setFlash({type: 'success', message: 'Score ajouté avec succès !'}, cookies);
  },
} satisfies Actions;

const validate = (scoreTeam1: number, scoreTeam2: number): string | undefined => {
  if (scoreTeam1 < 0 || scoreTeam2 < 0) {
    return 'Le score ne peut pas être négatif';
  }

  if (scoreTeam1 < 1000 && scoreTeam2 < 1000) {
    return 'Une des deux équipes doit avoir un score supérieur à 1000';
  }

  if (scoreTeam1 > 1000 && scoreTeam2 > 1000) {
    return 'Les deux équipes ne peuvent pas avoir un score supérieur à 1000';
  }
}
