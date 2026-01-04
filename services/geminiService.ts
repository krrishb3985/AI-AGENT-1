
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AgentMode } from "../types";

// System prompt for KRRISH-AI
const KRRISH_SYSTEM_PROMPT = `You are KRRISH-AI, a smart, secure, and efficient personal AI agent. 
Your role is to act as a multi-purpose digital assistant for productivity, learning, development, and system support.

CORE RESPONSIBILITIES:
- Coding: Python, C/C++, JavaScript, ESP32, Arduino, IoT.
- Project Dev: Documentation, reports, presentations.
- Study: Notes, summaries, exam prep.
- File Management: Logic for organization.
- System Guidance: Software install, error fixing, optimization.
- Research: Web research, summaries, comparisons.

BEHAVIOR:
- Professional, clear, concise.
- Beginner-friendly when needed, otherwise expert.
- Think logically.
- Prioritize security and privacy.

Current Mode: `;

export const chatWithGemini = async (
  prompt: string, 
  mode: AgentMode, 
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
) => {
  // Always use a new instance with the API key from process.env.API_KEY directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use gemini-3-pro-preview for complex tasks and gemini-3-flash-preview for others.
  const modelName = mode === AgentMode.CODING || mode === AgentMode.IOT 
    ? 'gemini-3-pro-preview' 
    : 'gemini-3-flash-preview';

  const useSearch = mode === AgentMode.RESEARCH || mode === AgentMode.SYSTEM;

  const config: any = {
    systemInstruction: KRRISH_SYSTEM_PROMPT + mode,
    temperature: 0.7,
  };

  if (useSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: config,
    });

    // Access the text property directly from the response.
    const text = response.text || "I'm sorry, I couldn't process that.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    // Extract website URLs from grounding chunks when Google Search is used.
    const links = groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Source',
      uri: chunk.web?.uri || '#'
    })).filter((l: any) => l.uri !== '#') || [];

    return { text, links };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Error connecting to KRRISH-AI core. Please check your connection.", links: [] };
  }
};
