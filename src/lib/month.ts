export function getMonthFromNumber(number: number): string {
	// October is month 9 (0-indexed), so we add (number - 1) to it
	// Use modulo 12 to wrap around to January after December
	const monthIndex = (9 + number - 1) % 12;
	const date = new Date(2000, monthIndex, 1);
	const month = date.toLocaleDateString('fr-FR', { month: 'long' });

	return month.charAt(0).toUpperCase() + month.slice(1);
}
