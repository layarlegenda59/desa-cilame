// Cerebras AI Integration
export interface CerebrasMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CerebrasResponse {
  choices: {
    delta?: {
      content?: string;
    };
    message?: {
      content: string;
    };
  }[];
}

export class CerebrasClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.cerebras.ai/v1';
  }

  async createChatCompletion(
    messages: CerebrasMessage[], 
    options: {
      temperature?: number;
      max_tokens?: number;
      top_p?: number;
    } = {}
  ): Promise<string> {
    try {
      const {
        temperature = 0.6,
        max_tokens = 65536,
        top_p = 0.95
      } = options;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'qwen-3-235b-a22b-thinking-2507',
          messages,
          max_completion_tokens: max_tokens,
          temperature,
          top_p,
          stream: false
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: CerebrasResponse = await response.json();
      const content = data.choices[0]?.message?.content || 'Maaf, saya tidak dapat memberikan respons saat ini.';
      return content;
    } catch (error) {
      return 'Maaf, terjadi kesalahan dalam sistem AI. Silakan coba lagi nanti.';
    }
  }
}

// Singleton instance
let cerebrasClient: CerebrasClient | null = null;

export function getCerebrasClient(): CerebrasClient {
  if (!cerebrasClient) {
    const apiKey = process.env.CEREBRAS_API_KEY;
    if (!apiKey) {
      throw new Error('CEREBRAS_API_KEY is not set in environment variables');
    }
    cerebrasClient = new CerebrasClient(apiKey);
  }
  return cerebrasClient;
}