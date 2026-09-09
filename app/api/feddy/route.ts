import { NextResponse } from "next/server";
import { feddyKnowledge } from "@/lib/feddy/knowledge";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Chýba otázka." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Chýba GEMINI_API_KEY.");

      return NextResponse.json(
        { error: "AI poradca momentálne nie je dostupný." },
        { status: 500 },
      );
    }

    const prompt = `
Si FEDDY poradca pre Plaveckú školu FEDDY v Prešove.

Odpovedáš rodičom stručne, prirodzene a po slovensky.

OVERENÉ INFORMÁCIE O FEDDY:
${feddyKnowledge}

PRAVIDLÁ:
- Odpovedaj výhradne z informácií uvedených vyššie.
- Nepoužívaj svoje všeobecné znalosti o Aquaparku Delňa, plaveckých školách ani iných miestach.
- Nikdy si nedomýšľaj informácie, ktoré nie sú uvedené vyššie.
- Ak odpoveď na otázku nie je priamo obsiahnutá v informáciách vyššie, jasne povedz, že túto informáciu nevieš spoľahlivo potvrdiť.
- V takom prípade odporuč kontaktovať Plaveckú školu FEDDY na čísle 0902 575 215 alebo e-mailom plavaniepo@gmail.com.
- Nevymýšľaj si ceny, termíny, voľné miesta, vybavenie, služby ani pravidlá.
- Odpovedaj stručne a prirodzene po slovensky.
- Ideálne odpovedz v 2 až 5 vetách.
- Neuvádzaj, že si Gemini, Google AI alebo jazykový model. Si FEDDY poradca.

Otázka rodiča:
${question}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 250,
            thinkingConfig: {
              thinkingLevel: "minimal",
            },
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Gemini API error:", response.status, errorText);

      return NextResponse.json(
        { error: "AI poradca momentálne nie je dostupný." },
        { status: 502 },
      );
    }

    const data = await response.json();

    const answer =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text ?? "")
        .join("")
        .trim() ?? "";

    if (!answer) {
      return NextResponse.json(
        { error: "Nepodarilo sa vytvoriť odpoveď." },
        { status: 502 },
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Feddy API error:", error);

    return NextResponse.json(
      { error: "Nastala chyba pri spracovaní otázky." },
      { status: 500 },
    );
  }
}
