export function getMonthFromNumber(number: number, monthStart: number): string {
	const monthIndex = (monthStart + number - 1) % 12;
	const date = new Date(2000, monthIndex, 1);
	const month = date.toLocaleDateString('fr-FR', { month: 'long' });

	return month.charAt(0).toUpperCase() + month.slice(1);
}

export function getNumberFromMonth(monthIndex: number, monthStart: number): number {
	// Validate input (0-11)
	if (monthIndex < 0 || monthIndex > 11) {
		throw new Error(`Invalid month index: ${monthIndex}. Must be between 0 and 11.`);
	}

	const number = ((monthIndex - monthStart + 12) % 12) + 1;

	return number;
}
