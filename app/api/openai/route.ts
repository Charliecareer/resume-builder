import { type NextRequest, NextResponse } from "next/server"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

// 創建 OpenAI 客戶端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = "gpt-4o", temperature = 0.7, stream = false, type = "general" } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 })
    }

    // 根據不同的請求類型構建不同的 prompt
    let finalPrompt = prompt
    if (type === "analyze_job") {
      finalPrompt = `請分析以下職位描述，並提取關鍵信息：
1. 硬技能要求（技術能力）
2. 軟技能要求（人格特質）
3. 經驗要求
4. 特殊要求或加分項

請以JSON格式返回，包含 hardSkills, softSkills, experienceRequirements, specialRequirements 四個數組欄位。

職位描述：${prompt}`
    } else if (type === "analyze_resume") {
      finalPrompt = `請分析以下履歷與之前提供的職位要求的匹配度，並提供以下信息：
1. 整體匹配度（百分比）
2. 技能匹配度（百分比）
3. 經驗匹配度（百分比）
4. 教育匹配度（百分比）
5. 缺少的關鍵技能（陣列）
6. 缺少的關鍵經驗（陣列）
7. 申請者的優勢（陣列）

請以JSON格式返回。

履歷內容：${prompt}`
    } else if (type === "generate_resume") {
      finalPrompt = `請根據以下信息生成一份專業的履歷，包括中文和英文兩個版本：
1. 個人基本信息
2. 專業技能
3. 工作經驗
4. 教育背景
5. 項目經驗

請確保使用 STAR 原則描述工作經驗和項目，並以 Markdown 格式返回。

信息：${prompt}`
    }

    if (stream) {
      // 使用流式回應
      const response = await openai.chat.completions.create({
        model,
        temperature,
        stream: true,
        messages: [{ role: "user", content: finalPrompt }],
      })

      const stream = OpenAIStream(response)
      return new StreamingTextResponse(stream)
    } else {
      // 標準回應
      const response = await openai.chat.completions.create({
        model,
        temperature,
        messages: [{ role: "user", content: finalPrompt }],
      })

      return NextResponse.json({ result: response.choices[0].message.content })
    }
  } catch (error: any) {
    console.error("OpenAI API error:", error)
    return NextResponse.json({ error: error.message || "An error occurred during the request" }, { status: 500 })
  }
}
