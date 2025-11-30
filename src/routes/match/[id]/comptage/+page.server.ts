import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'
import { setFlash } from 'sveltekit-flash-message/server';
import { validateScore, canAddScore } from '$lib/scoreUtils';

export const load: PageServerLoad = async ({ params, locals: { supabase }, cookies }) => {
  const { data: match } = await supabase.from('matchs')
    .select(`
      *,
      team1:team1(
        *,
        player1:player1(*),
        player2:player2(*)
      ),
      team2:team2(
        *,
        player1:player1(*),
        player2:player2(*)
      )
    `)
    .eq('id', params.id)
    .single();

  const canAdd = await canAddScore(supabase, Number(params.id));
  if (!canAdd.allowed) {
    setFlash({type: 'error', message: canAdd.error!}, cookies);
    return redirect(301, `/match/${params.id}/scores`);
  }

  return {
    match,
  }
}

export const actions = {
  saveScore: async ({ request, params, locals: { supabase }, cookies }) => {
    const formData = await request.formData();
    const scoreTeam1 = Number(formData.get('score_team1')!);
    const scoreTeam2 = Number(formData.get('score_team2')!);

    const error = validateScore(scoreTeam1, scoreTeam2);
    if (error) {
      setFlash({type: 'error', message: error}, cookies);
      return fail(400, {message: error});
    }

    const matchId = Number(params.id);
    const canAdd = await canAddScore(supabase, matchId);
    if (!canAdd.allowed) {
      console.log({canAdd});

      setFlash({type: 'error', message: canAdd.error!}, cookies);
      return fail(400, {message: canAdd.error});
    }

    await supabase.from('match_scores').insert({
      match: matchId,
      score_team1: scoreTeam1,
      score_team2: scoreTeam2,
    });

    setFlash({type: 'success', message: 'Score ajouté avec succès !'}, cookies);

    const canAddNow = await canAddScore(supabase, matchId);
    if (!canAddNow.allowed) {
      return redirect(301, `/match/${params.id}/scores`);
    }

    return { success: true };
  },
} satisfies Actions;
