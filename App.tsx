import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { ComparisonView } from './components/ComparisonView';
import { restoreImage } from './services/geminiService';
import { AspectRatio, RestorationConfig, ProcessingState } from './types';
import { Layers, Monitor, Smartphone, Grid, Sparkles } from 'lucide-react';

const App = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [config, setConfig] = useState<RestorationConfig>({
    aspectRatio: '1:1',
    promptEnhancement: ''
  });
  const [processState, setProcessState] = useState<ProcessingState>({ status: 'idle' });

  const handleRestore = async () => {
    if (!originalImage) return;

    setProcessState({ status: 'processing' });
    try {
      const result = await restoreImage(originalImage, config);
      setProcessedImage(result);
      setProcessState({ status: 'success' });
    } catch (error: any) {
      setProcessState({ 
        status: 'error', 
        errorMessage: error.message || "Ocurrió un error inesperado durante la restauración." 
      });
    }
  };

  const resetAll = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setProcessState({ status: 'idle' });
  };

  // UI Components helpers
  const AspectRatioButton = ({ ratio, label, icon: Icon }: { ratio: AspectRatio, label: string, icon: any }) => (
    <button
      onClick={() => setConfig({ ...config, aspectRatio: ratio })}
      className={`
        flex flex-col items-center justify-center p-3 rounded-xl border transition-all
        ${config.aspectRatio === ratio 
          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-700'
        }
      `}
    >
      <Icon className="w-5 h-5 mb-2" />
      <span className="text-xs font-medium">{label}</span>
      <span className="text-[10px] opacity-70 mt-1">{ratio}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Restaurador TKD
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center text-xs text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full border border-indigo-400/20">
               <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2 animate-pulse"></span>
               Listo para usar
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {!originalImage ? (
          /* Upload State */
          <div className="max-w-2xl mx-auto animate-fade-in-up pt-10">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Restaura y escala tus fotos
              </h2>
              <p className="text-lg text-slate-400 max-w-lg mx-auto">
                Sube tu imagen, elige el formato y deja que la IA mejore la calidad automáticamente.
              </p>
            </div>
            <ImageUploader onImageSelected={setOriginalImage} />
          </div>
        ) : !processedImage ? (
          /* Editor State */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Image Preview */}
            <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-4 flex items-center justify-center relative min-h-[500px]">
              <img 
                src={originalImage} 
                alt="Original" 
                className="max-h-[600px] w-auto object-contain rounded-lg shadow-lg" 
              />
              <button 
                onClick={resetAll}
                className="absolute top-4 right-4 bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-full backdrop-blur transition-colors"
                title="Cambiar imagen"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Controls */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700 p-6 flex flex-col gap-8 h-fit sticky top-24">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" /> Formato (Aspect Ratio)
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <AspectRatioButton ratio="1:1" label="Cuadrado" icon={Grid} />
                  <AspectRatioButton ratio="3:4" label="Retrato" icon={Smartphone} />
                  <AspectRatioButton ratio="4:3" label="Paisaje" icon={Monitor} />
                  <AspectRatioButton ratio="9:16" label="Story" icon={Smartphone} />
                  <AspectRatioButton ratio="16:9" label="Cine" icon={Monitor} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                   Instrucciones opcionales
                </label>
                <textarea
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                  rows={3}
                  placeholder="Ej: La foto tiene una mancha en la esquina, por favor eliminarla..."
                  value={config.promptEnhancement}
                  onChange={(e) => setConfig({ ...config, promptEnhancement: e.target.value })}
                />
              </div>

              <div className="mt-auto pt-4 border-t border-slate-700/50">
                 {processState.status === 'error' && (
                    <div className="mb-4 p-3 bg-red-500/20 text-red-300 text-sm rounded-lg border border-red-500/30">
                       {processState.errorMessage}
                    </div>
                 )}
                 <Button 
                   onClick={handleRestore} 
                   className="w-full py-4 text-lg shadow-indigo-500/20"
                   isLoading={processState.status === 'processing'}
                 >
                   {processState.status === 'processing' ? 'Procesando...' : 'Restaurar Imagen'}
                 </Button>
                 <p className="text-center text-xs text-slate-500 mt-3">
                    Potenciado por Gemini 2.5 Flash
                 </p>
              </div>
            </div>
          </div>
        ) : (
          /* Result State */
          <div className="max-w-5xl mx-auto">
             <ComparisonView 
                original={originalImage} 
                processed={processedImage} 
                onReset={() => {
                   setProcessedImage(null);
                   setProcessState({ status: 'idle' });
                }}
             />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;