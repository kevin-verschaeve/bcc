import { browser } from '$app/environment';
import { toast } from 'svelte-sonner';
import { WINNING_SCORE } from '$lib/scoreUtils';

export const suits = ['♥', '♠', '♦', '♣', 'TA', 'SA'] as const;
export const pointOptions = [
	'80',
	'90',
	'100',
	'110',
	'120',
	'130',
	'140',
	'150',
	'Capot',
	'Générale'
] as const;

export const coincheOptions = [
	{ value: 'none', label: 'RIEN', multiplier: 1 },
	{ value: 'coinche', label: 'COINCHE ×2', multiplier: 2 },
	{ value: 'surcoinche', label: 'SURCOINCHE ×4', multiplier: 4 }
] as const;
export type CoincheLevel = (typeof coincheOptions)[number]['value'];

const MATCH_STORAGE_PREFIX = 'bcc-comptage-';
const LEGACY_STORAGE_KEY = 'bcc-comptage';

/** Storage slot of a tournament match, one per match so counters never mix. */
export const matchStorageKey = (matchId: number | string) => MATCH_STORAGE_PREFIX + matchId;

const MAX_AGE_MS = 24 * 60 * 60 * 1000;

const MAX_IMAGE_SIDE = 1600;

async function resizeImage(file: File): Promise<Blob> {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
	const canvas = document.createElement('canvas');
	canvas.width = Math.round(bitmap.width * scale);
	canvas.height = Math.round(bitmap.height * scale);
	canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	bitmap.close();
	return new Promise((resolve, reject) =>
		canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('resize'))), 'image/jpeg', 0.85)
	);
}

export type ScanCard = { rank: string; suit: string };
export type ScanResult = { cards: ScanCard[]; points: number };

export type ComptagePlayer = { name: string };

export type ComptageTeam = {
	name: string;
	player1: ComptagePlayer;
	player2: ComptagePlayer;
};

/**
 * Everything the counter needs to know about the two teams facing each other.
 * A tournament match row satisfies it as-is; a one-off game builds it by hand.
 */
export type ComptageMatch = {
	team1: ComptageTeam;
	team2: ComptageTeam;
};

export type ComptageOptions = {
	/** localStorage slot holding the in-progress game. */
	storageKey: string;
};

export class ComptageGame {
	readonly match: ComptageMatch;
	readonly storageKey: string;

	// Game state
	team1Points = $state<number[]>([]);
	team2Points = $state<number[]>([]);
	taker = $state<string | null>(null);
	selectedSuit = $state<string | null>(null);
	selectedPoints = $state<string | null>(null);
	selectedTeam = $state<'team1' | 'team2' | null>(null);
	teamBelote = $state<'team1' | 'team2' | null>(null);
	coinche = $state<CoincheLevel>('none');
	pointInput = $state<number | null>(null);
	showSelection = $state(true);
	askBeloteNeeded = $state(false);

	// Dealer state
	dealerOrder = $state<string[]>([]);
	dealerIndex = $state(0);
	settingUpDealer = $state(false);
	dealerSetupSelections = $state<string[]>([]);

	// Scan state
	scanOpen = $state(false);
	scanLoading = $state(false);
	scanResult = $state<ScanResult | null>(null);
	scanError = $state<string | null>(null);

	// Derived
	team1Total = $derived(this.team1Points.reduce((sum, p) => sum + p, 0));
	team2Total = $derived(this.team2Points.reduce((sum, p) => sum + p, 0));
	hasWinner = $derived(this.team1Total >= WINNING_SCORE || this.team2Total >= WINNING_SCORE);
	currentDealer = $derived(
		this.dealerOrder.length === 4 ? this.dealerOrder[this.dealerIndex % 4] : null
	);

	/** Name of the team that reached the winning score (only meaningful once `hasWinner`). */
	get winnerTeamName() {
		return this.team1Total >= WINNING_SCORE ? this.match.team1.name : this.match.team2.name;
	}

	constructor(match: ComptageMatch, options: ComptageOptions) {
		this.match = match;
		this.storageKey = options.storageKey;

		this.#purgeStale();
		const initial = this.#loadFromStorage();
		if (initial) {
			this.team1Points = initial.team1Points ?? [];
			this.team2Points = initial.team2Points ?? [];
			this.taker = initial.taker ?? null;
			this.selectedSuit = initial.selectedSuit ?? null;
			this.selectedPoints = initial.selectedPoints ?? null;
			this.selectedTeam = initial.selectedTeam ?? null;
			this.teamBelote = initial.teamBelote ?? null;
			this.coinche = coincheOptions.some((o) => o.value === initial.coinche) ? initial.coinche : 'none';
			this.dealerOrder = this.#isValidDealerOrder(initial.dealerOrder) ? initial.dealerOrder : [];
			this.dealerIndex = initial.dealerIndex ?? 0;
		}

		this.pointInput = Number(this.selectedPoints);

		$effect(() => {
			this.showSelection =
				(!this.taker || !this.selectedSuit || !this.selectedPoints) && !this.hasWinner;
		});

		$effect(() => {
			if (browser) {
				localStorage.setItem(
					this.storageKey,
					JSON.stringify({
						updatedAt: Date.now(),
						team1Points: this.team1Points,
						team2Points: this.team2Points,
						taker: this.taker,
						selectedSuit: this.selectedSuit,
						selectedPoints: this.selectedPoints,
						dealerOrder: this.dealerOrder,
						dealerIndex: this.dealerIndex,
						selectedTeam: this.selectedTeam,
						teamBelote: this.teamBelote,
						coinche: this.coinche
					})
				);
			}
		});
	}

	// Supprime l'ancienne clé globale et les sauvegardes d'autres matchs périmées
	// (seules les clés `bcc-comptage-<id>` de matchs de tournoi : le comptage libre garde les siennes)
	#purgeStale() {
		if (!browser) return;
		localStorage.removeItem(LEGACY_STORAGE_KEY);
		for (const key of Object.keys(localStorage)) {
			if (!/^bcc-comptage-\d+$/.test(key) || key === this.storageKey) continue;
			try {
				const { updatedAt } = JSON.parse(localStorage.getItem(key) ?? '{}');
				if (!updatedAt || Date.now() - updatedAt > MAX_AGE_MS) localStorage.removeItem(key);
			} catch {
				localStorage.removeItem(key);
			}
		}
	}

	#loadFromStorage() {
		if (!browser) return null;
		const stored = localStorage.getItem(this.storageKey);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {
				return null;
			}
		}
		return null;
	}

	#isValidDealerOrder(order: unknown): order is string[] {
		if (!Array.isArray(order) || order.length !== 4) return false;
		const validNames = [
			this.match.team1.player1.name,
			this.match.team1.player2.name,
			this.match.team2.player1.name,
			this.match.team2.player2.name
		];
		return order.every((n) => validNames.includes(n)) && new Set(order).size === 4;
	}

	getPlayerTeam(playerName: string): 'team1' | 'team2' | null {
		if (
			playerName === this.match.team1.player1.name ||
			playerName === this.match.team1.player2.name
		)
			return 'team1';
		if (
			playerName === this.match.team2.player1.name ||
			playerName === this.match.team2.player2.name
		)
			return 'team2';
		return null;
	}

	advanceDealer() {
		if (this.dealerOrder.length === 4) {
			this.dealerIndex = (this.dealerIndex + 1) % 4;
		}
	}

	startDealerSetup() {
		this.settingUpDealer = true;
		this.dealerSetupSelections = [];
	}

	cancelDealerSetup() {
		this.settingUpDealer = false;
		this.dealerSetupSelections = [];
	}

	addToDealerSetup(playerName: string) {
		if (this.dealerSetupSelections.includes(playerName)) return;

		if (this.dealerSetupSelections.length > 0) {
			const lastPlayer = this.dealerSetupSelections[this.dealerSetupSelections.length - 1];
			const lastTeam = this.getPlayerTeam(lastPlayer);
			const thisTeam = this.getPlayerTeam(playerName);
			if (lastTeam === thisTeam) return;
		}

		this.dealerSetupSelections = [...this.dealerSetupSelections, playerName];

		if (this.dealerSetupSelections.length === 4) {
			this.dealerOrder = [...this.dealerSetupSelections];
			this.dealerIndex = 0;
			this.settingUpDealer = false;
			this.dealerSetupSelections = [];
		}
	}

	isDealerSetupPlayerDisabled(_playerName: string, team: 'team1' | 'team2'): boolean {
		if (this.dealerSetupSelections.length === 0) return false;
		const lastPlayer = this.dealerSetupSelections[this.dealerSetupSelections.length - 1];
		const lastTeam = this.getPlayerTeam(lastPlayer);
		return lastTeam === team;
	}

	selectTaker(name: string, team: 'team1' | 'team2') {
		this.taker = this.taker === name ? null : name;
		if (this.selectedTeam !== team) {
			this.selectTeam(team);
		}
		if (!this.taker) {
			this.selectedTeam = null;
		}
	}

	selectSuit(suit: string) {
		this.selectedSuit = this.selectedSuit === suit ? null : suit;
	}

	selectPoints(points: string) {
		this.selectedPoints = this.selectedPoints === points ? null : points;
		this.pointInput = Number(this.selectedPoints);
	}

	selectCoinche(level: CoincheLevel) {
		this.coinche = level;
		if (this.taker && this.selectedSuit && this.selectedPoints) this.showSelection = false;
	}

	get coincheMultiplier() {
		return coincheOptions.find((o) => o.value === this.coinche)!.multiplier;
	}

	selectTeam(team: 'team1' | 'team2') {
		this.selectedTeam = this.selectedTeam === team ? null : team;
	}

	resetSelection() {
		this.taker = null;
		this.selectedSuit = null;
		this.selectedPoints = null;
		this.selectedTeam = null;
		this.teamBelote = null;
		this.coinche = 'none';
	}

	addPoints() {
		const value = parseInt(String(this.pointInput));
		const contract = Number(this.selectedPoints);

		const numericContract = this.selectedPoints !== null && !isNaN(contract);
		// L'équipe preneuse a la belote : elle a pu servir à faire le contrat, on demande à l'utilisateur
		const askBelote =
			numericContract && this.selectedTeam !== null && this.teamBelote === this.selectedTeam;

		if (value < 80 && value !== 20) {
			toast.error('Le score ne peut pas être inférieur à 80 (sauf 20 pour la belote) !');
			return;
		}

		if (numericContract && value < contract) {
			toast.error('Le score ne peux pas être différent du contrat !');
			return;
		}

		if (!isNaN(value) && value > 0 && this.selectedTeam) {
			if (askBelote) {
				this.askBeloteNeeded = true;
				return;
			}
			this.#doAddPoints(this.selectedTeam, this.#scoredPoints(value));
		}
	}

	// On ne marque que son contrat (pas les points réalisés en plus) ; Capot/Générale : points saisis
	#scoredPoints(value: number) {
		const contract = Number(this.selectedPoints);
		return this.selectedPoints !== null && !isNaN(contract) ? contract : value;
	}

	// Si la belote était nécessaire au contrat, elle n'est pas comptée : seul le contrat est gardé
	answerBeloteNeeded(needed: boolean) {
		this.askBeloteNeeded = false;
		if (!this.selectedTeam) return;
		const points = this.#scoredPoints(parseInt(String(this.pointInput)));
		this.#doAddPoints(this.selectedTeam, points, !needed);
	}

	setDedans() {
		if (this.selectedTeam === null) {
			toast.error('Sélectionner une équipe !');
			return;
		}
		this.#doAddPoints(this.selectedTeam === 'team1' ? 'team2' : 'team1', 160);
	}

	#doAddPoints(team: 'team1' | 'team2', basePoints: number, countBelote = true) {
		const points = basePoints * this.coincheMultiplier;
		const belote = countBelote && this.teamBelote === team ? 20 : 0;
		if (team === 'team1') {
			this.team1Points = [...this.team1Points, points + belote];
		} else {
			this.team2Points = [...this.team2Points, points + belote];
		}
		this.pointInput = null;

		if (this.teamBelote !== null && this.teamBelote !== team) {
			if (this.teamBelote === 'team1') {
				this.team1Points = [...this.team1Points, 20];
			} else {
				this.team2Points = [...this.team2Points, 20];
			}
		}

		this.resetSelection();
		this.advanceDealer();
	}

	setBelote(team: 'team1' | 'team2' | null) {
		this.teamBelote = this.teamBelote === team ? null : team;
	}

	handlePointInputKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			this.addPoints();
		}
	}

	removePointTeam1(index: number) {
		this.team1Points = this.team1Points.filter((_, i) => i !== index);
	}

	removePointTeam2(index: number) {
		this.team2Points = this.team2Points.filter((_, i) => i !== index);
	}

	resetAll(askConfirmation: boolean) {
		if (
			askConfirmation &&
			!confirm('Voulez-vous vraiment réinitialiser tous les scores de cette partie ?')
		) {
			return;
		}
		this.team1Points = [];
		this.team2Points = [];
		this.resetSelection();
		if (browser) {
			localStorage.removeItem(this.storageKey);
		}
	}

	toggleScan() {
		if (!this.selectedSuit) {
			toast.error("Sélectionner la couleur d'atout d'abord !");
			return;
		}
		this.scanResult = null;
		this.scanError = null;
		this.scanOpen = !this.scanOpen;
	}

	async analyzePhoto(file: File) {
		this.scanLoading = true;
		this.scanError = null;
		this.scanResult = null;

		const formData = new FormData();
		try {
			formData.append('image', await resizeImage(file), 'photo.jpg');
			formData.append('atout', this.selectedSuit!);

			const res = await fetch('/api/scan-cards', { method: 'POST', body: formData });
			if (!res.ok) {
				const body = await res.json().catch(() => null);
				this.scanError = body?.message ?? "Erreur lors de l'analyse";
			} else {
				this.scanResult = await res.json();
			}
		} catch {
			this.scanError = 'Erreur réseau, réessayez';
		} finally {
			this.scanLoading = false;
		}
	}
}
