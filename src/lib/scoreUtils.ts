import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../database.types';

export const WINNING_SCORE = 1000;

export function validateScore(scoreTeam1: number, scoreTeam2: number): string | undefined {
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

export async function canAddScore(
  supabase: SupabaseClient<Database>,
  matchId: number
): Promise<{ allowed: boolean; error?: string }> {
  const { data: scores } = await supabase.from('match_scores')
    .select()
    .eq('match', matchId)
    .order('created_at', { ascending: false });

  const team1Wins = scores?.filter(s => s.score_team1 >= 1000).length ?? 0;
  const team2Wins = scores?.filter(s => s.score_team2 >= 1000).length ?? 0;

  if (team1Wins >= 2 || team2Wins >= 2) {
    return { allowed: false, error: 'Une équipe a déjà gagné !' };
  }

  return { allowed: true };
}
