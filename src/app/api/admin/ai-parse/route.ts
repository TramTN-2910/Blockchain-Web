import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { Mistral } from '@mistralai/mistralai';

export const dynamic = 'force-dynamic';

interface ParsedOption {
  id: string;
  text_vn: string;
  text_en?: string;
  is_correct: boolean;
}

interface ParsedQuestion {
  topic_slug: string;
  topic_name_vn: string;
  type: 'single' | 'multiple';
  question_vn: string;
  options: ParsedOption[];
  explanation_vn: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Smart heuristic regex parser when AI services are offline or keys are not provided
function parseRawTextHeuristic(rawText: string, topicSlug = 'hash', difficulty = 'medium'): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  
  // Split by Question markers (e.g. "Câu 1:", "Câu 2.", "1.", "Question 1:")
  const blocks = rawText
    .split(/(?=(?:(?:Câu|Question)\s*\d+[\.:\)]|^\s*\d+[\.\)]\s+))/gim)
    .filter((b) => b.trim().length > 15);

  const targetBlocks = blocks.length > 0 ? blocks : [rawText];

  for (const block of targetBlocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;

    // First line or question text
    let questionText = lines[0].replace(/^(?:(?:Câu|Question)\s*\d+[\.:\)]|\d+[\.\)]\s*)/i, '').trim();
    if (!questionText && lines[1]) {
      questionText = lines[1];
    }

    const options: ParsedOption[] = [];
    let correctAnswerKey = 'A';
    let explanation = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Match A. Option / A) Option / A: Option
      const optMatch = line.match(/^([A-D])[\.\:\)]\s*(.+)$/i);
      if (optMatch) {
        const key = optMatch[1].toUpperCase();
        const optText = optMatch[2].trim();
        options.push({
          id: `opt-${key.toLowerCase()}`,
          text_vn: optText,
          text_en: optText,
          is_correct: false,
        });
        continue;
      }

      // Match Đáp án: A / Answer: B
      const ansMatch = line.match(/^(?:Đáp án|Answer|Key|Đ\/A|ĐA)[:\s]*([A-D])/i);
      if (ansMatch) {
        correctAnswerKey = ansMatch[1].toUpperCase();
        continue;
      }

      // Match Giải thích: ... / Explanation: ...
      const expMatch = line.match(/^(?:Giải thích|Explanation|Chi tiết)[:\s]*(.+)$/i);
      if (expMatch) {
        explanation = expMatch[1].trim();
        continue;
      }
    }

    // Set correct option
    const finalOptions = options.map((opt) => ({
      ...opt,
      is_correct: opt.id === `opt-${correctAnswerKey.toLowerCase()}`,
    }));

    if (finalOptions.length >= 2) {
      if (!finalOptions.some((o) => o.is_correct)) {
        finalOptions[0].is_correct = true;
      }

      questions.push({
        topic_slug: topicSlug,
        topic_name_vn:
          topicSlug === 'hash'
            ? 'Hàm băm & SHA-256'
            : topicSlug === 'mining'
            ? 'Khai thác & PoW'
            : topicSlug === 'rsa'
            ? 'Mã hoá RSA'
            : topicSlug === 'merkle'
            ? 'Cây Merkle'
            : 'Kiến thức Blockchain',
        type: 'single',
        question_vn: questionText || 'Câu hỏi trắc nghiệm Blockchain',
        options: finalOptions,
        explanation_vn: explanation || 'Giải thích chuẩn theo lý thuyết mật mã học và Blockchain.',
        difficulty: (difficulty as any) || 'medium',
      });
    }
  }

  return questions;
}

export async function POST(req: NextRequest) {
  try {
    const { rawText, topicSlug = 'hash', difficulty = 'medium' } = await req.json();

    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return NextResponse.json(
        { error: 'Văn bản thô (rawText) là bắt buộc.' },
        { status: 400 }
      );
    }

    const groqKey = process.env.GROQ_API_KEY;
    const mistralKey = process.env.MISTRAL_API_KEY;

    const prompt = `Bạn là chuyên gia bóc tách đề thi trắc nghiệm mật mã học và Blockchain.
Hãy trích xuất danh sách các câu hỏi từ đoạn văn bản thô sau thành mảng JSON chuẩn.
Đoạn văn bản thô:
"""
${rawText}
"""

Yêu cầu đầu ra CHỈ LÀ MỘT OBJECT JSON duy nhất không markdown:
{
  "questions": [
    {
      "topic_slug": "${topicSlug}",
      "topic_name_vn": "Chủ đề câu hỏi",
      "type": "single",
      "question_vn": "Nội dung câu hỏi",
      "options": [
        { "id": "opt-a", "text_vn": "Nội dung phương án A", "is_correct": boolean },
        { "id": "opt-b", "text_vn": "Nội dung phương án B", "is_correct": boolean },
        { "id": "opt-c", "text_vn": "Nội dung phương án C", "is_correct": boolean },
        { "id": "opt-d", "text_vn": "Nội dung phương án D", "is_correct": boolean }
      ],
      "explanation_vn": "Giải thích chi tiết vì sao đáp án đúng",
      "difficulty": "${difficulty}"
    }
  ]
}`;

    // 1. PRIMARY PROVIDER: Groq AI (Ultra fast LPU inference)
    if (groqKey && groqKey !== 'your-groq-api-key-here' && groqKey !== 'gsk_your_groq_api_key_here') {
      try {
        const groq = new Groq({ apiKey: groqKey });
        
        // Dynamically discover all active models on this Groq account
        let activeModelIds: string[] = [];
        try {
          const modelsList = await groq.models.list();
          activeModelIds = (modelsList.data || [])
            .map((m: any) => m.id)
            .filter((id: string) => !id.includes('whisper') && !id.includes('guard'));
          console.log('Active Groq models found:', activeModelIds);
        } catch (listErr) {
          activeModelIds = [
            'gemma2-9b-it',
            'llama-3.1-70b-versatile',
            'llama-3.2-3b-preview',
            'llama-3.2-11b-vision-preview',
          ];
        }

        for (const model of activeModelIds) {
          try {
            const completion = await groq.chat.completions.create({
              model,
              messages: [{ role: 'user', content: prompt }],
              response_format: { type: 'json_object' },
              temperature: 0.1,
            });

            const contentStr = completion.choices?.[0]?.message?.content;
            if (contentStr) {
              const parsed = JSON.parse(contentStr);
              const questionsList = parsed.questions || parsed.data?.questions || parsed;
              if (Array.isArray(questionsList) && questionsList.length > 0) {
                return NextResponse.json({
                  success: true,
                  questions: questionsList,
                  provider: `Groq LPU (${model})`,
                  isFallback: false,
                });
              }
            }
          } catch (groqErr: any) {
            console.warn(`Groq model ${model} failed (${groqErr?.message}), trying next model...`);
          }
        }
      } catch (groqInitErr: any) {
        console.warn('Groq initialization error:', groqInitErr?.message);
      }
    }

    // 2. SECONDARY PROVIDER: Mistral AI
    if (mistralKey && mistralKey !== 'your-mistral-api-key-here') {
      try {
        const mistralClient = new Mistral({ apiKey: mistralKey });
        const chatResponse = await mistralClient.chat.complete({
          model: 'mistral-small-latest',
          messages: [{ role: 'user', content: prompt }],
          responseFormat: { type: 'json_object' },
        });

        const contentStr = chatResponse.choices?.[0]?.message?.content;
        if (contentStr) {
          const parsed = JSON.parse(contentStr as string);
          const questionsList = parsed.questions || parsed.data?.questions || parsed;
          if (Array.isArray(questionsList) && questionsList.length > 0) {
            return NextResponse.json({
              success: true,
              questions: questionsList,
              provider: 'Mistral AI',
              isFallback: false,
            });
          }
        }
      } catch (mistralErr: any) {
        console.warn('Mistral AI Parse Error / Rate Limit:', mistralErr?.message);
      }
    }

    // 3. FALLBACK: Smart Heuristic Regex Parser
    const fallbackQuestions = parseRawTextHeuristic(rawText, topicSlug, difficulty);
    return NextResponse.json({
      success: true,
      questions: fallbackQuestions,
      provider: 'Smart Heuristic Parser',
      isFallback: true,
      message: 'Đã bóc tách thành công qua bộ phân tích thông minh.',
    });

  } catch (error: any) {
    console.error('Lỗi API AI Parse:', error);
    return NextResponse.json(
      { error: error.message || 'Lỗi xử lý trích xuất văn bản.' },
      { status: 500 }
    );
  }
}
