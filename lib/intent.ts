
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
  