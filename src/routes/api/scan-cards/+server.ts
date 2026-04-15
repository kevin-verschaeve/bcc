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

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const image = formData.get('image') as File | null;
	const atout = formData.get('atout') as string | null;

	if (!image || !atout) {
		return error(400, 'Image et couleur d\'atout requises');
	}

	const imageBuffer = await image.arrayBuffer();
	const base64 = Buffer.from(imageBuffer).toString('base64');

	let cards: Card[] = [];
	try {
		const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const result = await model.generateContent([
			{
				inlineData: {
					data: base64.split(',')[1] || base64,
					mimeType: 'image/jpeg',
				}
			},
			{
				text: PROMPT,
			},
		]);

		const response = await result.response;

		const text = response.text() ?? '';

		const clean = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
		cards = JSON.parse(clean);

		if (!Array.isArray(cards)) {
			throw new Error('Format de retour invalide.');
		}

		if (cards.length === 0 || cards.length % 4 !== 0) {
			throw new Error(`${cards.length} cartes trouvées, veuillez refaire une photo en montrant toutes les cartes.`);
		}
	} catch (e) {
		return error(500, `Impossible d\'analyser la réponse du modèle: ${e.message}`);
	}

	const points = calculateTrickPoints(cards, atout as AtoutSuit);

	return json({ cards, points });
};
