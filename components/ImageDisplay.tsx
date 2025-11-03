import React from 'react';
import SpinnerIcon from './icons/SpinnerIcon';
import DownloadIcon from './icons/DownloadIcon';
import ImageIcon from './icons/ImageIcon';
import ChevronIcon from './icons/ChevronIcon';

interface ImageDisplayProps {
  isLoading: boolean;
  error: string | null;
  generatedImage: string | null;
  productName: string | null;
  isResultVisible: boolean;
  setIsResultVisible: (visible: boolean) => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  isLoading, 
  error, 
  generatedImage, 
  productName,
  isResultVisible,
  setIsResultVisible
 }) => {
  const handleDownload = async () => {
    if (!generatedImage || !productName) return;
    try {
      // Data URL'sini fetch ile alıp blob'a çeviriyoruz.
      // Bu yöntem, çok büyük base64 string'lerinde bile daha güvenilir çalışır.
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      
      // Blob'dan geçici bir URL oluşturuyoruz.
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      
      const safeProductName = productName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      // Dosya uzantısını blob'un MIME türünden alıyoruz (örn: image/png -> png)
      const extension = blob.type.split('/')[1] || 'png';
      link.download = `mockup_${safeProductName}.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      
      // İşlem bittikten sonra linki ve URL'yi temizliyoruz.
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("İndirme hatası:", e);
      alert("Resim indirilemedi. Lütfen tekrar deneyin veya resmi sağ tıklayıp 'Farklı Kaydet' seçeneğini kullanın.");
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <SpinnerIcon className="w-16 h-16 text-brand-purple mb-4" />
          <h3 className="text-xl font-semibold text-slate-200">Alex ürün oluşturuyor...</h3>
          <p className="text-slate-400 mt-2">Bu işlem birkaç saniye sürebilir.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center bg-red-900/20 p-8 rounded-lg">
          <svg className="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 className="text-xl font-semibold text-red-300">Bir Hata Oluştu</h3>
          <p className="text-red-400 mt-2">{error}</p>
        </div>
      );
    }

    if (generatedImage) {
      return (
        <div className="relative w-full h-full group">
          <img
            src={generatedImage}
            alt="Oluşturulan Alex mockup"
            className="w-full h-full object-contain rounded-lg shadow-2xl shadow-black/50"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
            <button
              onClick={handleDownload}
              className="bg-brand-purple hover:bg-brand-purple-dark text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-110"
            >
              <DownloadIcon className="w-5 h-5" />
              İndir
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center text-center text-slate-500">
        <ImageIcon className="w-24 h-24 mb-4" />
        <h3 className="text-2xl font-semibold text-slate-300">Mockup'ınız Burada Görünecek</h3>
        <p className="mt-2 max-w-sm">Başlamak için soldaki menüden bir ürün ve boyut seçin, ardından 'Oluştur' düğmesine tıklayın.</p>
      </div>
    );
  };

  return (
    <main className="flex flex-col bg-deep-blue md:flex-1 md:p-10 md:justify-center md:items-center">
      {/* Mobile-only collapsible header */}
      <button
        onClick={() => setIsResultVisible(!isResultVisible)}
        className="md:hidden flex justify-between items-center p-4 border-y border-slate-700 bg-light-blue/50"
        aria-expanded={isResultVisible}
        aria-controls="image-display-content"
      >
        <h2 className="text-lg font-semibold text-slate-200">Sonuç Ekranı</h2>
        <ChevronIcon
          className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isResultVisible ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Main content wrapper - collapsible on mobile */}
      <div
        id="image-display-content"
        className={`
          w-full flex items-center justify-center transition-all duration-500 ease-in-out
          ${isResultVisible ? 'flex-grow max-h-screen p-6' : 'max-h-0 p-0 overflow-hidden'}
          md:flex-1 md:max-h-full md:p-0
        `}
      >
        <div className="w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center bg-black/20 rounded-xl border border-slate-700 p-4">
          {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default ImageDisplay;