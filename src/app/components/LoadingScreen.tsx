import { motion } from "motion/react";
import { Cpu } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--forge-bg-primary)' }}>
      <div className="flex flex-col items-center gap-8">
        {/* Animated Logo */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full blur-2xl opacity-50"
            style={{ background: 'var(--forge-accent-blue)' }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div 
            className="relative p-6 rounded-2xl border"
            style={{ 
              backgroundColor: 'var(--forge-bg-secondary)',
              borderColor: 'var(--forge-border)'
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Cpu size={48} style={{ color: 'var(--forge-accent-blue)' }} />
            </motion.div>
          </div>
        </motion.div>

        {/* App Name */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="text-3xl tracking-tight" style={{ color: 'var(--forge-text-primary)' }}>
            LocalForge AI
          </h1>
          <p className="text-sm" style={{ color: 'var(--forge-text-secondary)' }}>
            Privacy-first AI development platform
          </p>
        </motion.div>

        {/* Loading Bar */}
        <motion.div
          className="w-48 h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--forge-bg-tertiary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ 
              background: `linear-gradient(90deg, var(--forge-accent-blue), var(--forge-accent-violet))` 
            }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Status Text */}
        <motion.p
          className="text-xs"
          style={{ color: 'var(--forge-text-muted)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Initializing models...
        </motion.p>
      </div>
    </div>
  );
}
