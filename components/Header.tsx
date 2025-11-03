import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-light-blue/50 border-b border-slate-700 p-4 shadow-lg">
      <div className="container mx-auto flex items-center gap-3">
         <div className="w-8 h-8 bg-gradient-to-tr from-brand-purple to-pink-500 rounded-lg"></div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider">
          Alex <span className="text-brand-purple-light">Ürün Oluşturucu</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;