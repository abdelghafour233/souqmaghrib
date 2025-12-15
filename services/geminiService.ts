import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  try {
    // In Vite, this string is replaced at build time.
    // If undefined, we return null gracefully.
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.warn("API Key is missing. AI features will be disabled.");
      return null;
    }
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Failed to initialize AI client:", e);
    return null;
  }
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "وصف تلقائي (لم يتم تكوين مفتاح API).";

  try {
    const prompt = `اكتب وصفاً تسويقياً جذاباً ومختصراً (حوالي 50 كلمة) لمنتج باللغة العربية.
    اسم المنتج: ${productName}
    الفئة: ${category}
    العملة: الدرهم المغربي.
    الأسلوب: احترافي ومقنع للزبون المغربي.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "لا يمكن توليد الوصف حالياً.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "حدث خطأ أثناء توليد الوصف.";
  }
};

export const askAiAssistant = async (query: string, context: string): Promise<string> => {
   const ai = getAiClient();
   if (!ai) return "خدمة المساعد الذكي غير متوفرة حالياً.";

   try {
     const prompt = `أنت مساعد ذكي في متجر إلكتروني مغربي.
     سياق المنتج الحالي: ${context}
     سؤال الزبون: ${query}
     أجب باللغة العربية وبلهجة مغربية خفيفة ومحترمة.`;

     const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash',
       contents: prompt,
     });
     return response.text || "عذراً، لم أفهم السؤال.";
   } catch (error) {
     console.error("AI Assistant Error:", error);
     return "حدث خطأ في الاتصال بالمساعد الذكي.";
   }
}