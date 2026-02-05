'use client';

import { useState } from 'react';

export default function HomePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    corrected: string;
    explanation: string;
  } | null>(null);

  const handleSubmit = async () => {
    const response = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input }),
    });

    const data = await response.json();
    setResult(data);
  };

  return (
<main className="min-h-screen flex items-center justify-center">
<div className="w-full max-w-md p-6 border border-white rounded">

<h1>AI English Coach</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type what you want to say..."
        className='mt-12 border border-white'
      />

      <button onClick={handleSubmit} style={{ marginTop: 12 }}>
        Fix my English
      </button>

      {result && (
        <div className='border border-white p-6'>
          <p><strong>Corrected:</strong></p>
          <p>{result.corrected}</p>

          <p><strong>Explanation:</strong></p>
          <p>{result.explanation}</p>
        </div>
      )}
      </div>
    </main>
  );
}
