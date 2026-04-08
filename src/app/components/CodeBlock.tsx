import { useState } from "react";
import { Check, Copy, Maximize2, Minimize2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "./ui/button";

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const codeBlock = (
    <div 
      className={`rounded-lg overflow-hidden border ${isExpanded ? 'fixed inset-4 z-50 bg-black' : ''}`}
      style={{ borderColor: 'var(--forge-border)' }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-3 py-2 border-b"
        style={{ 
          backgroundColor: 'var(--forge-bg-tertiary)',
          borderColor: 'var(--forge-border)'
        }}
      >
        <span className="text-xs font-mono" style={{ color: 'var(--forge-text-muted)' }}>
          {language}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-6 w-6 p-0"
          >
            {copied ? (
              <Check size={14} style={{ color: 'var(--forge-success)' }} />
            ) : (
              <Copy size={14} style={{ color: 'var(--forge-text-secondary)' }} />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExpand}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <Minimize2 size={14} style={{ color: 'var(--forge-text-secondary)' }} />
            ) : (
              <Maximize2 size={14} style={{ color: 'var(--forge-text-secondary)' }} />
            )}
          </Button>
        </div>
      </div>

      {/* Code */}
      <div className={`text-xs overflow-auto ${isExpanded ? 'max-h-full' : 'overflow-x-auto'}`}>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            backgroundColor: '#0d0e16',
            fontSize: '0.75rem',
            lineHeight: '1.5'
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
        {codeBlock}
      </div>
    );
  }

  return codeBlock;
}
