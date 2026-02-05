import { NextResponse } from 'next/server';
    import { fixMissingToBe, fixWrongTimePreposition, fixPastWhenFutureIsIntended, fixMissingAtForTime, fixMissingVerb, fixThisThese, fixVerbAsJob, fixWorkLikeJob } from '@/lib/rules';
import { getExplanation } from '@/lib/explanations';
import { applyPronunciationRules, extractTimeHint } from '@/lib/pronunciation';
import { LTMatch } from '@/lib/types';
import { stripHowToSay } from '@/lib/intent';

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text || !text.trim()) {
    return NextResponse.json(
      { error: 'No text provided' },
      { status: 400 }
    );
  }

/* ------------------------------------------
 * 1️⃣ Custom beginner rules (teacher logic)
 * ------------------------------------------ */

let workingText = text;
let extraExplanation: string | null = null;

// 1️⃣ Handle “how to say” FIRST (DO NOT RETURN)
const howToSay = stripHowToSay(workingText);
if (howToSay) {
  workingText = howToSay.cleanedText;
  extraExplanation = howToSay.explanation;
}

// 2️⃣ Grammar rules
const rules = [
    fixMissingVerb,        // "i back at 20"
    fixVerbAsJob,          // "i come as driver"
    fixMissingToBe,        // "i happy"
    fixPastWhenFutureIsIntended,
    fixWrongTimePreposition,
    fixMissingAtForTime,
    fixThisThese,
    fixWorkLikeJob,
  ];  

for (const rule of rules) {
  const result = rule(workingText);

  if (result) {
    return NextResponse.json({
      corrected: result.corrected,
      explanation: extraExplanation
        ? `${extraExplanation} ${result.explanation}`
        : result.explanation,
      pronunciation: applyPronunciationRules(result.corrected),
      timeHint: extractTimeHint(result.corrected),
    });
  }
}


  /* ------------------------------------------
   * 2️⃣ LanguageTool grammar check
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
   * 3️⃣ No grammar issues
   * ------------------------------------------ */
  if (!matches.length) {
    const pronunciation = applyPronunciationRules(text);

    return NextResponse.json({
      corrected: text,
      explanation: 'This sentence is correct.',
      pronunciation,
    });
  }

  /* ------------------------------------------
   * 4️⃣ Apply ALL grammar fixes
   * ------------------------------------------ */
  let corrected = text;

  // IMPORTANT: reverse order
  for (const match of [...matches].reverse()) {
    const replacement = match.replacements[0]?.value;
    if (!replacement) continue;

    corrected =
      corrected.slice(0, match.offset) +
      replacement +
      corrected.slice(match.offset + match.length);
  }

  /* ------------------------------------------
   * 5️⃣ Pick ONE beginner explanation
   * ------------------------------------------ */
  const explanation = getExplanation(matches[0]);

  /* ------------------------------------------
   * 6️⃣ Pronunciation (spoken English)
   * ------------------------------------------ */
  const pronunciation = applyPronunciationRules(corrected);

  /* ------------------------------------------
   * 7️⃣ Final response
   * ------------------------------------------ */
  return NextResponse.json({
    corrected,
    explanation,
    pronunciation,
  });
}
