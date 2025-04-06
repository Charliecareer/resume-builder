import { type NextRequest, NextResponse } from "next/server"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

// 創建 OpenAI 客戶端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = "gpt-3.5-turbo", temperature = 0.7, stream = false } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 })
    }

    if (stream) {
      // 使用流式回應
      const response = await openai.chat.completions.create({
        model,
        temperature,
        stream: true,
        messages: [{ role: "user", content: prompt }],
      })

      const stream = OpenAIStream(response)
      return new StreamingTextResponse(stream)
    } else {
      // 使用標準回應
      const response = await openai.chat.completions.create({
        model,
        temperature,
        messages: [{ role: "user", content: prompt }],
      })

      return NextResponse.json({ result: response.choices[0].message.content })
    }
  } catch (error: any) {
    console.error("OpenAI API error:", error)
    return NextResponse.json({ error: error.message || "An error occurred during the request" }, { status: 500 })
  }
}

