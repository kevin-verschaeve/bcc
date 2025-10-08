export function generateTournamentSchedule(tournament, teams) {
  const n = teams.length;
  if (n % 2 !== 0) {
    throw new Error('Number of teams must be even.');
  }

  const schedule = [];
  const teamList = [...teams];

  for (let round = 0; round < n - 1; round++) {
    const day = [];
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
