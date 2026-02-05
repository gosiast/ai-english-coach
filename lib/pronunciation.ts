export function convertTimeContext(text: string) {
    return text
      // at 20 → at eight p.m.
      .replace(/\bat\s+20\b/i, 'at eight p.m.')
  
      // at 8 → at eight a.m.
      .replace(/\bat\s+8\b/i, 'at eight a.m.');
  }
  
  export function numberToWords(text: string) {
    return text.replace(/\b\d+\b/g, (match) => {
      const map: Record<string, string> = {
        '20': 'twenty',
        '8': 'eight',
      };
  
      return map[match] ?? match;
    });
  }

  function hourToSpoken(hour: number) {
    if (hour === 12) return 'twelve p.m.';
    if (hour === 0) return 'twelve a.m.';
    if (hour > 12) return `${hour - 12} p.m.`;
    return `${hour} a.m.`;
  }
  
  export function extractTimeHint(text: string) {
    const match = text.match(/\bat\s+(\d{1,2})\b/i);
    if (!match) return null;
  
    const hour = Number(match[1]);
  
    // Strict A1 rule: treat 12–23 as time
    if (hour >= 12 && hour <= 23) {
      return {
        original: hour,
        spoken: hourToSpoken(hour),
      };
    }
  
    return null;
  }
  
  export function applyPronunciationRules(text: string) {
    const time = extractTimeHint(text);
  
    if (!time) return text;
  
    return text.replace(
      new RegExp(`\\bat\\s+${time.original}\\b`, 'i'),
      `at ${time.spoken}`
    );
  }
  