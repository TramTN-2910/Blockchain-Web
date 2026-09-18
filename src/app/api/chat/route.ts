import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { Mistral } from '@mistralai/mistralai';
import { BLOCKCHAIN_KNOWLEDGE_BASE } from '@/lib/blockchainKnowledge';

export const dynamic = 'force-dynamic';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT = `
Bạn là **HubBlock AI Assistant** — Trợ lý AI chuyên về Blockchain & Mật mã học (HubBlock - ĐH Ngân hàng TP.HCM).

### NGUYÊN TẮC BẮT BUỘC:
1. **TRẢ LỜI CỰC KỲ NGẮN GỌN & SÚC TÍCH**:
   - Chỉ trả lời từ **2 đến 4 câu ngắn gọn** hoặc **2 đến 3 gạch đầu dòng cốt lõi**.
   - **ĐI THẲNG VÀO CÂU TRẢ LỜI NGAY TỪ CÂU ĐẦU TIÊN**.
   - **KHÔNG** chào hỏi rườm rà (như "Chào bạn, dưới đây là...", "Hy vọng câu trả lời giúp ích...").
   - **KHÔNG** viết đoạn văn dài dòng, không kẻ bảng lớn, không lặp lại câu hỏi.
2. **PHẠM VI**: Chỉ trả lời về Blockchain, SHA-256, PoW Mining, Nonce, RSA, Cây Merkle, Smart Contract, Bảo mật và HubBlock.
3. **TỪ CHỐI NGOÀI LỀ**: Nếu hỏi ngoài lề (nấu ăn, thời tiết, giải trí...), trả lời ngắn gọn:
   "Xin lỗi bạn, tôi chỉ hỗ trợ giải đáp các câu hỏi về Blockchain và Mật mã học."

### TÀI LIỆU THAM KHẢO RAG:
${BLOCKCHAIN_KNOWLEDGE_BASE}
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [] }: { messages: ChatMessage[] } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp tin nhắn hợp lệ.' },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    const mistralApiKey = process.env.MISTRAL_API_KEY;

    // Build the messages payload with system prompt
    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })),
    ];

    // 1. Primary Provider: Groq LPU (Ultra fast)
    if (groqApiKey) {
      try {
        const groq = new Groq({ apiKey: groqApiKey });

        // Auto-discover active models from Groq API
        let activeModels: string[] = [
          'llama-3.3-70b-versatile',
          'llama-3.1-8b-instant',
          'mixtral-8x7b-32768',
          'gemma2-9b-it',
        ];

        try {
          const modelList = await groq.models.list();
          if (modelList?.data && modelList.data.length > 0) {
            const availableIds = modelList.data.map((m: any) => m.id);
            const prioritized = [
              'llama-3.3-70b-versatile',
              'llama-3.1-8b-instant',
              'llama3-70b-8192',
              'llama3-8b-8192',
              'mixtral-8x7b-32768',
              'gemma2-9b-it',
            ].filter((id) => availableIds.includes(id));

            if (prioritized.length > 0) {
              activeModels = prioritized;
            } else {
              activeModels = availableIds;
            }
          }
        } catch {
          // Keep default active list
        }

        // Try models sequentially
        for (const model of activeModels) {
          try {
            const completion = await groq.chat.completions.create({
              model,
              messages: fullMessages as any,
              temperature: 0.2,
              max_tokens: 300,
            });

            const reply = completion.choices[0]?.message?.content;
            if (reply && reply.trim().length > 0) {
              return NextResponse.json({
                reply: reply.trim(),
                provider: 'groq',
                model,
              });
            }
          } catch (modelErr: any) {
            console.warn(`Groq chat model ${model} failed, trying next model...`);
          }
        }
      } catch (groqErr) {
        console.warn('Groq chat failed, falling back to secondary provider:', groqErr);
      }
    }

    // 2. Secondary Provider: Mistral AI
    if (mistralApiKey) {
      try {
        const mistral = new Mistral({ apiKey: mistralApiKey });
        const mistralModels = ['mistral-small-latest', 'open-mistral-7b', 'mistral-large-latest'];

        for (const model of mistralModels) {
          try {
            const response = await mistral.chat.complete({
              model,
              messages: fullMessages as any,
              temperature: 0.2,
              maxTokens: 300,
            });

            const text = response.choices?.[0]?.message?.content;
            if (typeof text === 'string' && text.trim().length > 0) {
              return NextResponse.json({
                reply: text.trim(),
                provider: 'mistral',
                model,
              });
            }
          } catch (mistralErr) {
            console.warn(`Mistral chat model ${model} failed, trying next...`);
          }
        }
      } catch (mistralErr) {
        console.warn('Mistral chat failed:', mistralErr);
      }
    }

    // 3. Fallback Heuristic Knowledge Responder (Offline or Rate-limited)
    const latestUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    let fallbackReply = '';

    if (latestUserMessage.includes('sha') || latestUserMessage.includes('băm') || latestUserMessage.includes('hash')) {
      fallbackReply = `**SHA-256** là hàm băm mật mã học 1 chiều, luôn tạo đầu ra cố định **256 bits (64 ký tự hex)**. Nó có tính chất không thể đảo ngược, kháng va chạm và có hiệu ứng tuyết lở (~50% bit thay đổi khi sửa 1 ký tự đầu vào).`;
    } else if (latestUserMessage.includes('pow') || latestUserMessage.includes('mining') || latestUserMessage.includes('đào') || latestUserMessage.includes('nonce')) {
      fallbackReply = `Trong **Proof of Work (PoW)**, thợ đào thay đổi giá trị số nguyên **Nonce** sao cho mã băm khối nhỏ hơn mục tiêu độ khó (Target). Độ khó tự điều chỉnh mỗi 2016 khối để duy trì thời gian đào 10 phút/khối.`;
    } else if (latestUserMessage.includes('rsa') || latestUserMessage.includes('khóa') || latestUserMessage.includes('chữ ký')) {
      fallbackReply = `**RSA** sử dụng cặp khóa bất đối xứng: **Public Key** $(e, n)$ để mã hóa/xác minh và **Private Key** $(d, n)$ để giải mã/ký. Chữ ký số RSA đảm bảo tính toàn vẹn, xác thực và chống chối bỏ giao dịch.`;
    } else if (latestUserMessage.includes('merkle') || latestUserMessage.includes('cây')) {
      fallbackReply = `**Cây Merkle** là cây nhị phân băm tóm tắt toàn bộ giao dịch thành một **Merkle Root** duy nhất trong Block Header, giúp xác thực giao dịch nhanh chóng với độ phức tạp $O(\\log_2 N)$.`;
    } else {
      fallbackReply = `Tôi là trợ lý AI HubBlock. Tôi có thể giải đáp ngắn gọn về **SHA-256, PoW Mining, RSA, Cây Merkle** và các bài trắc nghiệm Blockchain.`;
    }

    return NextResponse.json({
      reply: fallbackReply,
      provider: 'heuristic',
      model: 'hubblock-knowledge-engine',
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Lỗi xử lý phản hồi từ AI: ' + (error?.message || 'Lỗi không xác định') },
      { status: 500 }
    );
  }
}
