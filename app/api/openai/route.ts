import { OpenAI } from "openai";

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json();

    // 🛡️ 新增：輸入防呆
    if (!resumeText || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "❗請填寫完整的履歷與職缺內容" }),
        { status: 400 }
      );
    }

    console.log("✅ 使用的 OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

    if (!process.env.OPENAI_API_KEY) {
      return new Response("❌ OPENAI_API_KEY 環境變數未設定", { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一位專業的履歷分析顧問，請根據職缺與履歷提供實用的優化建議。",
        },
        {
          role: "user",
          content: `職缺描述：\n${jobDescription}\n\n履歷內容：\n${resumeText}`,
        },
      ],
    });

    return Response.json(completion);
  } catch (error: any) {
    console.error("❌ 後端錯誤：", error);
    return new Response(
      JSON.stringify({ error: "伺服器錯誤，請稍後再試" }),
      { status: 500 }
    );
  }
}

