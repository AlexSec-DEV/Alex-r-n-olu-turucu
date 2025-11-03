import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ImageDisplay from './components/ImageDisplay';
import Header from './components/Header';
import { generateMockupImage } from './services/geminiService';
import { AspectRatio } from './types';
import { ASPECT_RATIOS } from './constants';
import SpinnerIcon from './components/icons/SpinnerIcon';

// This is a global declaration for the aistudio object
// Fix: Resolve TypeScript error for `window.aistudio` by defining a named `AIStudio` interface.
// This aligns with a potential existing global declaration and prevents type conflicts.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio['value']>(ASPECT_RATIOS[0].value);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isResultVisible, setIsResultVisible] = useState<boolean>(true);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [apiKeySelected, setApiKeySelected] = useState<boolean | null>(null);


  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        try {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setApiKeySelected(hasKey);
        } catch (e) {
          console.error("Error checking for API key:", e);
          setApiKeySelected(false); // Assume no key if check fails
        }
      } else {
        // Fallback for local development or if aistudio is not available
        setApiKeySelected(true); 
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Assume success and update UI to avoid race conditions
        setApiKeySelected(true);
        setError(null);
      } catch (e) {
        console.error("Error opening API key selection:", e);
        setError("API anahtarı seçimi açılamadı.");
      }
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!selectedProduct) {
      setError("Lütfen bir ürün seçin.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setIsResultVisible(true); // Show panel for loading/result

    try {
      const imageUrl = await generateMockupImage(selectedProduct, selectedAspectRatio, uploadedImage, customPrompt);
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      const errorMessage = err.message || "Bilinmeyen bir hata oluştu.";
       if (errorMessage.includes('API_KEY environment variable is not set')) {
          setError("API anahtarı ayarlanmamış. Lütfen bir API anahtarı seçin.");
          setApiKeySelected(false);
      } else if (errorMessage.includes('Requested entity was not found')) {
        setError("API anahtarınız geçersiz veya bulunamadı. Lütfen yeni bir anahtar seçin.");
        setApiKeySelected(false);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct, selectedAspectRatio, uploadedImage, customPrompt]);

  if (apiKeySelected === null) {
    return (
      <div className="flex flex-col h-screen bg-deep-blue font-sans items-center justify-center">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <SpinnerIcon className="w-12 h-12" />
        </div>
      </div>
    );
  }

  if (!apiKeySelected) {
    return (
      <div className="flex flex-col h-screen bg-deep-blue font-sans">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">API Anahtarı Gerekli</h2>
          <p className="text-slate-400 max-w-md mb-8">
            Ürün görselleri oluşturmaya başlamak için lütfen bir Google AI Studio API anahtarı seçin.
            Kullanımınız faturalandırılabilir. Daha fazla bilgi için{' '}
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-purple-light hover:underline"
            >
              faturalandırma dokümanlarını
            </a> 
            {' '}ziyaret edin.
          </p>
          <button
            onClick={handleSelectKey}
            className="w-full max-w-xs bg-brand-purple hover:bg-brand-purple-dark text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
          >
            API Anahtarı Seç
          </button>
          {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen bg-deep-blue font-sans">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <Sidebar
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          selectedAspectRatio={selectedAspectRatio}
          setSelectedAspectRatio={setSelectedAspectRatio}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
          customPrompt={customPrompt}
          setCustomPrompt={setCustomPrompt}
        />
        <ImageDisplay
          isLoading={isLoading}
          error={error}
          generatedImage={generatedImage}
          productName={selectedProduct}
          isResultVisible={isResultVisible}
          setIsResultVisible={setIsResultVisible}
        />
      </div>
    </div>
  );
};

export default App;
