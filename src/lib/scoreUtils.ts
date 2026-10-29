import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../database.types';

export const WINNING_SCORE = 1000;

export function validateScore(scoreTeam1: number, scoreTeam2: number): string | undefined {
  if (!Number.isFinite(scoreTeam1) || !Number.isFinite(scoreTeam2)) {
    return 'Les scores doivent être des nombres valides';
  }

  if (scoreTeam1 < 0 || scoreTeam2 < 0) {
    return 'Le score ne peut pas être négatif';
  }

  if (scoreTeam1 < WINNING_SCORE && scoreTeam2 < WINNING_SCORE) {
    return 'Une des deux équipes doit avoir un score supérieur à 1000';
  }

  // en vrai, peut etre si il y a une belote pour la 2eme équipe
  // genre 990 + 20, et c'est l'autre équipe qui a pris et gagné
  // si on corrige pas ici, on peut changer les scores apres enregistrement du match
  if (scoreTeam1 >= WINNING_SCORE && scoreTeam2 >= WINNING_SCORE) {
    return 'Les deux équipes ne peuvent pas atteindre 1000 points';
  }
}

export async function canAddScore(
  supabase: SupabaseClient<Database>,
  matchId: number
): Promise<{ allowed: boolean; error?: string }> {
  const { data: scores } = await supabase.from('match_scores')
    .select()
    .eq('match', matchId)
    .order('created_at', { ascending: false });

  const team1Wins = scores?.filter(s => (s.score_team1 ?? 0) >= 1000).length ?? 0;
  const team2Wins = scores?.filter(s => (s.score_team2 ?? 0) >= 1000).length ?? 0;

  if (team1Wins >= 2 || team2Wins >= 2) {
    return { allowed: false, error: 'Une équipe a déjà gagné !' };
  }

  return { allowed: true };
}
