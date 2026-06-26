import { GEMINI_API_KEY } from '../constants/config';

const MODEL = 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

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

export type ChatTurn = { role: 'user' | 'model'; text: string };

export type DiaryData = {
  title: string;
  moodArc: string[];
  primary: string;
  body: string;
  insights: { type: 'learn' | 'keep' | 'fix'; text: string }[];
  tags: string[];
  carryTodos: string[];
};

async function callGemini(contents: object[], systemInstruction?: string, maxTokens = 300, retry = true): Promise<string> {
  const body: Record<string, unknown> = {
    contents,
    generationConfig: { maxOutputTokens: maxTokens, temperature: 0.8 },
  };
  if (systemInstruction) {
    body.system_instruction = { parts: [{ text: systemInstruction }] };
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 429 && retry) {
      const match = errText.match(/retry in ([\d.]+)s/);
      const delay = match ? Math.ceil(parseFloat(match[1])) * 1000 + 1000 : 20000;
      await new Promise(r => setTimeout(r, delay));
      return callGemini(contents, systemInstruction, maxTokens, false);
    }
    throw new Error(`Gemini error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

export async function sendToCoach(history: ChatTurn[], userText: string): Promise<{ text: string; done: boolean }> {
  const contents = [
    ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
    { role: 'user', parts: [{ text: userText }] },
  ];

  const raw = await callGemini(contents, SYSTEM, 300);
  const done = raw.includes('[DONE]');
  return { text: raw.replace('[DONE]', '').trim(), done };
}

export async function generateDiary(history: ChatTurn[]): Promise<DiaryData> {
  const convoText = history
    .map(h => `${h.role === 'user' ? '사용자' : '코치'}: ${h.text}`)
    .join('\n');

  const prompt = `다음은 사용자와 코치의 대화예요:\n\n${convoText}\n\n위 대화를 바탕으로 오늘의 일기를 아래 JSON 형식으로 작성해주세요. JSON만 반환하고 다른 텍스트는 넣지 마세요.\n\n{\n  "title": "오늘 하루를 한 문장으로 표현한 제목 (20자 이내)",\n  "moodArc": ["감정1", "감정2"],\n  "primary": "주요 감정 하나",\n  "body": "일기 본문 (2-3문단, 사용자 1인칭 시점으로)",\n  "insights": [\n    {"type": "learn", "text": "오늘 배운 것이나 깨달은 것"},\n    {"type": "keep", "text": "계속하면 좋을 것"},\n    {"type": "fix", "text": "바꾸거나 개선할 것"}\n  ],\n  "tags": ["태그1", "태그2", "태그3"],\n  "carryTodos": ["내일 할 일1", "내일 할 일2"]\n}\n\nmoodArc와 primary는 반드시 다음 중에서만 선택하세요: joy, calm, focus, tired, anx, low`;

  const raw = await callGemini(
    [{ role: 'user', parts: [{ text: prompt }] }],
    undefined,
    1000,
  );

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`JSON 없음: ${raw.slice(0, 200)}`);
  try {
    return JSON.parse(jsonMatch[0]) as DiaryData;
  } catch {
    throw new Error(`JSON 파싱 실패: ${jsonMatch[0].slice(0, 200)}`);
  }
}
