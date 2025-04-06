"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Search, HelpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useOpenAI } from "@/hooks/use-openai"

interface JobAssistantProps {
  onSelectIndustry?: (industry: string) => void
  onSelectPosition?: (position: string) => void
}

export function JobAssistant({ onSelectIndustry, onSelectPosition }: JobAssistantProps) {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<string>("")
  const { toast } = useToast()
  const { generateText, isLoading } = useOpenAI({ temperature: 0.7 })

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "請輸入查詢內容",
        description: "請輸入您想了解的公司或職位",
        variant: "destructive",
      })
      return
    }

    try {
      // 構建 prompt
      const prompt = `
      請幫我回答以下關於職業和公司的問題，使用繁體中文回覆。
      如果問題是關於某公司屬於哪個產業，請提供該公司所屬的產業類別和主要業務。
      如果問題是關於職位名稱，請提供該職位的中英文名稱、所屬產業和相似職位。
      如果問題是尋找相似公司，請列出3-5家相似的公司及其簡短描述。
      
      請保持回答簡潔、專業，並使用繁體中文。
      
      問題: ${query}
      `

      const result = await generateText(prompt)
      if (result) {
        setResult(result)
      } else {
        toast({
          title: "查詢失敗",
          description: "無法獲取相關資訊，請稍後再試",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "查詢失敗",
        description: "無法獲取相關資訊，請稍後再試",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="border-2 border-emerald-100 dark:border-emerald-900">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <HelpCircle className="h-5 w-5 text-emerald-600" />
          職位助手
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="輸入公司名稱、職位名稱或相關問題..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {result && (
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
            <p className="whitespace-pre-line text-sm">{result}</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>您可以詢問：</p>
          <ul className="mt-1 space-y-1">
            <li>• Google 屬於哪個產業？</li>
            <li>• 業務開發代表是什麼職位？</li>
            <li>• 推薦與台積電類似的公司</li>
            <li>• 行銷經理有哪些相關職位？</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

