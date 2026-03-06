'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@yourorg/design-system';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatPanelProps {
  onIntent: (intent: Record<string, unknown>) => void;
}

export function ChatPanel({ onIntent }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'Describe the store you want to build. For example: "Create a shoe store with 3 products"',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) {
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (data.success && data.result) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.result.description ?? 'Done!' },
        ]);
        onIntent(data.result.payload);
      } else {
        const errMsg = data.errors?.map((e: { message: string }) => e.message).join(', ') ?? 'Something went wrong';
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `Error: ${errMsg}` },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Network error — could not reach the server.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="chat-panel">
      <h3 className="chat-panel__title">AI Store Builder</h3>
      <div ref={scrollRef} className="chat-panel__messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-panel__msg chat-panel__msg--${msg.role}`}>
            <span className="chat-panel__role">{msg.role}</span>
            <p>{msg.content}</p>
          </div>
        ))}
        {loading && (
          <div className="chat-panel__msg chat-panel__msg--assistant">
            <span className="chat-panel__role">assistant</span>
            <p className="chat-panel__typing">Thinking...</p>
          </div>
        )}
      </div>
      <form className="chat-panel__form" onSubmit={handleSubmit}>
        <input
          className="chat-panel__input"
          type="text"
          placeholder="Describe your store..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <Button variant="primary" disabled={loading || !input.trim()}>
          Send
        </Button>
      </form>
    </aside>
  );
}
