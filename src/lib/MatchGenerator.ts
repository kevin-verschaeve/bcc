function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type Meet<Tournament, Team> = { tournament: Tournament; team1: Team; team2: Team };

export function generateTournamentSchedule<Tournament, Team>(tournament: Tournament, teams: Team[]) {
  const n = teams.length;
  if (n % 2 !== 0) {
    throw new Error('Number of teams must be even.');
  }

  const schedule: Meet<Tournament, Team>[][] = [];
  const teamList = shuffle(teams);

  for (let round = 0; round < n - 1; round++) {
    const day: Meet<Tournament, Team>[] = [];
    for (let i = 0; i < n / 2; i++) {
      const team1 = teamList[i];
      const team2 = teamList[n - 1 - i];
      day.push({ tournament, team1, team2 });
    }
    schedule.push(day);

    teamList.splice(1, 0, teamList.pop()!);
  }

  return schedule;
}
