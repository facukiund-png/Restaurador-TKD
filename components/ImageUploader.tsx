import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError("Por favor sube un archivo de imagen válido (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError("La imagen es demasiado pesada. El máximo es 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onImageSelected(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-500/10' 
            : 'border-slate-600 hover:border-indigo-400 hover:bg-slate-800/50'
          }
        `}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-slate-800 rounded-full shadow-lg">
            <Upload className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Sube tu foto para restaurar</h3>
            <p className="text-slate-400 text-sm">
              Arrastra y suelta o haz clic para explorar.
            </p>
            <p className="text-slate-500 text-xs mt-2">Soporta JPG, PNG, WebP (Max 10MB)</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};