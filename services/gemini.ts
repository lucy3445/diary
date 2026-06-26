import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../constants/config';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const SYSTEM = `당신은 "하루" 앱의 따뜻한 일상 코치예요. 사용자가 오늘 하루를 돌아보고 마음을 정리할 수 있도록 대화로 도와줘요.

규칙:
- 짧고 따뜻하게, 2-3문장 이내로 답해요
- 판단하지 않고 공감하며 들어줘요
- 자연스러운 후속 질문을 하나 넣어요
- 한국어, 해요체만 사용해요

대화 흐름:
1. 오늘 하루 전반적으로 어땠는지
2. 기억에 남는 순간이나 감정
3. 잘 된 점 또는 어려웠던 점
4. 내일로 이어갈 것

5~7번 교환 후 자연스럽게 마무리하고, 응답 맨 끝에 [DONE]을 추가해요.`;

export type GeminiMsg = Content;

export async function sendToCoach(
  history: GeminiMsg[],
  userText: string
): Promise<{ text: string; done: boolean }> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM,
  });

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(userText);
  const raw = result.response.text();
  const done = raw.includes('[DONE]');
  return { text: raw.replace('[DONE]', '').trim(), done };
}
