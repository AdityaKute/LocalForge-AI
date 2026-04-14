import { Send, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ModelInfo } from "../../services/api";

const MODEL_DETAILS: Record<string, { size: string; parameters: string; detail: string }> = {
  "nomic-embed-text:latest": {
    size: "274 MB",
    parameters: "< 1B",
    detail: "Specialized for text embeddings used in retrieval-augmented generation (RAG), similarity searches, and clustering tasks."
  },
  "qwen2.5-coder:1.5b-base": {
    size: "986 MB",
    parameters: "1.5B",
    detail: "A lightweight base model for code generation and completion; efficient for running on CPUs or systems with low VRAM (4–8 GB)."
  },
  "starcoder2:latest": {
    size: "1.7 GB",
    parameters: "3B",
    detail: "Optimized for code completion and function generation; supports hundreds of programming languages and can run on consumer laptops."
  },
  "llama3.2:3b": {
    size: "2.0 GB",
    parameters: "3B",
    detail: "Best for multilingual dialogue, mobile-based agentic retrieval, and summarization; supports long context up to 128k tokens."
  },
  "phi4-mini:latest": {
    size: "2.5 GB",
    parameters: "~3.8B",
    detail: "Engineered for advanced reasoning, math, and logic in compute-constrained environments; natively supports function calling."
  },
  "deepseek-r1:7b": {
    size: "4.7 GB",
    parameters: "7B",
    detail: "A \"reasoning-first\" model that provides step-by-step thinking; excels at complex problem solving in math and software development."
  },
  "mistral:latest": {
    size: "4.4 GB",
    parameters: "7B",
    detail: "A versatile general-purpose model for text summarization, translation, and categorization; often used for business automation and chatbots."
  },
  "qwen2.5-coder:7b": {
    size: "4.7 GB",
    parameters: "7B",
    detail: "A larger coding model capable of agentic coding workflows, bug fixing, and multi-programming reasoning."
  },
  "qwen2.5-coder:7b-instruct-q4_K_M": {
    size: "4.7 GB",
    parameters: "7B",
    detail: "An instruction-tuned version of the 7B Coder model, optimized for following human prompts for specific code tasks."
  },
  "llama3.1:8b": {
    size: "4.9 GB",
    parameters: "8B",
    detail: "A robust general-purpose model for agentic retrieval and long-context processing (up to 128k tokens)."
  },
  "gemma2:latest": {
    size: "5.4 GB",
    parameters: "9B",
    detail: "High-performance open weights model for RAG, summarization, and analysis; known for delivering \"best-in-class\" performance for its size."
  }
};



interface InputPanelProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  modelName: string;
  isGenerating: boolean;
  availableModels: ModelInfo[];
  selectedModelId: string;
  onSelectModel: (modelName: string) => void;
}

export function InputPanel({
  prompt,
  onPromptChange,
  onSubmit,
  modelName,
  isGenerating,
  availableModels,
  selectedModelId,
  onSelectModel,
}: InputPanelProps) {
  // const [showHistory, setShowHistory] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !isGenerating) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGenerating && prompt.trim()) {
      onSubmit();
    }
  };

  // Get current model details for HoverCard
  const currentModel = availableModels.find(m => m.name === selectedModelId);
  const currentModelDetails = currentModel ? MODEL_DETAILS[currentModel.name] : null;

  return (
    <div className="flex h-full">
      {/* Main Input Area */}
      <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col">
        {/* Model Selector - OUTSIDE overflow container to allow Portal to escape */}
        <div 
          className="px-3 py-2 rounded-lg border m-4 mb-0"
          style={{ 
            backgroundColor: 'var(--forge-bg-tertiary)',
            borderColor: 'var(--forge-border)'
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--forge-text-muted)' }}>
                  Active Model
                </span>
                {currentModel && currentModelDetails ? (
                      <HoverCard openDelay={200} closeDelay={0}>
                        <HoverCardTrigger asChild>
                          <div className="cursor-help text-muted-foreground hover:text-foreground">
                            <Brain className="h-4 w-4" />
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="hovercss w-80 rounded-3xl border bg-popover p-4 shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                          <div className="space-y-4">
                            <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 via-sky-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:via-sky-500/20 dark:to-cyan-500/20 p-4  border border-blue-500/20 dark:border-blue-500/30 relative overflow-hidden">
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
                                <p className="text-xs leading-relaxed text-foreground/90">{currentModelDetails.detail}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-3 mt-1 text-sm">
                                <div className="rounded-xl bg-background p-3 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Size</p>
                                  <p className="mt-1 font-semibold text-foreground text-xs">{currentModelDetails.size}</p>
                                </div>
                                <div className="rounded-xl bg-background p-3 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Params</p>
                                  <p className="mt-1 font-semibold text-foreground text-xs">{currentModelDetails.parameters}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ) : null}
                </div>
                <div className="text-xs font-mono" style={{ color: 'var(--forge-accent-blue)' }}>
                  {modelName}
                </div>
              </div>
              <Select
                value={selectedModelId}
                onValueChange={onSelectModel}
                disabled={availableModels.length === 0}
              >
                <SelectTrigger className="w-28 rounded-md border bg-transparent px-2 py-1 text-xs" style={{
                  borderColor: 'var(--forge-border)',
                  color: 'var(--forge-text-primary)',
                  backgroundColor: 'var(--forge-bg-secondary)'
                }}>
                  <SelectValue placeholder="No models available" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.length === 0 ? (
                    <SelectItem value="" disabled>
                      No models available
                    </SelectItem>
                  ) : (
                    availableModels.map((model) => {
                      const modelDetails = MODEL_DETAILS[model.name];
                      return (
                        <HoverCard key={model.name} openDelay={200} closeDelay={0}>
                          <HoverCardTrigger asChild>
                            <SelectItem
                              value={model.name}
                              textValue={model.name}
                              className="w-full cursor-pointer focus:bg-accent hover:bg-accent/50"
                            >
                              {model.name}
                            </SelectItem>
                          </HoverCardTrigger>
                          {modelDetails && (
                            <HoverCardContent className="hovercss w-80 rounded-3xl border bg-popover p-4 shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                              <div className="space-y-4">
                                <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 via-sky-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:via-sky-500/20 dark:to-cyan-500/20 p-4 border border-blue-500/20 dark:border-blue-500/30 relative overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                                  <div className="flex items-center gap-3 relative z-10">
                                    <div className="p-2 bg-blue-500/10 rounded-xl">
                                      <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Model</p>
                                      <p className="mt-0.5 font-bold text-sm text-foreground">{model.name}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="grid gap-3 rounded-2xl bg-muted/50 p-4 border border-border/50">
                                  <div className="space-y-1.5">
                                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">About</p>
                                    <p className="text-xs leading-relaxed text-foreground/90">{modelDetails.detail}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3 mt-1 text-sm">
                                    <div className="rounded-xl bg-background p-3 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Size</p>
                                      <p className="mt-1 font-semibold text-foreground text-xs">{modelDetails.size}</p>
                                    </div>
                                    <div className="rounded-xl bg-background p-3 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Params</p>
                                      <p className="mt-1 font-semibold text-foreground text-xs">{modelDetails.parameters}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </HoverCardContent>
                          )}
                        </HoverCard>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
          <div className="flex-1 flex flex-col min-h-0">
            <label className="text-xs mb-2 block" style={{ color: 'var(--forge-text-muted)' }}>
              Prompt
            </label>
            <div className="flex-1 min-h-0 border rounded-lg overflow-hidden" style={{ borderColor: 'var(--forge-border)' }}>
              <Textarea
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your coding problem, ask for help, or paste error logs..."
                disabled={isGenerating}
                className="w-full h-full resize-none font-mono text-sm border-0 rounded-none overflow-auto"
                style={{
                  backgroundColor: 'var(--forge-bg-tertiary)',
                  color: 'var(--forge-text-primary)',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word'
                }}
              />
            </div>
            <p className="text-[10px] mt-2" style={{ color: 'var(--forge-text-muted)' }}>
              Press Cmd/Ctrl + Enter to send
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div 
          className="p-4 border-t"
          style={{ borderColor: 'var(--forge-border)' }}
        >
          <Button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className={`w-full h-10 gap-2 ${isGenerating ? 'animate-pulse' : ''}`}
            style={{
              backgroundColor: isGenerating || !prompt.trim()
                ? 'var(--forge-bg-tertiary)'
                : 'var(--forge-accent-blue)',
              color: isGenerating || !prompt.trim()
                ? 'var(--forge-text-muted)'
                : 'white'
            }}
          >
            <Send size={16} />
            {isGenerating ? 'Generating...' : 'Send'}
          </Button>
        </div>
      </form>
    </div>
  );
}