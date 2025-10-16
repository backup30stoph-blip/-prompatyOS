import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// A general text generation function.
export const generateText = async (client: GoogleGenAI, prompt: string, systemInstruction?: string): Promise<string> => {
  try {
    const model = systemInstruction ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

    const response: GenerateContentResponse = await client.models.generateContent({
      model,
      contents: prompt,
      ...(systemInstruction && { config: { systemInstruction } }),
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating text with Gemini API:", error);
    throw error; // Re-throw to be handled by the caller
  }
};


// Function to generate a structured prompt for the SubmitPage
export const generatePrompt = async (client: GoogleGenAI, topic: string, context: string): Promise<any> => {
  const model = 'gemini-2.5-flash';
  
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'عنوان جذاب ومختصر باللغة العربية للأمر' },
      prompt_text: { type: Type.STRING, description: 'نص الأمر المفصل والموجه للذكاء الاصطناعي باللغة العربية' },
      tags: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: 'قائمة من 3 إلى 5 علامات (tags) ذات صلة باللغة العربية' 
      },
      tips: { type: Type.STRING, description: 'نصيحة قصيرة للمستخدم حول كيفية استخدام الأمر بفعالية باللغة العربية' }
    },
    required: ["title", "prompt_text", "tags"]
  };

  const systemInstruction = `
    You are an expert prompt engineer. Your task is to generate a high-quality, structured AI prompt in Arabic based on the user's input.
    The output must be a valid JSON object matching the provided schema. Do not include any markdown formatting like \`\`\`json.
  `;
  
  const userContent = `الموضوع: ${topic}\n\nالسياق الإضافي: ${context || 'لا يوجد'}`;

  try {
    const response = await client.models.generateContent({
      model,
      contents: userContent,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating structured prompt with Gemini API:", error);
    throw error;
  }
};