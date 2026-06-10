import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTIONS = [
  'What does Ing Zhen do at Maxis?',
  'Tell me about his awards',
  'What tech does he use?',
  'How can I reach him?',
];

const GREETING = {
  role: 'assistant',
  content: "Hi! I'm Ing Zhen's AI assistant 👋 Ask me anything about his work, projects, awards or experience.",
};

const TypingDots = () => (
  <span className="inline-flex items-center gap-1 py-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </span>
);

const ChatPanel = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 250);
  }, [isOpen]);

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
      // eslint-disable-next-line no-constant-condition
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
          content: "Sorry, I couldn't reach my brain just now. Try again, or email ingzhen2003@gmail.com.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-24 right-4 z-40 flex h-[28rem] w-[min(92vw,22rem)] flex-col overflow-hidden rounded-2xl border border-edge bg-surface/95 shadow-2xl shadow-black/40 backdrop-blur-md sm:bottom-28 sm:right-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-edge px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber/15 text-sm">🤖</span>
              <div>
                <p className="text-sm font-semibold leading-none text-ink">Ask about Ing Zhen</p>
                <p className="mt-1 text-[.7rem] text-ink-muted">AI assistant · live</p>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close chat" className="text-ink-muted transition-colors hover:text-ink">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === 'user' ? 'bg-amber text-bg' : 'bg-surface-light text-ink'
                  }`}>
                  {m.content || <TypingDots />}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-edge px-2.5 py-1 text-xs text-ink-muted transition-colors hover:border-amber/50 hover:text-amber">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-edge p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything…"
              className="flex-1 rounded-xl border border-edge bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-muted/50 focus:border-amber/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber text-bg transition-opacity disabled:opacity-50">
              →
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;
