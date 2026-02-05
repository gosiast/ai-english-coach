import { LTMatch } from "./types";

export function getExplanation(match: LTMatch) {
  const msg = match.message.toLowerCase();
  const replacement = match.replacements[0]?.value;

  if (msg.includes('plural')) {
    return 'We use plural words for more than one thing.';
  }

  if (msg.includes('spelling') && replacement) {
    return `The correct spelling is "${replacement}".`;
  }

  if (msg.includes('uppercase')) {
    return 'We start a sentence with a capital letter.';
  }

  if ((msg.includes('verb') || msg.includes('did you mean')) && replacement) {
    return `We say "${replacement}" here.`;
  }

  return 'This sentence has been corrected.';
}
