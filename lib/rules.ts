export function fixMissingVerb(text: string) {
  const trimmed = text.trim();

  const match = trimmed.match(
    /^i\s+(\w+)\s+at\s+(\d+)/i
  );

  if (!match) return null;

  const state = match[1];
  const time = match[2];

  return {
    corrected: `I will be ${state} at ${time}`,
    explanation: 'We need a verb. We say “will be”.',
  };
}

  
  export function fixWrongTimePreposition(text: string) {
    const trimmed = text.trim();
  
    if (/back\s+in\s+\d+/i.test(trimmed)) {
      return {
        corrected: trimmed.replace(
          /back\s+in\s+(\d+)/i,
          'back at $1'
        ),
        explanation: 'We say “at” for a time.',
      };
    }
  
    return null;
  }
  
  export function fixMissingToBe(text: string) {
    const trimmed = text.trim();
  
    if (/^i\s+(happy|ready|here|tired)\b/i.test(trimmed)) {
      return {
        corrected: trimmed.replace(/^i\s+/i, 'I am '),
        explanation: 'We need “am” with “I”.',
      };
    }
  
    return null;
  }
  
  export function fixPastWhenFutureIsIntended(text: string) {
    const trimmed = text.trim();
  
    const match = trimmed.match(
      /^i\s+(\w+ed)\s+at\s+(\d+)/i
    );
  
    if (!match) return null;
  
    const verb = match[1];
    const time = match[2];
  
    return {
      corrected: `I will ${verb.replace(/ed$/, '')} at ${time}`,
      explanation: 'We use “will” to talk about the future.',
    };
  }
  
  
  export function fixThisThese(text: string) {
    const trimmed = text.trim();
  
    if (/^this\s+is\s+\w+s\b/i.test(trimmed)) {
      return {
        corrected: trimmed.replace(/^this\s+is/i, 'These are'),
        explanation: 'We use “these are” for more than one thing.',
      };
    }
  
    return null;
  }
  
  export function fixMissingAtForTime(text: string) {
    const trimmed = text.trim();
  
    if (/\b(back|open|close)\s+\d+\b/i.test(trimmed)) {
      return {
        corrected: trimmed.replace(
          /\b(back|open|close)\s+(\d+)/i,
          '$1 at $2'
        ),
        explanation: 'We say “at” with a time.',
      };
    }
  
    return null;
  }
  
  export function fixVerbAsJob(text: string) {
    const trimmed = text.trim();
  
    const match = trimmed.match(
      /^i\s+(\w+)\s+as\s+(\w+)(.*)$/i
    );
  
    if (!match) return null;
  
    const verb = match[1];
    const job = match[2];
    const rest = match[3] ?? '';
  
    return {
      corrected: `I will ${verb} as a ${job}${rest}`,
      explanation:
        'We use “will” for the future and “a” before a job.',
    };
  }
  
  export function fixWorkLikeJob(text: string) {
    const trimmed = text.trim();
  
    const match = trimmed.match(
      /^i\s+work\s+like\s+(\w+)/i
    );
  
    if (!match) return null;
  
    const job = match[1];
  
    return {
      corrected: `I work as a ${job}`,
      explanation:
        'We say “work as a …” for jobs, not “work like”.',
    };
  }
  