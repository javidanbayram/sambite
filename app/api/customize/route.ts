import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export const maxDuration = 60; // Allow more time on Vercel to prevent generation cutoffs

/* ─────────────────────────────────────────────────────────
   POST /api/customize
   Body: { originalRecipe: string, customizationPrompt: string }
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
  let body: { originalRecipe?: string; customizationPrompt?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'Yanlış sorğu gövdəsi. "originalRecipe" və "customizationPrompt" sahələri olan JSON gözlənilirdi.' },
      { status: 400 }
    )
  }

  const originalRecipe = body.originalRecipe?.trim()
  const customizationPrompt = body.customizationPrompt?.trim()

  if (!originalRecipe || !customizationPrompt) {
    return NextResponse.json(
      { error: 'Zəhmət olmasa orijinal resepti və fərdiləşdirmə sorğusunu təqdim edin.' },
      { status: 400 }
    )
  }

  // ── 3. Build the customization prompt ─────────────────
  const prompt = `You are the head chef at Sambite Kitchen. A user has a recipe you previously generated, but they want to customize it.

Here is the ORIGINAL RECIPE:
---
${originalRecipe}
---

The user wants to make the following CUSTOMIZATION:
"${customizationPrompt}"

Please rewrite the original recipe to incorporate the user's customization. If they ask for a substitution, replace the ingredient and update the instructions accordingly. If they ask for a modification (e.g., "make it spicier"), add the necessary ingredients (like chili flakes) and update the instructions.

IMPORTANT: You MUST write your entire response in fluent, natural, and grammatically correct Azerbaijani. Use appropriate culinary terminology in Azerbaijani. Do not sound like a machine translation.

Format your response exactly like this (maintaining the same format as the original):

**Reseptin Adı**
[A creative, appetising name for the dish in Azerbaijani]

**Təxmini Vaxt**
Hazırlıq: [X] dəq · Bişirmə: [Y] dəq · Cəmi: [Z] dəq

**Nələr Lazımdır**
- [ingredient 1 with quantity]
- [ingredient 2 with quantity]
(list ONLY the ingredients that are actually used in this customized version)

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
[One helpful tip to elevate the dish or a suggested variation, reflecting the customization if appropriate]

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
    console.error('[Sambite] Gemini API error (customize):', err)

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
