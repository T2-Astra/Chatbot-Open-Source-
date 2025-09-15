import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async generateResponse(prompt: string, chatHistory?: Array<{role: string, parts: string}>): Promise<string> {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        let chat;
        if (chatHistory && chatHistory.length > 0) {
          const history = chatHistory.map(msg => ({
            role: msg.role === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.parts }]
          }));
          
          chat = model.startChat({ history });
        } else {
          chat = model.startChat();
        }

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        return response.text();
      } catch (error: any) {
        console.error(`Gemini API error (attempt ${attempt + 1}):`, error);
        
        // Check if it's a 503 overload error and we have retries left
        if (error.message?.includes('503') || error.message?.includes('overloaded')) {
          if (attempt < maxRetries) {
            const delayTime = baseDelay * Math.pow(2, attempt); // Exponential backoff
            console.log(`Model overloaded, retrying in ${delayTime}ms...`);
            await this.delay(delayTime);
            continue;
          }
        }
        
        // If it's not a retryable error or we've exhausted retries
        throw new Error('Failed to generate response from AI. Please try again in a moment.');
      }
    }
    
    throw new Error('Failed to generate response from AI after multiple attempts.');
  }
}

export const geminiService = new GeminiService();