import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import { analyzeStatement } from './services/geminiService';
import { UserInput, StatementAnalysis, AppState } from './types';
import { AlertOctagon } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysisResult, setAnalysisResult] = useState<StatementAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalysisRequest = async (input: UserInput) => {
    setAppState(AppState.ANALYZING);
    setErrorMessage(null);
    try {
      const result = await analyzeStatement(input.statement, input.subject, input.university);
      setAnalysisResult(result);
      setAppState(AppState.RESULTS);
    } catch (error) {
      console.error("Error analyzing statement", error);
      setAppState(AppState.ERROR);
      setErrorMessage("We encountered an issue analyzing your statement. Please try again or check your internet connection.");
    }
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
      <Header />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {appState === AppState.IDLE && (
          <InputSection onSubmit={handleAnalysisRequest} isAnalyzing={false} />
        )}

        {appState === AppState.ANALYZING && (
           <InputSection onSubmit={() => {}} isAnalyzing={true} />
        )}

        {appState === AppState.RESULTS && analysisResult && (
          <ResultsSection analysis={analysisResult} onReset={resetApp} />
        )}

        {appState === AppState.ERROR && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertOctagon size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Analysis Failed</h2>
            <p className="text-gray-600 mb-8">{errorMessage}</p>
            <button 
              onClick={resetApp}
              className="px-6 py-2 bg-uni-600 text-white rounded-lg hover:bg-uni-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} UniStatement Tutor. Not affiliated with UCAS. 
            <br className="sm:hidden"/> 
            <span className="hidden sm:inline"> • </span>
            Always verify advice with your school counselor.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;