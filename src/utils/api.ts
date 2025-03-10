import { Message } from '../types/chat';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function streamCompletion(
  messages: Message[],
  apiKey: string,
  onChunk: (chunk: string) => void
) {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages,
        stream: true,
      }),
    });

    if(response.status !==200){
      alert('api key 无效')      
      return
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { value, done } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        if (line.includes('[DONE]')) continue;
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          const content = data.choices[0]?.delta?.content || '';
          if (content) onChunk(content);
        }
      }
    }
  } catch (error) {
    console.error('Stream error:', error);
    alert('请求出错，请检查网络连接或API key是否正确');
    throw error;
  }
}