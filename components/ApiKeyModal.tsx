import React, { useState } from 'react';

interface ApiKeyModalProps {
  onApiKeySubmit: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-deep-blue/80 backdrop-blur-sm flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-light-blue border border-slate-700 rounded-xl p-8 max-w-lg text-center shadow-2xl w-full mx-4">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">OpenAI API Anahtarınızı Girin</h2>
        <p className="text-slate-300 mb-6">
          Uygulamayı kullanmak için OpenAI API anahtarınıza ihtiyacınız var. Anahtarınız tarayıcınızda yerel olarak saklanacaktır.
        </p>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="API Anahtarınızı buraya yapıştırın (örn: sk-...)"
          className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-colors mb-4"
          required
          autoFocus
        />
        <button
          type="submit"
          className="w-full bg-brand-purple hover:bg-brand-purple-dark text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
          disabled={!apiKey.trim()}
        >
          Kaydet ve Devam Et
        </button>
         <p className="text-xs text-slate-500 mt-4">
          API anahtarınızı şuradan alabilirsiniz:{' '}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-brand-purple-light"
          >
            OpenAI Platform
          </a>.
        </p>
      </form>
    </div>
  );
};

export default ApiKeyModal;
