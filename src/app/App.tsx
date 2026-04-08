import { useState, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { LoadingScreen } from "./components/LoadingScreen";
import { TopBar } from "./components/TopBar";
import { InputPanel } from "./components/InputPanel";
import { OutputPanel } from "./components/OutputPanel";
import { fetchModels, fetchAiResponse, ModelInfo } from "../services/api";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState<string>("");

  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [activeModelId, setActiveModelId] = useState<string>('');

  useEffect(() => {
    const loadModels = async () => {
      try {
        const modelsResult = await fetchModels();
        setAvailableModels(modelsResult);
        if (modelsResult.length > 0) {
          setActiveModelId(modelsResult[0].name);
        }
      } catch (error) {
        console.error('Failed to load models:', error);
        setError('Failed to load AI models. Please check if the backend is running.');
      } finally {
        setIsLoading(false);
      }
    };
    loadModels();
  }, []);

  const handleSubmit = async () => {
    if (!prompt.trim() || isGenerating || !activeModelId) return;
    
    setIsGenerating(true);
    setResponse("");

    try {
      console.log('Submitting prompt:', { prompt, model: activeModelId });
      const aiResponse = await fetchAiResponse(prompt, activeModelId, 'summary');
      console.log('AI Response received:', aiResponse);
      setResponse(aiResponse);
    } catch (error: any) {
      console.error('Error submitting prompt:', error);
      setResponse(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    handleSubmit();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--forge-bg-primary)' }}>
        <div className="text-center p-8">
          <h1 className="text-2xl mb-4" style={{ color: 'var(--forge-error)' }}>Connection Error</h1>
          <p style={{ color: 'var(--forge-text-primary)' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 rounded"
            style={{ backgroundColor: 'var(--forge-accent-blue)', color: 'white' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--forge-bg-primary)' }}>
      <TopBar />

      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={35} minSize={25} maxSize={50}>
          <div className="h-full border-r" style={{ backgroundColor: 'var(--forge-bg-secondary)', borderColor: 'var(--forge-border)' }}>
            <InputPanel
              prompt={prompt}
              onPromptChange={setPrompt}
              onSubmit={handleSubmit}
              modelName={activeModelId || "None"}
              isGenerating={isGenerating}
              availableModels={availableModels}
              selectedModelId={activeModelId}
              onSelectModel={setActiveModelId}
            />
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 hover:w-1.5 transition-all" style={{ backgroundColor: 'var(--forge-border)' }}>
          <div className="h-full" />
        </PanelResizeHandle>

        <Panel defaultSize={65} minSize={50}>
          <div className="h-full" style={{ backgroundColor: 'var(--forge-bg-primary)' }}>
            <OutputPanel
              isGenerating={isGenerating}
              onRegenerate={handleRegenerate}
              response={response}
              modelName={activeModelId}
            />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}