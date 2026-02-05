'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Badge, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import Footer from './components/footer';

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.85;
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
    const method = hasVisited ? 'GET' : 'POST';
    
    fetch('/api/views', { method })
      .then((res) => res.json())
      .then((data) => {
        setHappyUsers(data.happyUsers);
        if (!hasVisited) localStorage.setItem('aec_visited', 'true');
      })
      .catch((err) => console.error("Stats error:", err));
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
    <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-50 via-background to-background">
      <main className="grow flex flex-col items-center justify-center px-4 py-12">
        {/* Header Branding */}
        <div className="text-center mb-8 space-y-2">
          <Badge className="px-3 py-1 border-primary/20 text-primary">
            Powered by AI
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">AI English Coach</h1>
          <p className="text-muted-foreground">Master natural English, one sentence at a time.</p>
        </div>

        <Card className="w-full max-w-lg border-none shadow-2xl ring-1 ring-black/5">
          <CardHeader>
            <CardDescription className="text-base font-medium">
              What do you want to say?
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='e.g., "i back at 20"'
                className="min-h-[120px] text-lg p-4 transition-all focus-visible:ring-primary/20 bg-muted/20"
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {input.length} characters
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full h-12 text-base font-semibold"
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Thinking...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Help me say this <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            {result && (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-2xl bg-primary/5 p-6 border border-primary/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-primary font-bold text-sm">
                      <Sparkles className="h-4 w-4" />
                      BETTER VERSION
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => speak(result.pronunciation ?? result.corrected)}
                      className="rounded-full gap-2 text-primary hover:bg-primary/10"
                    >
                      <Volume2 className="h-4 w-4" /> Listen
                    </Button>
                  </div>

                  <p className="text-2xl font-serif leading-tight">
                    {result.corrected}
                  </p>

                  <div className="pt-2 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Why?</h4>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {result.explanation}
                    </p>
                  </div>

                  {result.timeHint && (
                    <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
                      <span>🕗</span> {result.timeHint}
                    </div>
                  )}

                  <div className="pt-4 flex items-center justify-between">
                    <p className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                      ✅ Good try!
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setInput('');
                        setResult(null);
                      }}
                      className="text-muted-foreground hover:text-foreground h-auto p-0 underline-offset-4 hover:underline"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" /> Try another
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer happyUsers={happyUsers} />
    </div>
  );
}