
export function stripHowToSay(text: string) {
    const trimmed = text.trim();
  
    const match = trimmed.match(
      /^(how\s+(do\s+i|can\s+i|to)\s+say\s+(correctly\s+)?(that\s+)?(.+))/i
    );
  
    if (!match) return null;
  
    return {
      cleanedText: match[5],
      explanation:
        'You don’t need to say “how to say”. Just say the sentence.',
    };
  }
  
export function detectNonEnglish(text: string) {
    // very simple heuristic for V1
    const hasNonLatin = /[ąćęłńóśżźàèìòùáéíóúñü]/i.test(text);
    const looksPolish = /\b(jak|się|mówi|po|angielsku)\b/i.test(text);
    const looksSpanish = /\b(cómo|decir|en inglés)\b/i.test(text);
  
    if (hasNonLatin || looksPolish || looksSpanish) {
      return {
        explanation:
          '🌍 It looks like you’re asking in another language. Please write the sentence you want to say in English.',
      };
    }
  
    return null;
  }
  