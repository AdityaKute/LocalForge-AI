import { Cpu } from "lucide-react";

export function TopBar() {
  return (
    <div
      className="flex items-center justify-start px-6 py-3 border-b"
      style={{
        backgroundColor: 'var(--forge-bg-secondary)',
        borderColor: 'var(--forge-border)'
      }}
    >
      {/* Left: App Name & Logo */}
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: 'var(--forge-bg-tertiary)' }}
        >
          <Cpu size={20} style={{ color: 'var(--forge-accent-blue)' }} />
        </div>
        <div>
          <h1 className="text-sm tracking-tight" style={{ color: 'var(--forge-text-primary)' }}>
            LocalForge AI
          </h1>
          <p className="text-[10px]" style={{ color: 'var(--forge-text-muted)' }}>
            Local AI Assistant
          </p>
        </div>
      </div>
    </div>
  );
}