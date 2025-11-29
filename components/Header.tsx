import React from 'react';
import { BookOpen, PenTool } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-uni-600 to-uni-800 p-2.5 rounded-xl text-white shadow-lg shadow-uni-200/50 flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
              <PenTool size={22} className="fill-white/20" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-serif leading-none tracking-tight">UniStatement Tutor</h1>
              <p className="text-xs text-uni-600 font-medium">UCAS Expert Assistant</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
             <a href="#" className="text-sm font-medium text-gray-500 hover:text-uni-600 transition-colors">How it works</a>
             <a href="#" className="text-sm font-medium text-gray-500 hover:text-uni-600 transition-colors">Examples</a>
             <div className="flex items-center gap-1 text-xs bg-uni-50 text-uni-700 px-3 py-1 rounded-full border border-uni-100">
                <BookOpen size={12} />
                <span>Powered by Gemini 2.5</span>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;