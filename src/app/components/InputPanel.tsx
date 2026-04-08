import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ModelInfo } from "../../services/api";

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

  return (
    <div className="flex h-full">
      {/* Main Input Area */}
      <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col">
        {/* Content */}
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
          {/* Model Selector */}
          <div 
            className="px-3 py-2 rounded-lg border"
            style={{ 
              backgroundColor: 'var(--forge-bg-tertiary)',
              borderColor: 'var(--forge-border)'
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs" style={{ color: 'var(--forge-text-muted)' }}>
                  Active Model
                </span>
                <div className="text-xs font-mono" style={{ color: 'var(--forge-accent-blue)' }}>
                  {modelName}
                </div>
              </div>
              <select
                value={selectedModelId}
                onChange={(e) => onSelectModel(e.target.value)}
                className="rounded-md border bg-transparent px-2 py-1 text-xs"
                style={{
                  borderColor: 'var(--forge-border)',
                  color: 'var(--forge-text-primary)',
                  backgroundColor: 'var(--forge-bg-secondary)'
                }}
              >
                {availableModels.length === 0 ? (
                  <option value="" disabled>
                    No models available
                  </option>
                ) : (
                  availableModels.map((model) => (
                    <option key={model.name} value={model.name}>
                      {model.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Prompt Input */}
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