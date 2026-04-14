import { useState, useEffect, useRef } from 'react';
import { History, Moon, SunMedium, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { HistoryPanel } from './components/HistoryPanel';
import { CodeBlock } from './components/CodeBlock';
import { deleteConversation, getModels, getConversations, postChat, ModelInfo, Conversation } from '../services/api';

const MODEL_DETAILS: Record<string, { size: string; parameters: string; detail: string }> = {
  'nomic-embed-text:latest': {
    size: "274 MB",
    parameters: "< 1B",
    detail: "Specialized for text embeddings used in retrieval-augmented generation (RAG), similarity searches, and clustering tasks."
  },
  'qwen2.5-coder:1.5b-base': {
    size: "986 MB",
    parameters: "1.5B",
    detail: "A lightweight base model for code generation and completion; efficient for running on CPUs or systems with low VRAM (4–8 GB)."
  },
  'starcoder2:latest': {
    size: "1.7 GB",
    parameters: "3B",
    detail: "Optimized for code completion and function generation; supports hundreds of programming languages and can run on consumer laptops."
  },
  'llama3.2:3b': {
    size: "2.0 GB",
    parameters: "3B",
    detail: "Best for multilingual dialogue, mobile-based agentic retrieval, and summarization; supports long context up to 128k tokens."
  },
  'phi4-mini:latest': {
    size: "2.5 GB",
    parameters: "~3.8B",
    detail: "Engineered for advanced reasoning, math and logic in compute-constrained environments; natively supports function calling."
  },
  'deepseek-r1:7b': {
    size: "4.7 GB",
    parameters: "7B",
    detail: "A reasoning-first model that provides step-by-step thinking; excels at complex problem solving in math and software development."
  },
  'mistral:latest': {
    size: "4.4 GB",
    parameters: "7B",
    detail: "A versatile general-purpose model for text summarization, translation, and categorization; often used for business automation and chatbots."
  },
  'qwen2.5-coder:7b': {
    size: "4.7 GB",
    parameters: "7B",
    detail: "A larger coding model capable of agentic coding workflows, bug fixing, and multi-programming reasoning."
  },
  'qwen2.5-coder:7b-instruct-q4_K_M': {
    size: "4.7 GB",
    parameters: "7B",
    detail: "An instruction-tuned version of the 7B Coder model, optimized for following human prompts for specific code tasks."
  },
  'llama3.1:8b': {
    size: "4.9 GB",
    parameters: "8B",
    detail: "A robust general-purpose model for agentic retrieval and long-context processing (up to 128k tokens)."
  },
  'gemma2:latest': {
    size: "5.4 GB",
    parameters: "9B",
    detail: "High-performance open weights model for RAG, summarization, and analysis; known for delivering best-in-class performance for its size."
  }
};

function App() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('lfai-dark-mode');
    const initialDark = savedTheme !== null ? savedTheme === 'true' : true; // Default to dark mode
    setIsDarkMode(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);

    getModels().then((data: ModelInfo[]) => {
      setModels(data);
      if (data.length > 0) {
        setSelectedModel(data[0].name);
      }
    }).catch(console.error);

    fetchHistory();
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [conversations]);

  const fetchHistory = async () => {
    try {
      const data = await getConversations();
      setConversations([...data].reverse());
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const handleHistoryClick = () => {
    if (!isHistoryOpen) {
      fetchHistory();
    }
    setIsHistoryOpen(prev => !prev);
  };

  const handleThemeToggle = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      window.localStorage.setItem('lfai-dark-mode', String(next));
      return next;
    });
  };

  const handleDeleteConversation = async (id: number) => {
    try {
      await deleteConversation(id);
      setConversations(prev => prev.filter(convo => convo.id !== id));
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const responseType = (text: string) => {
    if (!text) return 'text';
    if (/```/.test(text) || /(def\s+\w+\(|function\s+\w+\(|public\s+static|console\.log\(|System\.)/.test(text)) {
      return 'code';
    }
    return 'text';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || !selectedModel || isLoading) return;
    setIsLoading(true);
    setResponse('');
    try {
      const result = await postChat(prompt, selectedModel);
      setResponse(result);
      setPrompt('');
      await fetchHistory();
    } catch (error) {
      console.error("Error fetching chat response:", error);
      setResponse("Sorry, something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-sky-500">
            <rect width="16" height="16" x="4" y="4" rx="2"></rect>
            <rect width="6" height="6" x="9" y="9" rx="1"></rect>
            <path d="M15 2v2"></path>
            <path d="M15 20v2"></path>
            <path d="M2 15h2"></path>
            <path d="M2 9h2"></path>
            <path d="M20 15h2"></path>
            <path d="M20 9h2"></path>
            <path d="M9 2v2"></path>
            <path d="M9 20v2"></path>
          </svg>
          <h1 className="text-xl font-bold">LocalForge AI</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleThemeToggle} className="transition-colors duration-200">
            {isDarkMode ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={handleHistoryClick}>
            <History className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-hidden">
        <div className="h-full flex gap-6">
          {/* Left Column: ChatSpace */}
          <div className="flex-1 rounded-3xl border bg-card overflow-hidden flex flex-col" style={{ borderColor: 'var(--forge-border)' }}>
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--forge-border)' }}>
              <div>
                <h2 className="text-lg font-semibold">ChatSpace</h2>
                <p className="text-sm text-muted-foreground">Previous conversations are shown below. Scroll up for older messages.</p>
              </div>
              <span className="text-xs text-muted-foreground">{conversations.length} saved conversations</span>
            </div>

            <ScrollArea ref={chatScrollRef} className="flex-1 min-h-0 overflow-hidden [&_[data-radix-scroll-area-scrollbar]]:bg-muted [&_[data-radix-scroll-area-scrollbar]]:w-2">
              <div className="p-6 space-y-4 min-h-0">
                {conversations.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-muted p-10 text-center text-sm text-muted-foreground">
                    No saved chats yet. Submit a prompt to begin.
                  </div>
                ) : (
                  conversations.map((convo) => (
                    <div key={convo.id} className="space-y-3 rounded-3xl border p-4 bg-surface" style={{ borderColor: 'var(--forge-border)' }}>
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Prompt</p>
                        <div className="rounded-2xl bg-muted p-4 text-sm whitespace-pre-wrap">{convo.prompt}</div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Response</p>
                        <div className="rounded-2xl bg-muted p-4 text-sm whitespace-pre-wrap">{convo.response}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Column: Latest Response + Input */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Latest Response */}
            <div className="flex-1 rounded-3xl border bg-card overflow-hidden flex flex-col" style={{ borderColor: 'var(--forge-border)' }}>
              <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--forge-border)' }}>
                <h2 className="text-lg font-semibold">Latest response</h2>
                <p className="text-sm text-muted-foreground">The current AI response appears here after you send a prompt.</p>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                {isLoading ? (
                  <div className="rounded-2xl border border-dashed border-muted p-10 text-center text-sm text-muted-foreground">
                    Thinking... please wait.
                  </div>
                ) : response ? (
                  <div className="rounded-3xl border p-4 bg-surface" style={{ borderColor: 'var(--forge-border)' }}>
                    {responseType(response) === 'code' ? (
                      <CodeBlock code={response} language="text" />
                    ) : (
                      <div className="text-sm whitespace-pre-wrap bg-gradient-to-r from-sky-300 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
                        {response}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-muted p-10 text-center text-sm text-muted-foreground">
                    Send a prompt to display the AI response here.
                  </div>
                )}
              </div>
            </div>

            {/* Input Form */}
            <footer className="rounded-3xl border bg-card p-4" style={{ borderColor: 'var(--forge-border)' }}>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedModel}
                      onValueChange={setSelectedModel}
                      disabled={models.length === 0}
                    >
                      <SelectTrigger className="w-52 rounded-2xl border bg-input px-3 py-3 text-sm">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {models.map((model: ModelInfo) => (
                          <SelectItem key={model.name} value={model.name}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(() => {
                      const currentModel = models.find(m => m.name === selectedModel);
                      const details = currentModel ? MODEL_DETAILS[currentModel.name] : null;
                      return currentModel && details ? (
                        <HoverCard openDelay={200} closeDelay={0}>
                          <HoverCardTrigger asChild>
                            <div className="cursor-help text-muted-foreground hover:text-foreground">
                              <Brain className="h-5 w-5" />
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="hover-css w-80 rounded-3xl border bg-popover p-4 shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                            <div className="space-y-4">
                              <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 via-sky-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:via-sky-500/20 dark:to-cyan-500/20 p-4 border border-blue-500/20 dark:border-blue-500/30 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                                <div className="flex items-center gap-3 relative z-10">
                                  <div className="p-2 bg-blue-500/10 rounded-xl">
                                    <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Model</p>
                                    <p className="mt-0.5 font-bold text-sm text-foreground">{currentModel.name}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="grid gap-3 rounded-2xl bg-muted/50 p-4 border border-border/50">
                                <div className="space-y-1.5">
                                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">About</p>
                                  <p className="text-xs leading-relaxed text-foreground/90">{details.detail}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-1 text-sm">
                                  <div className="rounded-xl bg-background p-3 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Size</p>
                                    <p className="mt-1 font-semibold text-foreground text-xs">{details.size}</p>
                                  </div>
                                  <div className="rounded-xl bg-background p-3 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Params</p>
                                    <p className="mt-1 font-semibold text-foreground text-xs">{details.parameters}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      ) : null;
                    })()}
                  </div>
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => {
                      setPrompt(e.target.value);
                      if (response && e.target.value.length > 0) {
                        setResponse('');
                      }
                    }}
                    placeholder="Ask your local AI anything..."
                    className="flex-1 p-3 rounded-2xl border bg-input"
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Thinking...' : 'Send'}
                  </Button>
                </div>
              </form>
            </footer>
          </div>
        </div>
      </main>

      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        conversations={conversations}
        onDelete={handleDeleteConversation}
      />
      <Toaster />
    </div>
  );
}

export default App;
