export type CardRank = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | '8' | '7';
export type CardSuit = '♥' | '♦' | '♠' | '♣';
export type AtoutSuit = CardSuit | 'TA' | 'SA';

export type Card = {
	rank: CardRank;
	suit: CardSuit;
};

const ATOUT_VALUES: Record<CardRank, number> = {
	J: 20,
	'9': 14,
	A: 11,
	'10': 10,
	K: 4,
	Q: 3,
	'8': 0,
	'7': 0,
};

const NON_ATOUT_VALUES: Record<CardRank, number> = {
	A: 11,
	'10': 10,
	K: 4,
	Q: 3,
	J: 2,
	'9': 0,
	'8': 0,
	'7': 0,
};

const SA_VALUES: Record<CardRank, number> = {
	A: 19,
	'10': 10,
	K: 4,
	Q: 3,
	J: 2,
	'9': 0,
	'8': 0,
	'7': 0,
};

export function calculateTrickPoints(cards: Card[], atoutSuit: AtoutSuit): number {
	return cards.reduce((total, card) => {
		const rank = card.rank as CardRank;
		if (atoutSuit === 'SA') {
			return total + (SA_VALUES[rank] ?? 0);
		} else if (atoutSuit === 'TA') {
			return total + (ATOUT_VALUES[rank] ?? 0);
		} else {
			const isAtout = card.suit === atoutSuit;
			return total + (isAtout ? ATOUT_VALUES[rank] : NON_ATOUT_VALUES[rank]);
		}
	}, 0);
}
