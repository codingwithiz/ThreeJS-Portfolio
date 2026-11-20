import { useEffect, useRef, useState } from 'react';
import { ArrowUp, X } from 'lucide-react';

const SUGGESTIONS = [
  'What does Ing Zhen do at Maxis?',
  'How does IZ Finance log payments?',
  'What is Crux?',
  'How do I get in touch?',
];

const GREETING = {
  role: 'assistant',
  content: 'Ask about Ing Zhen’s work, systems, awards or experience. I answer from the same data this site is built from.',
};

// Mounted only while open (see Layout.jsx), so mount = open and unmount = close.
const ChatPanel = ({ onClose }) => {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput('');

    const convo = [...messages, { role: 'user', content }];
    setMessages([...convo, { role: 'assistant', content: '' }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: convo.filter((m) => m.role !== 'system').map(({ role, content }) => ({ role, content })),
        }),
      });
      if (!res.ok || !res.body) throw new Error('no stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: 'assistant', content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: 'assistant',
          content: 'That did not go through. Try again, or email ingzhen2003@gmail.com.',
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-label="Ask about Ing Zhen"
      className="page-fade fixed inset-x-0 bottom-0 z-50 flex h-[100dvh] flex-col border-ink bg-night sm:inset-x-auto sm:bottom-4 sm:right-4 sm:h-[32rem] sm:max-h-[calc(100dvh-2rem)] sm:w-[24rem] sm:rounded-[14px] sm:border-2 sm:shadow-[5px_5px_0_#14110f]">
      <div className="flex items-center justify-between border-b border-ink/15 pl-4">
        <p className="label">The joker · ask me anything</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="flex h-11 w-11 items-center justify-center text-ink-muted hover:text-ink">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div ref={scrollRef} aria-live="polite" className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <div key={i}>
            <p className="label mb-1">{m.role === 'user' ? 'You' : 'Assistant'}</p>
            <p className={`whitespace-pre-wrap text-sm leading-relaxed ${m.role === 'user' ? 'text-ink' : 'text-ink-muted'}`}>
              {m.content || '…'}
            </p>
          </div>
        ))}
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-col items-start px-4 pb-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="min-h-11 text-left text-sm text-amber underline decoration-amber/40 underline-offset-4 hover:decoration-amber">
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2 border-t border-ink/15 p-3">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Your question"
          placeholder="Ask a question"
          className="min-h-11 min-w-0 flex-1 rounded-sm border border-ink/40 bg-night px-3 text-base text-ink placeholder:text-ink-muted/60 focus:border-amber focus:outline-none sm:text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          aria-label="Send"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-amber text-bg disabled:opacity-50">
          <ArrowUp className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
