interface Availability {
	start: string;
	end: string;
}

interface MatchingSlot {
	date: string;
}

/**
 * Finds all matching availabilities between two teams.
 * A match occurs when:
 * 1. Start dates/times are equal, OR
 * 2. One availability's start is within the range of another
 * 3. The overlapping time range must be at least 2 hours
 *
 * @param team1Availabilities - Array of team 1's availabilities
 * @param team2Availabilities - Array of team 2's availabilities
 * @returns Array of matching availability slots
 */
export function matchingAvailabilities(
	team1Availabilities: Availability[] | null | undefined,
	team2Availabilities: Availability[] | null | undefined
): MatchingSlot[] {
	const matches: MatchingSlot[] = [];

	// Handle null/undefined inputs
	if (!team1Availabilities || !team2Availabilities) {
		return matches;
	}

	for (const avail1 of team1Availabilities) {
		for (const avail2 of team2Availabilities) {
			if (!avail1 || !avail2 || !avail1.start || !avail1.end || !avail2.start || !avail2.end) {
				continue;
			}

			const start1 = new Date(avail1.start);
			const end1 = new Date(avail1.end);
			const start2 = new Date(avail2.start);
			const end2 = new Date(avail2.end);

			if (!isSameDate(start1, start2)) {
				continue;
			}

			const overlapStart = new Date(Math.max(start1.getTime(), start2.getTime()));
			const overlapEnd = new Date(Math.min(end1.getTime(), end2.getTime()));
			const overlapDurationMs = overlapEnd.getTime() - overlapStart.getTime();
			const overlapDurationHours = overlapDurationMs / (1000 * 60 * 60);

			// Overlap must be at least 2 hours
			if (overlapDurationHours >= 2) {
				matches.push({
					date: overlapStart.toISOString(),
				});
			}
		}
	}

	return matches;
}

/**
 * Checks if two dates are on the same calendar date (ignoring time)
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if both dates are on the same day
 */
function isSameDate(date1: Date, date2: Date): boolean {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}
