import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { text } = await request.json();

  // 👇 THIS is where your prompt lives
  const systemPrompt = `
You are an English coach helping people working in tourism.
The user may have very basic English.

Tasks:
1. Correct the sentence naturally.
2. Keep it polite and simple.
3. Explain the correction in very simple English.
4. Do not use grammar jargon.

Return JSON with:
- corrected
- explanation
`;

  // For now, fake the AI response (important step!)
  return NextResponse.json({
    corrected: 'I will pick you up at 8:00 AM.',
    explanation: 'We use “will” to talk about future plans.',
  });
}
