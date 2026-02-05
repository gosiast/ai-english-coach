'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Footer from './components/footer';

// 🔊 Speech helper (UI-only)
function speak(text: string) {
  if (typeof window === 'undefined') return;
  if (!window.speechSynthesis) return;

  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.85;
  utterance.pitch = 1.05;
  utterance.volume = 1;

  speechSynthesis.speak(utterance);
}

export default function HomePage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    corrected: string;
    explanation: string;
    pronunciation: string;
    timeHint?: string;
  } | null>(null);
  const [happyUsers, setHappyUsers] = useState<number>(0);

  useEffect(() => {
    const hasVisited = localStorage.getItem('aec_visited');
  
    if (!hasVisited) {
      fetch('/api/views', { method: 'POST' })
        .then(res => res.json())
        .then(data => setHappyUsers(data.happyUsers));
  
      localStorage.setItem('aec_visited', 'true');
    } else {
      fetch('/api/views', { method: 'GET' })
        .then(res => res.json())
        .then(data => setHappyUsers(data.happyUsers));
    }
  }, []);
  

  
  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });

      const data = await response.json();
      setResult(data);
   
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background to-muted/30">
        <Card className="w-full max-w-md shadow-lg rounded-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">
              AI English Coach
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Write a sentence. I’ll help you say it better.
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Example: "i back at 20"'
              className="min-h-[110px] text-base"
            />

            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Thinking…' : 'Help me say this'}
            </Button>

            {result && (
              <div className="rounded-xl border bg-muted/40 p-4 space-y-4">
                {/* Corrected */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      Say this instead
                    </p>

                    <button
                      onClick={() =>
                        speak(
                          result.pronunciation ??
                            result.corrected
                        )
                      }
                      className="text-sm underline hover:opacity-80"
                    >
                      🔊 Listen
                    </button>
                  </div>

                  <p className="text-lg font-semibold">
                    {result.corrected}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    💬 Say it like this when you talk.
                  </p>
                </div>

                {/* Explanation */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Why?
                  </p>
                  <p>{result.explanation}</p>
                </div>

                {/* Time hint */}
                {result.timeHint && (
                  <p className="text-sm text-muted-foreground">
                    🕗 {result.timeHint}
                  </p>
                )}

                {/* Positive feedback */}
                <p className="text-sm text-green-600">
                  ✅ Good try!
                </p>

                {/* Try again */}
                <button
                  onClick={() => {
                    setInput('');
                    setResult(null);
                  }}
                  className="text-sm underline text-muted-foreground hover:text-foreground"
                >
                  ✏️ Try another sentence
                </button>
              </div>
            )}
          </CardContent>
        </Card>



      </main>
<Footer happyUsers={happyUsers} />
    </>
  );
}
