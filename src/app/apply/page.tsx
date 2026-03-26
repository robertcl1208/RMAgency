'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, getStoredUser, clearTokens } from '@/lib/api/client';
import {
  MessageCircle, ArrowLeft, Send, Bot, User as UserIcon,
  LogOut, Loader2, AlertCircle, CheckCircle2, HelpCircle,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
interface Profile { id: string; name: string; description: string }
interface Session { id: string }
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: string;
  askForSuggestion?: boolean;
}
interface ChatResponse {
  type: 'answer' | 'no_info' | 'not_related' | 'memory_saved';
  content: string;
  askForSuggestion?: boolean;
}

let msgId = 0;
function nextId() { return String(++msgId); }

// ── Apply Page ────────────────────────────────────────────────────────────────
export default function ApplyPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const [checked, setChecked] = useState(false);

  const [view, setView] = useState<'profiles' | 'chat'>('profiles');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const u = getStoredUser();
    if (!u) { router.push('/login'); return; }
    setUser(u);
    setChecked(true);
    api.get<Profile[]>('/api/profiles')
      .then(setProfiles)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  async function openChat(profile: Profile) {
    setSelectedProfile(profile);
    const s = await api.post<Session>(`/api/profiles/${profile.id}/sessions`);
    setSession(s);
    setView('chat');
  }

  function handleLogout() {
    api.post('/api/auth/logout').catch(() => {});
    clearTokens();
    router.push('/login');
  }

  if (!checked || !user) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-brand-mint via-white to-sky-50/40 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {view === 'chat' ? (
            <button onClick={() => setView('profiles')} className="text-slate-400 hover:text-slate-700 transition-colors">
              <ArrowLeft size={20} />
            </button>
          ) : (
            <MessageCircle size={22} className="text-brand-teal" />
          )}
          <span className="font-bold text-lg text-slate-900">
            {view === 'chat' && selectedProfile ? selectedProfile.name : 'Chatbot System'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 hidden sm:block">{user.email}</span>
          {user.role === 'admin' && (
            <button onClick={() => router.push('/dashboard')}
              className="text-sm text-brand-teal hover:text-brand-teal-dark transition-colors">Dashboard</button>
          )}
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex flex-col">
        {view === 'profiles' ? (
          <ProfileGrid profiles={profiles} loading={loading} onSelect={openChat} />
        ) : (
          selectedProfile && session && (
            <ChatView profile={selectedProfile} session={session} userId={user.id} />
          )
        )}
      </div>
    </div>
  );
}

// ── Profile Grid ──────────────────────────────────────────────────────────────
function ProfileGrid({
  profiles, loading, onSelect,
}: { profiles: Profile[]; loading: boolean; onSelect: (p: Profile) => void }) {
  return (
    <main className="max-w-5xl mx-auto w-full px-6 py-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Select a Profile</h2>
        <p className="text-slate-500">Choose a profile to start chatting with its AI assistant.</p>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={30} className="animate-spin text-brand-teal" />
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <MessageCircle size={40} className="mx-auto mb-3 opacity-40" />
          <p>You don&apos;t have access to any profiles yet.</p>
          <p className="text-sm mt-1">Please contact an admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="group text-left bg-white hover:bg-brand-mint border border-slate-200 hover:border-brand-teal rounded-2xl p-6 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-teal/10 group-hover:bg-brand-teal/20 flex items-center justify-center text-brand-teal font-bold text-lg transition-colors">
                  {p.name[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-base group-hover:text-brand-teal transition-colors">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">AI Profile Assistant</p>
                </div>
              </div>
              {p.description && (
                <p className="text-sm text-slate-500 line-clamp-2">{p.description}</p>
              )}
              <div className="mt-4 flex items-center gap-2 text-brand-teal text-sm font-medium">
                <MessageCircle size={14} /> Start Chat
              </div>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}

// ── Chat View ─────────────────────────────────────────────────────────────────
function ChatView({
  profile, session, userId,
}: { profile: Profile; session: Session; userId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nextId(),
      role: 'assistant',
      content: `Hi! I'm the AI assistant for **${profile.name}**. Ask me anything about this profile.`,
      type: 'answer',
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [suggestionInput, setSuggestionInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const appendMessage = useCallback((msg: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: nextId() }]);
  }, []);

  async function sendMessage(text: string, suggestedAnswer?: string) {
    if (!text.trim() || sending) return;

    if (!suggestedAnswer) {
      appendMessage({ role: 'user', content: text });
    }

    setSending(true);
    try {
      const body: Record<string, string> = {
        message: text,
        session_id: session.id,
      };
      if (suggestedAnswer) body.suggested_answer = suggestedAnswer;

      const res = await api.post<ChatResponse>(
        `/api/profiles/${profile.id}/chat/message`,
        body
      );

      if (res.type === 'no_info' || res.type === 'not_related') {
        setPendingQuestion(text);
      } else {
        setPendingQuestion(null);
        setSuggestionInput('');
      }

      appendMessage({ role: 'assistant', content: res.content, type: res.type, askForSuggestion: res.askForSuggestion });
    } catch (e) {
      appendMessage({
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        type: 'error',
      });
    } finally {
      setSending(false);
    }
  }

  async function submitSuggestion() {
    if (!pendingQuestion || !suggestionInput.trim()) return;
    const q = pendingQuestion;
    const a = suggestionInput.trim();
    appendMessage({ role: 'user', content: `My answer: ${a}` });
    setSuggestionInput('');
    setPendingQuestion(null);
    await sendMessage(q, a);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        sendMessage(input.trim());
        setInput('');
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-4">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} profile={profile} />
        ))}
        {sending && (
          <div className="flex gap-3 items-end">
            <div className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-brand-teal" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <Loader2 size={16} className="animate-spin text-slate-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion input */}
      {pendingQuestion && (
        <div className="mb-3 bg-brand-teal/5 border border-brand-teal/20 rounded-xl p-4">
          <p className="text-sm text-brand-teal mb-3 flex items-center gap-2">
            <HelpCircle size={15} /> Suggest an answer to save for this question:
          </p>
          <div className="flex gap-2">
            <input
              value={suggestionInput}
              onChange={e => setSuggestionInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submitSuggestion(); }}
              placeholder="Type your answer…"
              className="flex-1 bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
            <button
              onClick={submitSuggestion}
              disabled={!suggestionInput.trim() || sending}
              className="flex items-center gap-1.5 bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0"
            >
              <CheckCircle2 size={15} /> Save
            </button>
            <button
              onClick={() => { setPendingQuestion(null); setSuggestionInput(''); }}
              className="text-slate-400 hover:text-slate-600 text-sm px-2"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="flex gap-3 items-end bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-3 shadow-sm">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask about ${profile.name}…`}
          rows={1}
          disabled={sending}
          className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 resize-none focus:outline-none text-sm leading-6 max-h-32 overflow-y-auto"
          style={{ minHeight: '24px' }}
        />
        <button
          onClick={() => { if (input.trim()) { sendMessage(input.trim()); setInput(''); } }}
          disabled={!input.trim() || sending}
          className="w-9 h-9 rounded-xl bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-40 flex items-center justify-center shrink-0 transition-colors"
        >
          <Send size={16} className="text-white" />
        </button>
      </div>
      <p className="text-xs text-slate-400 text-center mt-2">Press Enter to send, Shift+Enter for new line</p>
    </div>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────────
function MessageBubble({ message, profile }: { message: Message; profile: Profile }) {
  const isUser = message.role === 'user';

  const typeIcon = {
    no_info: <AlertCircle size={13} className="text-amber-500" />,
    not_related: <AlertCircle size={13} className="text-orange-500" />,
    memory_saved: <CheckCircle2 size={13} className="text-emerald-500" />,
    error: <AlertCircle size={13} className="text-red-500" />,
  }[message.type ?? ''];

  return (
    <div className={`flex gap-3 items-end ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isUser ? 'bg-slate-200' : 'bg-brand-teal/10'
      }`}>
        {isUser ? (
          <UserIcon size={16} className="text-slate-500" />
        ) : (
          <Bot size={16} className="text-brand-teal" />
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-brand-teal text-white rounded-br-sm'
            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
        }`}>
          {renderMarkdown(message.content)}
        </div>
        {typeIcon && !isUser && (
          <div className="flex items-center gap-1 px-1">
            {typeIcon}
            <span className="text-xs text-slate-400">
              {message.type === 'memory_saved' ? 'Saved to memory' :
               message.type === 'no_info' ? 'No info found' :
               message.type === 'not_related' ? 'Off-topic' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/** Minimal markdown renderer — handles **bold** and line breaks only */
function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part.split('\n').map((line, j, arr) =>
            j < arr.length - 1 ? [line, <br key={j} />] : line
          )}</span>
        )
      )}
    </>
  );
}
