import { useEffect, useRef, useState } from "react";
import { StopCircle, RotateCcw, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { CodeBlock } from "./CodeBlock";

interface OutputPanelProps {
  isGenerating: boolean;
  onRegenerate: () => void;
  response: string;
  modelName: string;
}

export function OutputPanel({
  isGenerating,
  onRegenerate,
  response,
  modelName
}: OutputPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const normalizedResponse = response?.trim() || "";
  const responseType = () => {
    if (!normalizedResponse) return "AI Response";

    const fence = normalizedResponse.match(/```\s*([a-zA-Z0-9_+-]*)/);
    if (fence && fence[1]) return fence[1];

    const codeHint = /(def\s+\w+\(|function\s+\w+\(|public\s+static)/.test(normalizedResponse);
    if (codeHint) return "Code";

    return "AI Response";
  };

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [response, isGenerating, autoScroll]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom = Math.abs(
      target.scrollHeight - target.scrollTop - target.clientHeight
    ) < 10;
    setAutoScroll(isAtBottom);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Actions */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--forge-border)' }}
      >
        <div>
          <h3 className="text-sm" style={{ color: 'var(--forge-text-primary)' }}>
            AI Response
          </h3>
          <p className="text-xs" style={{ color: 'var(--forge-text-muted)' }}>
            Model: {modelName || 'N/A'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {response && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              className="h-8 gap-2"
            >
              <RotateCcw size={16} style={{ color: 'var(--forge-accent-blue)' }} />
              <span className="text-xs">Regenerate</span>
            </Button>
          )}
        </div>
      </div>

      {/* Response Content */}
      <ScrollArea
        ref={scrollRef}
        className="flex-1"
        onScroll={handleScroll}
      >
        <div className="p-4 h-full">
          <div className="border rounded-lg overflow-hidden transition-all duration-300 ease-out h-full bg-slate-900" style={{ borderColor: 'var(--forge-border)' }}>
            {isGenerating ? (
              <div className="p-6 h-full flex flex-col gap-4 animate-pulse">
                <div className="h-5 w-1/3 bg-slate-700 rounded" />
                <div className="h-4 w-full bg-slate-700 rounded" />
                <div className="h-4 w-5/6 bg-slate-700 rounded" />
                <div className="h-4 w-11/12 bg-slate-700 rounded" />
                <div className="h-4 w-3/4 bg-slate-700 rounded" />
              </div>
            ) : normalizedResponse ? (
              <div className="p-4 h-full flex flex-col gap-2" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 300ms ease-out' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium uppercase" style={{ color: 'var(--forge-text-muted)' }}>
                    {responseType()}
                  </span>
                </div>
                <div className="overflow-y-auto flex-1 pr-2" style={{ maxHeight: 'calc(100vh - 190px)' }}>
                  <CodeBlock code={normalizedResponse} language={responseType() === 'AI Response' ? 'text' : responseType().toLowerCase()} />
                </div>
              </div>
            ) : (
              <div className="p-6 h-full flex items-center justify-center" style={{ minHeight: '250px' }}>
                <p className="text-sm" style={{ color: 'var(--forge-text-muted)' }}>
                  Start typing and click Send to get AI output.
                </p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Auto-scroll indicator */}
      {!autoScroll && isGenerating && (
        <div
          className="absolute bottom-4 right-4 px-3 py-2 rounded-lg border shadow-lg cursor-pointer"
          style={{
            backgroundColor: 'var(--forge-bg-secondary)',
            borderColor: 'var(--forge-border)'
          }}
          onClick={() => {
            setAutoScroll(true);
            const scrollElement = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollElement) {
              scrollElement.scrollTop = scrollElement.scrollHeight;
            }
          }}
        >
          <span className="text-xs" style={{ color: 'var(--forge-text-secondary)' }}>
            New messages below ↓
          </span>
        </div>
      )}
    </div>
  );
}

