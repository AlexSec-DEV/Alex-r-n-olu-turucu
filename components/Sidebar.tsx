import React, { useState } from 'react';
import { Category, AspectRatio } from '../types';
import { CATEGORIES, ASPECT_RATIOS } from '../constants';
import SpinnerIcon from './icons/SpinnerIcon';

interface SidebarProps {
  selectedProduct: string | null;
  setSelectedProduct: (product: string | null) => void;
  selectedAspectRatio: AspectRatio['value'];
  setSelectedAspectRatio: (ratio: AspectRatio['value']) => void;
  onGenerate: () => void;
  isLoading: boolean;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedProduct,
  setSelectedProduct,
  selectedAspectRatio,
  setSelectedAspectRatio,
  onGenerate,
  isLoading,
  customPrompt,
  setCustomPrompt,
}) => {
  const [openCategory, setOpenCategory] = useState<string | null>(CATEGORIES[0]?.name || null);

  return (
    <aside className="w-full md:w-96 bg-light-blue p-6 flex flex-col md:h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-slate-100">Ayarlar</h2>

      <div className="flex-grow space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-brand-purple-light">1. Ürün Seçin</h3>
          <div className="space-y-2">
            {CATEGORIES.map((category) => (
              <div key={category.name} className="bg-deep-blue/50 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
                  className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-200"
                >
                  <span>{category.name}</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      openCategory === category.name ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openCategory === category.name && (
                  <div className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      {category.products.map((product) => (
                        <button
                          key={product}
                          onClick={() => setSelectedProduct(product)}
                          className={`p-2 text-sm rounded-md text-center transition-colors ${
                            selectedProduct === product
                              ? 'bg-brand-purple text-white font-semibold'
                              : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                          }`}
                        >
                          {product}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-brand-purple-light">2. Boyut Seçin</h3>
          <div className="grid grid-cols-2 gap-3">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.value}
                onClick={() => setSelectedAspectRatio(ratio.value)}
                className={`p-3 text-sm rounded-lg transition-colors ${
                  selectedAspectRatio === ratio.value
                    ? 'bg-brand-purple text-white font-semibold'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-brand-purple-light">3. Ekstra Detay Ekle (İsteğe Bağlı)</h3>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Örn: Ürünün üzerinde 'Cosmic' yazsın ve galaksi deseni olsun."
            rows={4}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-colors"
          />
        </div>
      </div>
      
      <div className="mt-8">
        <button
          onClick={onGenerate}
          disabled={isLoading || !selectedProduct}
          className="w-full bg-brand-purple hover:bg-brand-purple-dark disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="mr-2" />
              Oluşturuluyor...
            </>
          ) : (
            'Mockup Oluştur'
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
