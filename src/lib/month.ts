export function getMonthFromNumber(number: number): string {
	// October is month 9 (0-indexed), so we add (number - 1) to it
	// Use modulo 12 to wrap around to January after December
	const monthIndex = (9 + number - 1) % 12;
	const date = new Date(2000, monthIndex, 1);
	const month = date.toLocaleDateString('fr-FR', { month: 'long' });

	return month.charAt(0).toUpperCase() + month.slice(1);
}

export function getNumberFromMonth(monthIndex: number): number {
	// Validate input (0-11)
	if (monthIndex < 0 || monthIndex > 11) {
		throw new Error(`Invalid month index: ${monthIndex}. Must be between 0 and 11.`);
	}

	// Reverse the calculation: October (index 9) is number 1
	// monthIndex = (9 + number - 1) % 12
	// So: number = (monthIndex - 9 + 1) % 12, but we need to handle negative values
	const number = ((monthIndex - 9 + 12) % 12) + 1;

	return number;
}
