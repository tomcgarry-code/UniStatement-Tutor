
import React from 'react';
import { StatementAnalysis } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { 
  CheckCircle2, AlertTriangle, Lightbulb, MessageSquareQuote, BookOpen, PenTool, Layout, RefreshCw, ChevronLeft, Download, ShieldCheck, Info
} from 'lucide-react';

interface ResultsSectionProps {
  analysis: StatementAnalysis;
  onReset: () => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ analysis, onReset }) => {
  const scoreData = [
    { name: 'Score', value: analysis.score },
    { name: 'Remaining', value: 100 - analysis.score },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // Green-500
    if (score >= 60) return '#eab308'; // Yellow-500
    return '#ef4444'; // Red-500
  };

  const COLORS = [getScoreColor(analysis.score), '#f3f4f6'];

  // Plagiarism logic
  const plagiarismStatus = analysis.plagiarism_check?.status || 'Low Risk';
  const plagiarismRiskColor = 
    plagiarismStatus === 'High Risk' ? 'bg-red-50 text-red-700 border-red-200' :
    plagiarismStatus === 'Moderate Risk' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
    'bg-green-50 text-green-700 border-green-200';

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Navigation / Header */}
      <div className="mb-8 flex items-center">
        <button 
          onClick={onReset}
          className="mr-4 p-2 text-gray-500 hover:text-uni-600 hover:bg-uni-50 rounded-full transition-colors print:hidden"
          title="Analyze another statement"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-grow">
           <h2 className="text-2xl font-bold text-gray-900 font-serif">Analysis Report</h2>
           <p className="text-gray-500 text-sm">Review your personalized feedback below.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="ml-auto p-2.5 bg-white border border-gray-200 text-gray-600 hover:text-uni-600 hover:bg-uni-50 rounded-lg transition-colors print:hidden flex items-center gap-2 text-sm font-medium shadow-sm"
          title="Save report as PDF"
        >
          <Download size={18} />
          <span>Save as PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Score & Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Score Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Overall Strength</h3>
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {scoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-bold" style={{ color: getScoreColor(analysis.score) }}>
                  {analysis.score}
                </span>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">out of 100</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {analysis.score >= 80 ? "Excellent work! Only minor tweaks needed." : 
               analysis.score >= 60 ? "Good foundation, but needs refinement." : 
               "Significant improvements required for a competitive application."}
            </p>
          </div>

          {/* Tutor Feedback Card */}
          <div className="bg-uni-50 p-6 rounded-2xl shadow-sm border border-uni-100">
            <div className="flex items-center gap-3 mb-3 text-uni-800">
              <MessageSquareQuote size={20} />
              <h3 className="font-semibold text-uni-900">Tutor Feedback</h3>
            </div>
            <p className="text-uni-700 leading-relaxed text-sm">
              {analysis.summary}
            </p>
          </div>

          {/* Actionable Tips */}
          <div className="bg-yellow-100 p-6 rounded-2xl shadow-sm border border-yellow-300">
            <h3 className="text-lg font-bold text-yellow-950 mb-4 flex items-center gap-2">
              <Lightbulb className="text-yellow-600" size={20} />
              Priority Actions
            </h3>
            <ul className="space-y-3">
              {analysis.actionable_tips.map((tip, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-yellow-900 font-medium">
                  <span className="flex-shrink-0 w-6 h-6 bg-yellow-200 text-yellow-800 rounded-full flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Detailed Feedback */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Originality Check (New) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
               <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                 <ShieldCheck className="text-uni-600" size={20} />
                 Originality & Plagiarism Risk
               </h3>
               <div className={`px-4 py-1.5 rounded-full text-xs font-bold border inline-flex items-center justify-center ${plagiarismRiskColor}`}>
                 {plagiarismStatus}
               </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              {analysis.plagiarism_check?.feedback || "No feedback available."}
            </p>
            <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
               <Info size={14} className="mt-0.5 flex-shrink-0" />
               <p>
                 <span className="font-semibold">Note:</span> This is an AI assessment of originality, cliché usage, and generic structure. It does not check against private UCAS databases or the internet.
               </p>
            </div>
          </div>

          {/* Detailed Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3 text-uni-700">
                  <Layout size={18} />
                  <h4 className="font-semibold">Structure</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{analysis.structure_feedback}</p>
             </div>
             <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3 text-uni-700">
                  <BookOpen size={18} />
                  <h4 className="font-semibold">Content</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{analysis.content_feedback}</p>
             </div>
             <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3 text-uni-700">
                  <PenTool size={18} />
                  <h4 className="font-semibold">Style</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{analysis.style_tone_feedback}</p>
             </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
              <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-green-600" />
                Key Strengths
              </h3>
              <ul className="space-y-3">
                {analysis.key_strengths.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                    <span className="mt-1 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
              <h3 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-600" />
                Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {analysis.key_improvements.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                    <span className="mt-1 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center print:hidden">
             <p className="text-sm text-gray-600 mb-4">
               Ready to improve your draft? Apply these changes and run the analysis again to see your score improve.
             </p>
             <button 
               onClick={onReset}
               className="inline-flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-uni-600 transition-colors"
             >
               <RefreshCw size={16} />
               Refine Another Draft
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
