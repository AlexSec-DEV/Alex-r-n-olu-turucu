import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ImageDisplay from './components/ImageDisplay';
import Header from './components/Header';
import { generateMockupImage } from './services/geminiService';
import { AspectRatio } from './types';
import { ASPECT_RATIOS } from './constants';
import ApiKeyModal from './components/ApiKeyModal';

const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio['value']>(ASPECT_RATIOS[0].value);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isResultVisible, setIsResultVisible] = useState<boolean>(true);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // On page load, get the API key from local storage
    const storedKey = localStorage.getItem('openai-api-key'); // Switched to openai-api-key for clarity
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openai-api-key', key); // Switched to openai-api-key for clarity
  };

  const clearApiKey = () => {
      setApiKey(null);
      localStorage.removeItem('openai-api-key'); // Switched to openai-api-key for clarity
  }

  const handleGenerate = useCallback(async () => {
    if (!selectedProduct) {
      setError("Lütfen bir ürün seçin.");
      return;
    }
    if (!apiKey) {
      setError("Lütfen API anahtarınızı girin.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setIsResultVisible(true);

    try {
      const imageUrl = await generateMockupImage(selectedProduct, selectedAspectRatio, customPrompt, apiKey);
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      let errorMessage = err.message || "Bilinmeyen bir hata oluştu.";
      // OpenAI API key error check
      if (err.toString().toLowerCase().includes('incorrect api key')) {
         errorMessage = "Girdiğiniz API anahtarı geçersiz. Lütfen kontrol edip tekrar deneyin.";
         clearApiKey(); // Clear the invalid key and show the modal again
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct, selectedAspectRatio, customPrompt, apiKey]);


  return (
    <div className="flex flex-col h-screen bg-deep-blue font-sans">
      {!apiKey && <ApiKeyModal onApiKeySubmit={handleApiKeySubmit} />}
      <Header />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <Sidebar
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          selectedAspectRatio={selectedAspectRatio}
          setSelectedAspectRatio={setSelectedAspectRatio}
          onGenerate={handleGenerate}
          isLoading={isLoading || !apiKey}
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
