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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isResultVisible, setIsResultVisible] = useState<boolean>(true);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Sayfa yüklendiğinde API anahtarını yerel depolamadan al
    const storedKey = localStorage.getItem('gemini-api-key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini-api-key', key);
  };

  const clearApiKey = () => {
      setApiKey(null);
      localStorage.removeItem('gemini-api-key');
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
      const imageUrl = await generateMockupImage(selectedProduct, selectedAspectRatio, uploadedImage, customPrompt, apiKey);
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      let errorMessage = err.message || "Bilinmeyen bir hata oluştu.";
      // Genel API anahtarı hata kontrolü
      if (err.toString().toLowerCase().includes('api key not valid')) {
         errorMessage = "Girdiğiniz API anahtarı geçersiz. Lütfen kontrol edip tekrar deneyin.";
         clearApiKey(); // Geçersiz anahtarı temizle ve modalı tekrar göster
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct, selectedAspectRatio, uploadedImage, customPrompt, apiKey]);


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
