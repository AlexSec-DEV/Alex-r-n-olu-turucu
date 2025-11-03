import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ImageDisplay from './components/ImageDisplay';
import Header from './components/Header';
import { generateMockupImage } from './services/geminiService';
import { AspectRatio } from './types';
import { ASPECT_RATIOS } from './constants';

const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio['value']>(ASPECT_RATIOS[0].value);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isResultVisible, setIsResultVisible] = useState<boolean>(true);
  const [customPrompt, setCustomPrompt] = useState<string>('');

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
          setError("API anahtarı ayarlanmamış. Lütfen API anahtarınızın ortamda ayarlandığından emin olun.");
      } else if (errorMessage.includes('Requested entity was not found')) {
        setError("API anahtarınız geçersiz veya bulunamadı. Lütfen API anahtarınızı kontrol edin.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct, selectedAspectRatio, uploadedImage, customPrompt]);


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
