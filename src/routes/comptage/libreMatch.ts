import { browser } from '$app/environment';
import type { ComptageMatch } from '$lib/comptage/comptage.svelte.js';

/**
 * Storage slots for the one-off counter. They are deliberately distinct from
 * the tournament counter's default slot (`bcc-comptage`) so a game started
 * here never overwrites a match in progress, and vice versa.
 */
export const LIBRE_GAME_STORAGE_KEY = 'bcc-comptage-libre';
const LIBRE_MATCH_STORAGE_KEY = 'bcc-comptage-libre-match';

function isTeam(team: unknown): team is ComptageMatch['team1'] {
	if (typeof team !== 'object' || team === null) return false;
	const { name, player1, player2 } = team as Record<string, unknown>;
	return (
		typeof name === 'string' &&
		name.length > 0 &&
		typeof (player1 as { name?: unknown })?.name === 'string' &&
		typeof (player2 as { name?: unknown })?.name === 'string'
	);
}

function isMatch(match: unknown): match is ComptageMatch {
	if (typeof match !== 'object' || match === null) return false;
	const { team1, team2 } = match as Record<string, unknown>;
	return isTeam(team1) && isTeam(team2);
}

/** The teams of the game in progress, or null when nothing was set up yet. */
export function loadLibreMatch(): ComptageMatch | null {
	if (!browser) return null;
	const stored = localStorage.getItem(LIBRE_MATCH_STORAGE_KEY);
	if (!stored) return null;
	try {
		const parsed = JSON.parse(stored);
		return isMatch(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

/**
 * Remembers the teams. Whenever the roster actually changes, the points of the
 * previous game are dropped: keeping them would score new players with old
 * manches.
 */
export function saveLibreMatch(match: ComptageMatch) {
	if (!browser) return;
	const previous = localStorage.getItem(LIBRE_MATCH_STORAGE_KEY);
	const next = JSON.stringify(match);
	if (previous !== next) {
		localStorage.removeItem(LIBRE_GAME_STORAGE_KEY);
	}
	localStorage.setItem(LIBRE_MATCH_STORAGE_KEY, next);
}

/** Forgets both the teams and the game in progress. */
export function clearLibreMatch() {
	if (!browser) return;
	localStorage.removeItem(LIBRE_MATCH_STORAGE_KEY);
	localStorage.removeItem(LIBRE_GAME_STORAGE_KEY);
}
