import React, { useState } from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { Button } from './Button';

interface ComparisonViewProps {
  original: string;
  processed: string;
  onReset: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ original, processed, onReset }) => {
  const [activeTab, setActiveTab] = useState<'original' | 'result'>('result');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processed;
    link.download = `restaurada-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-white">Resultado</h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onReset} size="sm">
             Nueva Restauración
          </Button>
          <Button variant="primary" onClick={handleDownload} icon={<Download className="w-4 h-4" />}>
            Descargar
          </Button>
        </div>
      </div>

      {/* Tabs for Mobile/Small screens or preference */}
      <div className="flex p-1 bg-slate-800 rounded-lg self-center mb-4">
        <button
          onClick={() => setActiveTab('original')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'original' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Original
        </button>
        <button
          onClick={() => setActiveTab('result')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'result' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Restaurada
        </button>
      </div>

      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-900/50 shadow-2xl flex items-center justify-center min-h-[400px]">
        <img 
          src={activeTab === 'result' ? processed : original} 
          alt="Visualización" 
          className="max-w-full max-h-[80vh] object-contain"
        />
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-xs font-mono text-white/80">
          {activeTab === 'result' ? 'Gemini 3 Pro Output' : 'Input Image'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Imagen Original</h4>
            <div className="h-32 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                <img src={original} className="h-full w-full object-cover opacity-50" />
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl border border-indigo-500/30">
             <h4 className="text-sm font-semibold text-indigo-300 mb-2">Imagen Restaurada</h4>
             <div className="h-32 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                <img src={processed} className="h-full w-full object-cover" />
             </div>
          </div>
      </div>
    </div>
  );
};