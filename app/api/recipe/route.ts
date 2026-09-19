import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export const maxDuration = 60; // Allow more time on Vercel to prevent generation cutoffs
/* ─────────────────────────────────────────────────────────
   POST /api/recipe
   Body: { ingredients: string }
   Returns: { recipe: string }
───────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  // ── 1. Check API key ─────────────────────────────────
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('[Sambite] GEMINI_API_KEY environment variable is not set.')
    return NextResponse.json(
      { error: 'AI xidməti konfiqurasiya edilməyib. Zəhmət olmasa GEMINI_API_KEY mühit dəyişənini təyin edin.' },
      { status: 503 }
    )
  }

  // ── 2. Parse & validate request body ─────────────────
  let body: { ingredients?: string; dietaryTags?: string[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'Yanlış sorğu gövdəsi. "ingredients" sahəsi olan JSON gözlənilirdi.' },
      { status: 400 }
    )
  }

  const ingredients = body.ingredients?.trim()
  if (!ingredients || ingredients.length < 3) {
    return NextResponse.json(
      { error: 'Zəhmət olmasa ən azı bir ərzaq təqdim edin.' },
      { status: 400 }
    )
  }

  const dietaryTags = body.dietaryTags || []
  const dietaryRule = dietaryTags.length > 0
    ? `\n\nDIETARY RESTRICTIONS — CRITICAL:\nThe user has specified the following dietary restrictions: ${dietaryTags.join(', ')}.\nThe recipe MUST strictly adhere to these diets. Do NOT include any ingredient, even from the list above, if it violates these dietary restrictions.`
    : ''

  // ── 3. Build the Sambite chef prompt ─────────────────
  const prompt = `You are the head chef at Sambite Kitchen — a prestigious culinary studio that specialises in transforming humble, leftover ingredients into extraordinary gourmet dishes. You are creative, encouraging, and knowledgeable about global cuisines.

A user has EXACTLY these ingredients available at home:
${ingredients}

⚠️ STRICT RULE — VERY IMPORTANT:
You must ONLY use the ingredients listed above. Do NOT add any other ingredients — not oil, not butter, not salt, not vinegar, not water — unless they are explicitly in the list above. If the user did not list oil, the recipe must be completely oil-free. If they did not list salt, do not use salt. Respect the user's ingredient list absolutely and completely.${dietaryRule}

Create a delicious, creative, and easy-to-follow recipe using ONLY these ingredients.

IMPORTANT: You MUST write your entire response in fluent, natural, and grammatically correct Azerbaijani. Use appropriate culinary terminology in Azerbaijani. Do not sound like a machine translation.

Format your response exactly like this (but translated to Azerbaijani):

**Reseptin Adı**
[A creative, appetising name for the dish in Azerbaijani]

**Təxmini Vaxt**
Hazırlıq: [X] dəq · Bişirmə: [Y] dəq · Cəmi: [Z] dəq

**Nələr Lazımdır**
- [ingredient 1 with quantity]
- [ingredient 2 with quantity]
(list ONLY the ingredients from the user's list that you are actually using)

**Qida Dəyəri və Sağlamlıq**
- Kalori: [Estimated total calories] kcal
- Zülal: [Estimated protein] q
- Karbohidrat: [Estimated carbs] q
- Uyğunluq: [Dietary tags, e.g., Veqan, Qlütensiz, Keto, Az kalorili]

**Addım-addım Təlimatlar**
1. [First step – clear and concise]
2. [Second step]
3. [Continue numbering all steps]

**Şefin Məsləhəti**
[One helpful tip to elevate the dish or a suggested variation, using only the available ingredients]

Be warm, precise, and inspiring. Make the user feel like a professional chef.`

  // ── 4. Call Google Gemini 3.6 Flash ─────────────────
  try {
    const ai = new GoogleGenAI({ apiKey })

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        temperature: 0.85,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    })

    const recipeText = response.text

    if (!recipeText) {
      throw new Error('Gemini returned an empty response.')
    }

    return NextResponse.json({ recipe: recipeText }, { status: 200 })
  } catch (err: unknown) {
    console.error('[Sambite] Gemini API error:', err)

    const message =
      err instanceof Error ? err.message : 'An unexpected error occurred while generating the recipe.'

    // Surface a user-friendly error
    if (message.includes('API_KEY_INVALID') || message.includes('PERMISSION_DENIED')) {
      return NextResponse.json(
        { error: 'AI xidməti API açarını rədd etdi. Zəhmət olmasa GEMINI_API_KEY-i yoxlayın.' },
        { status: 401 }
      )
    }

    if (message.includes('QUOTA') || message.includes('429')) {
      return NextResponse.json(
        { error: 'AI xidmətinin limiti müvəqqəti dolub. Zəhmət olmasa bir an gözləyin və yenidən cəhd edin.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Şef AI müvəqqəti olaraq əlçatmazdır. Zəhmət olmasa bir an sonra yenidən cəhd edin.' },
      { status: 500 }
    )
  }
}
