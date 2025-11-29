import React, { useState, useCallback } from 'react';
import { UserInput } from '../types';
import { ArrowRight, AlertCircle, CheckCircle2, BookOpen, GraduationCap } from 'lucide-react';

interface InputSectionProps {
  onSubmit: (input: UserInput) => void;
  isAnalyzing: boolean;
}

const MAX_CHARS = 4000;
const MAX_LINES = 47;

const InputSection: React.FC<InputSectionProps> = ({ onSubmit, isAnalyzing }) => {
  const [subject, setSubject] = useState('');
  const [university, setUniversity] = useState('');
  const [statement, setStatement] = useState('');
  const [error, setError] = useState<string | null>(null);

  const charCount = statement.length;
  const lineCount = statement.split('\n').length;
  
  const isOverLimit = charCount > MAX_CHARS || lineCount > MAX_LINES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError("Please enter a subject.");
      return;
    }
    if (statement.trim().length < 100) {
      setError("Your statement is too short to analyze accurately.");
      return;
    }
    setError(null);
    onSubmit({ subject, university, statement });
  };

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStatement(e.target.value);
    if (error) setError(null);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
          Craft Your Future
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Paste your draft UCAS personal statement below. Our AI, trained on admissions criteria, will provide comprehensive feedback to help you secure that offer.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Context Fields */}
        <div className="bg-uni-50 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-uni-100">
          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-uni-900 mb-2">
              Course / Subject <span className="text-red-500">*</span>
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Computer Science, Law, Medicine"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-uni-500 focus:border-transparent outline-none transition-all shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="university" className="block text-sm font-semibold text-uni-900 mb-2">
              Target University (Optional)
            </label>
            <input
              id="university"
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="e.g. Oxford, Manchester, Imperial"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-uni-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Text Area */}
        <div className="p-6">
          <label htmlFor="statement" className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between">
            <span>Personal Statement Draft</span>
            <span className={`text-xs font-mono ${isOverLimit ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
              {charCount}/{MAX_CHARS} chars • {lineCount}/{MAX_LINES} lines
            </span>
          </label>
          <textarea
            id="statement"
            value={statement}
            onChange={handleTextChange}
            placeholder="Paste your personal statement here..."
            className={`w-full h-96 p-4 rounded-lg text-gray-900 placeholder-gray-500 font-sans leading-relaxed resize-y transition-all focus:ring-4 focus:border-transparent outline-none ${
              isOverLimit 
                ? 'border-2 border-red-500 bg-red-50 focus:ring-red-200' 
                : 'border border-gray-300 bg-gray-50 focus:ring-uni-200'
            }`}
            spellCheck={false}
          />
          
          {isOverLimit && (
            <div className="mt-2 flex items-center text-red-600 text-sm">
              <AlertCircle size={16} className="mr-1" />
              <span>You are over the UCAS limit. Please shorten your statement.</span>
            </div>
          )}

          {error && (
             <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                <AlertCircle size={18} className="mr-2" />
                {error}
             </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
           <div className="text-xs text-gray-500 hidden sm:block">
             <span className="font-semibold">Pro Tip:</span> Focus on your academic interests more than extra-curriculars.
           </div>
           <button
             type="submit"
             disabled={isAnalyzing || !statement.trim()}
             className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white shadow-lg transform transition-all hover:-translate-y-0.5
               ${isAnalyzing || !statement.trim() 
                 ? 'bg-gray-400 cursor-not-allowed hover:translate-y-0 shadow-none' 
                 : 'bg-gradient-to-r from-uni-600 to-uni-500 hover:from-uni-700 hover:to-uni-600 active:scale-95 shadow-uni-200'}`}
           >
             {isAnalyzing ? (
               <>
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Analyzing...
               </>
             ) : (
               <>
                 Analyze Statement <ArrowRight size={18} />
               </>
             )}
           </button>
        </div>
      </form>

      {/* Feature Highlights */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-4">
          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 text-uni-600">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Instant Feedback</h3>
          <p className="text-sm text-gray-600">Get detailed analysis in seconds, not days.</p>
        </div>
        <div className="p-4">
          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 text-uni-600">
            <BookOpen size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Subject Specific</h3>
          <p className="text-sm text-gray-600">Tailored advice for your specific degree course.</p>
        </div>
        <div className="p-4">
          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 text-uni-600">
            <GraduationCap size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Admissions Criteria</h3>
          <p className="text-sm text-gray-600">Evaluated against real UCAS selection standards.</p>
        </div>
      </div>
    </div>
  );
};

export default InputSection;