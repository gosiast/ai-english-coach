import { NextResponse } from 'next/server';

import {
  fixMissingVerb,
  fixMissingToBe,
  fixPastWhenFutureIsIntended,
  fixWrongTimePreposition,
  fixMissingAtForTime,
  fixThisThese,
  fixVerbAsJob,
  fixWorkLikeJob,
} from '@/lib/rules';

import { getExplanation } from '@/lib/explanations';
import {
  applyPronunciationRules,
  extractTimeHint,
} from '@/lib/pronunciation';

import { detectNonEnglish, stripHowToSay } from '@/lib/intent';
import { LTMatch } from '@/lib/types';

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text || !text.trim()) {
    return NextResponse.json(
      { error: 'No text provided' },
      { status: 400 }
    );
  }

  /* ------------------------------------------
   * 0️⃣ Language detection FIRST
   * ------------------------------------------ */
  const languageHint = detectNonEnglish(text);
  if (languageHint) {
    return NextResponse.json({
      corrected: '',
      explanation: languageHint.explanation,
      pronunciation: '',
      timeHint: null,
    });
  }

  /* ------------------------------------------
   * 1️⃣ Intent cleanup (“how to say”)
   * ------------------------------------------ */
  let workingText = text;
  let extraExplanation: string | null = null;

  const howToSay = stripHowToSay(workingText);
  if (howToSay) {
    workingText = howToSay.cleanedText;
    extraExplanation = howToSay.explanation;
  }

  /* ------------------------------------------
   * 2️⃣ Teacher grammar rules (priority order)
   * ------------------------------------------ */
  const rules = [
    fixMissingVerb,              // "i back at 20"
    fixVerbAsJob,                // "i come as driver"
    fixWorkLikeJob,              // "i work like guide"
    fixMissingToBe,              // "i happy"
    fixPastWhenFutureIsIntended, // "i came back at 8"
    fixWrongTimePreposition,     // "back in 8"
    fixMissingAtForTime,         // "back 8"
    fixThisThese,                // "this is apples"
  ];

  for (const rule of rules) {
    const result = rule(workingText);

    if (result) {
      const timeHint = extractTimeHint(result.corrected);

      return NextResponse.json({
        corrected: result.corrected,
        explanation: extraExplanation
          ? `${extraExplanation} ${result.explanation}`
          : result.explanation,
        pronunciation: applyPronunciationRules(
          result.corrected
        ),
        timeHint: timeHint
          ? `${timeHint.original} means ${timeHint.spoken}.`
          : null,
      });
    }
  }

  /* ------------------------------------------
   * 3️⃣ LanguageTool fallback
   * ------------------------------------------ */
  const params = new URLSearchParams({
    text: workingText,
    language: 'en-US',
  });

  const res = await fetch(
    'https://api.languagetool.org/v2/check',
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: 'Grammar check failed' },
      { status: 500 }
    );
  }

  const data = await res.json();
  const matches: LTMatch[] = data.matches ?? [];

  /* ------------------------------------------
   * 4️⃣ No issues
   * ------------------------------------------ */
  if (!matches.length) {
    return NextResponse.json({
      corrected: workingText,
      explanation: 'This sentence is correct.',
      pronunciation: applyPronunciationRules(
        workingText
      ),
      timeHint: null,
    });
  }

  /* ------------------------------------------
   * 5️⃣ Apply LanguageTool fixes
   * ------------------------------------------ */
  let corrected = workingText;

  for (const match of [...matches].reverse()) {
    const replacement =
      match.replacements[0]?.value;
    if (!replacement) continue;

    corrected =
      corrected.slice(0, match.offset) +
      replacement +
      corrected.slice(
        match.offset + match.length
      );
  }

  const explanation = getExplanation(matches[0]);
  const timeHint = extractTimeHint(corrected);

  /* ------------------------------------------
   * 6️⃣ Final response
   * ------------------------------------------ */
  return NextResponse.json({
    corrected,
    explanation,
    pronunciation:
      applyPronunciationRules(corrected),
    timeHint: timeHint
      ? `${timeHint.original} means ${timeHint.spoken}.`
      : null,
  });
}
