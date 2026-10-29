import { json, error } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';
import { calculateTrickPoints, type Card, type AtoutSuit } from '$lib/cardPoints';
import type { RequestHandler } from './$types';

const PROMPT = `You are analyzing a photo of playing cards from a French Belote game.
Belote uses a 32-card deck: ranks 7, 8, 9, 10, J, Q, K, A in 4 suits (♥ ♦ ♠ ♣).
The cards may be spread out flat on a table or stacked in tricks (groups of 4 cards).

List ALL distinct playing cards visible in the image. Do not count the same card twice.
Return ONLY a valid JSON array. Each element: {"rank": "A|K|Q|J|10|9|8|7", "suit": "♥|♦|♠|♣"}

Example: [{"rank":"A","suit":"♥"},{"rank":"J","suit":"♠"},{"rank":"10","suit":"♦"}]

Return ONLY the JSON array, no explanation, no markdown.`;

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ATOUTS = ['♥', '♦', '♠', '♣', 'TA', 'SA'];

// Limite par IP, en mémoire : best effort (chaque instance serverless a son propre compteur).
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
	const now = Date.now();
	const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
	recent.push(now);
	hits.set(ip, recent);
	if (hits.size > 1000) {
		for (const [key, times] of hits) {
			if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
		}
	}
	return recent.length > RATE_LIMIT;
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	if (isRateLimited(getClientAddress())) {
		return error(429, 'Trop de requêtes, réessayez dans une minute');
	}

	const formData = await request.formData();
	const image = formData.get('image');
	const atout = formData.get('atout');

	if (!(image instanceof File) || typeof atout !== 'string' || !ATOUTS.includes(atout)) {
		return error(400, 'Image et couleur d\'atout requises');
	}
	if (!ALLOWED_MIME_TYPES.includes(image.type)) {
		return error(415, 'Format d\'image non supporté (JPEG, PNG ou WebP)');
	}
	if (image.size > MAX_IMAGE_BYTES) {
		return error(413, 'Image trop volumineuse (4 Mo maximum)');
	}

	const base64 = Buffer.from(await image.arrayBuffer()).toString('base64');

	let cards: Card[];
	try {
		const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
		const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

		const result = await model.generateContent([
			{ inlineData: { data: base64, mimeType: image.type } },
			{ text: PROMPT }
		]);

		const text = result.response.text() ?? '';
		const clean = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
		cards = JSON.parse(clean);
	} catch (e) {
		const message = e instanceof Error ? e.message : String(e);
		return error(500, `Impossible d'analyser la réponse du modèle: ${message}`);
	}

	if (!Array.isArray(cards)) {
		return error(500, 'Impossible d\'analyser la réponse du modèle: format de retour invalide');
	}
	if (cards.length === 0 || cards.length % 4 !== 0) {
		return error(
			422,
			`${cards.length} cartes trouvées, veuillez refaire une photo en montrant toutes les cartes.`
		);
	}

	const points = calculateTrickPoints(cards, atout as AtoutSuit);

	return json({ cards, points });
};
