
import { GoogleGenAI, Type } from "@google/genai";
import { StatementAnalysis } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const analyzeStatement = async (
  statement: string, 
  subject: string, 
  university?: string
): Promise<StatementAnalysis> => {
  
  const prompt = `
    You are an expert Senior UCAS Admissions Tutor with 20 years of experience at top UK universities. 
    Analyze the following personal statement for a student applying to study ${subject} ${university ? `at ${university}` : ''}.
    
    The UCAS personal statement limit is 4000 characters or 47 lines.
    
    Evaluate it based on:
    1. **Academic Suitability (70%):** Evidence of interest, understanding of the subject, and critical thinking.
    2. **Transferable Skills (20%):** Extra-curriculars, work experience, but ONLY how they relate to the course.
    3. **Structure & Style (10%):** Clarity, grammar, flow, and avoiding clichés.
    4. **Originality & Integrity:** Check for overused clichés, generic phrases, or content that looks like a copied template. 
    
    Be critical but constructive. Focus on "Show, Don't Tell".
    
    Return the response in strictly valid JSON format matching the schema provided.
    
    Personal Statement:
    "${statement}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "A score out of 100 representing the quality of the statement." },
            summary: { type: Type.STRING, description: "A 2-3 sentence executive summary of the statement's quality." },
            structure_feedback: { type: Type.STRING, description: "Specific feedback on the paragraphing, flow, and introduction/conclusion." },
            content_feedback: { type: Type.STRING, description: "Feedback on the academic content, evidence of super-curricular engagement, and relevance." },
            style_tone_feedback: { type: Type.STRING, description: "Feedback on vocabulary, grammar, spelling, and enthusiasm." },
            plagiarism_check: {
              type: Type.OBJECT,
              properties: {
                risk_score: { type: Type.INTEGER, description: "0-100 probability score. Higher means more generic/clichéd/unoriginal." },
                status: { type: Type.STRING, description: "Exactly one of: 'Low Risk', 'Moderate Risk', 'High Risk'" },
                feedback: { type: Type.STRING, description: "Feedback on the originality of the phrasing and use of generic templates." }
              },
              required: ["risk_score", "status", "feedback"]
            },
            key_strengths: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 3-4 specific things the student did well."
            },
            key_improvements: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 3-4 major weaknesses to address."
            },
            actionable_tips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Concrete, step-by-step instructions on what to change immediately."
            }
          },
          required: ["score", "summary", "structure_feedback", "content_feedback", "style_tone_feedback", "plagiarism_check", "key_strengths", "key_improvements", "actionable_tips"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response received from Gemini.");
    }

    return JSON.parse(response.text) as StatementAnalysis;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};
