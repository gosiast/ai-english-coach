'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Badge, RotateCcw, Sparkles, Volume2, Languages, Star } from 'lucide-react';
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-400">
      <main className="grow flex flex-col items-center justify-center px-4 py-12 relative">
        
        {/* Animated Background Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl animate-bounce duration-[10s]" />

        {/* Header Section */}
        <div className="text-center mb-8 space-y-4">
          <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-4 py-1 shadow-lg">
            <Star className="w-3 h-3 mr-2 fill-amber-300 stroke-amber-300" />
            Your Private Tutor
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-md">
            AI English Coach
          </h1>
          <p className="text-white/90 text-lg font-medium max-w-sm mx-auto drop-shadow-sm">
            Unlock your natural voice. ✨
          </p>
        </div>

        <Card className="w-full max-w-lg border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] bg-white/90 backdrop-blur-xl ring-1 ring-white/50">
          <CardHeader>
            <CardDescription className="text-indigo-900/70 font-bold text-sm uppercase tracking-widest">
              Type your thought:
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='e.g., "i back at 20"'
                className="min-h-[120px] text-lg p-5 rounded-2xl border-none bg-indigo-50/50 focus-visible:ring-indigo-400 text-indigo-950 placeholder:text-indigo-300 shadow-inner"
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full h-14 text-lg font-black rounded-2xl bg-linear-to-r from-orange-400 to-rose-500 hover:from-orange-500 hover:to-rose-600 border-none shadow-[0_10px_20px_-5px_rgba(244,114,182,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] text-white"
              disabled={loading || !input.trim()}
            >
              {loading ? "Polishing..." : "Transform my English 🚀"}
            </Button>

            {result && (
              <div className="mt-4 animate-in zoom-in-95 duration-300">
                <div className="rounded-3xl bg-linear-to-br from-amber-50 to-orange-50 p-6 border-2 border-orange-100 shadow-sm space-y-5">
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-tighter">
                      <Sparkles className="h-4 w-4 fill-orange-400" />
                      The Native Way
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => speak(result.corrected)}
                      className="rounded-full bg-orange-200/50 text-orange-700 hover:bg-orange-200"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-2xl font-serif text-indigo-950 leading-tight font-medium decoration-orange-200 underline decoration-4 underline-offset-4">
                    {result.corrected}
                  </p>

                  <div className="p-4 rounded-2xl bg-white/80 space-y-1 shadow-sm">
                    <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Quick Tip</h4>
                    <p className="text-sm text-indigo-900/80 leading-relaxed font-medium">
                      {result.explanation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold">
                      Perfect! ✅
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setInput(''); setResult(null); }}
                      className="text-indigo-400 hover:text-indigo-600 font-bold"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" /> Again
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