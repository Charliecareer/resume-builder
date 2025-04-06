"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Wand2, Copy, CheckCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useOpenAI } from "@/hooks/use-openai"

interface ExperienceGeneratorProps {
  onGenerated: (experience: string) => void
}

export function ExperienceGenerator({ onGenerated }: ExperienceGeneratorProps) {
  const [activeTab, setActiveTab] = useState<string>("template")
  const [generatedExperience, setGeneratedExperience] = useState<string>("")
  const [copied, setCopied] = useState<boolean>(false)
  const { toast } = useToast()

  // 使用 OpenAI hook
  const { generateText, isLoading } = useOpenAI({ temperature: 0.7 })

  // 模板表單數據
  const [templateData, setTemplateData] = useState({
    position: "",
    company: "",
    duration: "",
    situation: "",
    task: "",
    action: "",
    result: "",
  })

  // 自由輸入數據
  const [freeformData, setFreeformData] = useState({
    keywords: "",
    description: "",
  })

  const handleTemplateChange = (field: string, value: string) => {
    setTemplateData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFreeformChange = (field: string, value: string) => {
    setFreeformData((prev) => ({ ...prev, [field]: value }))
  }

  const generateFromTemplate = async () => {
    // 檢查必填欄位
    if (!templateData.position || !templateData.action || !templateData.result) {
      toast({
        title: "請填寫必填欄位",
        description: "職位、行動和結果是必填欄位",
        variant: "destructive",
      })
      return
    }

    // 構建 prompt
    const prompt = `
    請根據以下 STAR 原則的資訊，生成一段專業的工作經歷描述，用於履歷表。
    請使用強動詞開頭，並確保包含具體的數據或成果。
    請使用繁體中文回覆，並使用 Markdown 格式。
    
    職位: ${templateData.position}
    公司: ${templateData.company || "[未提供]"}
    時間範圍: ${templateData.duration || "[未提供]"}
    情境(Situation): ${templateData.situation || "[未提供]"}
    任務(Task): ${templateData.task || "[未提供]"}
    行動(Action): ${templateData.action}
    結果(Result): ${templateData.result}
    
    請生成一個職位標題行，格式為 "**職位** | 公司 | 時間範圍"，
    然後生成 2-3 個以強動詞開頭的工作經歷要點，每個要點應該遵循 STAR 原則。
    每個要點應該以 "- **[強動詞]**" 開頭，例如 "- **領導**"、"- **優化**"、"- **實現**" 等。
    請確保動詞不重複，並且要點簡潔有力。
    `

    try {
      const result = await generateText(prompt)
      if (result) {
        setGeneratedExperience(result)
      } else {
        toast({
          title: "生成失敗",
          description: "無法生成經歷描述，請稍後再試",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "生成失敗",
        description: "無法生成經歷描述，請稍後再試",
        variant: "destructive",
      })
    }
  }

  const generateFromFreeform = async () => {
    if (!freeformData.description) {
      toast({
        title: "請填寫經歷描述",
        description: "請提供您的經歷描述以生成STAR格式內容",
        variant: "destructive",
      })
      return
    }

    // 構建 prompt
    const prompt = `
    請將以下工作經歷描述轉換為符合 STAR 原則的專業履歷表格式。
    請使用強動詞開頭，並確保包含具體的數據或成果。
    請使用繁體中文回覆，並使用 Markdown 格式。
    
    原始描述:
    ${freeformData.description}
    
    ${freeformData.keywords ? `關鍵詞: ${freeformData.keywords}` : ""}
    
    請生成一個職位標題行，格式為 "**職位** | 公司 | 時間範圍"，
    然後生成 2-4 個以強動詞開頭的工作經歷要點，每個要點應該遵循 STAR 原則。
    每個要點應該以 "- **[強動詞]**" 開頭，例如 "- **領導**"、"- **優化**"、"- **實現**" 等。
    請確保動詞不重複，並且要點簡潔有力。
    如果原始描述中沒有提供具體數據，請合理推測並添加百分比或數字來量化成果。
    `

    try {
      const result = await generateText(prompt)
      if (result) {
        setGeneratedExperience(result)
      } else {
        toast({
          title: "生成失敗",
          description: "無法生成經歷描述，請稍後再試",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "生成失敗",
        description: "無法生成經歷描述，請稍後再試",
        variant: "destructive",
      })
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedExperience)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "已複製到剪貼簿",
      description: "您可以將內容貼到補充欄位中",
    })
  }

  const handleUse = () => {
    onGenerated(generatedExperience)

    toast({
      title: "已添加到補充內容",
      description: "生成的經歷已添加到補充欄位",
    })

    // 重置表單
    if (activeTab === "template") {
      setTemplateData({
        position: "",
        company: "",
        duration: "",
        situation: "",
        task: "",
        action: "",
        result: "",
      })
    } else {
      setFreeformData({
        keywords: "",
        description: "",
      })
    }

    setGeneratedExperience("")
  }

  return (
    <Card className="border-2 border-emerald-100 dark:border-emerald-900">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wand2 className="h-5 w-5 text-emerald-600" />
          AI 經歷生成器
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="template">STAR模板填寫</TabsTrigger>
            <TabsTrigger value="freeform">自由描述轉換</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="position" className="text-sm font-medium">
                  職位名稱 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="position"
                  value={templateData.position}
                  onChange={(e) => handleTemplateChange("position", e.target.value)}
                  placeholder="例：產品經理"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="company" className="text-sm font-medium">
                  公司名稱
                </Label>
                <Input
                  id="company"
                  value={templateData.company}
                  onChange={(e) => handleTemplateChange("company", e.target.value)}
                  placeholder="例：創新科技公司"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="duration" className="text-sm font-medium">
                  時間範圍
                </Label>
                <Input
                  id="duration"
                  value={templateData.duration}
                  onChange={(e) => handleTemplateChange("duration", e.target.value)}
                  placeholder="例：2020年6月 - 2022年5月"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="situation" className="text-sm font-medium">
                  情境 (Situation)
                </Label>
                <Input
                  id="situation"
                  value={templateData.situation}
                  onChange={(e) => handleTemplateChange("situation", e.target.value)}
                  placeholder="例：市場競爭激烈"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="task" className="text-sm font-medium">
                  任務 (Task)
                </Label>
                <Input
                  id="task"
                  value={templateData.task}
                  onChange={(e) => handleTemplateChange("task", e.target.value)}
                  placeholder="例：提升產品轉化率"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="action" className="text-sm font-medium">
                  行動 (Action) <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="action"
                  value={templateData.action}
                  onChange={(e) => handleTemplateChange("action", e.target.value)}
                  placeholder="例：重新設計了用戶註冊流程，簡化了步驟並優化了表單驗證"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="result" className="text-sm font-medium">
                  結果 (Result) <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="result"
                  value={templateData.result}
                  onChange={(e) => handleTemplateChange("result", e.target.value)}
                  placeholder="例：提升轉化率30%並減少客服工單量25%"
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              onClick={generateFromTemplate}
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  AI 生成中...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  生成 STAR 格式經歷
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="freeform" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="keywords" className="text-sm font-medium">
                關鍵詞（選填）
              </Label>
              <Input
                id="keywords"
                value={freeformData.keywords}
                onChange={(e) => handleFreeformChange("keywords", e.target.value)}
                placeholder="例：產品經理、用戶體驗、轉化率"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                經歷描述 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={freeformData.description}
                onChange={(e) => handleFreeformChange("description", e.target.value)}
                placeholder="請描述您的工作經歷，包括職責、成就和使用的技能..."
                className="mt-1 min-h-[150px]"
              />
            </div>

            <Button
              onClick={generateFromFreeform}
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  AI 生成中...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  轉換為 STAR 格式
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {generatedExperience && (
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border bg-slate-50 p-3 dark:bg-slate-900">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">AI 生成結果</span>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0">
                  {copied ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="whitespace-pre-line text-sm">{generatedExperience}</div>
            </div>

            <Button onClick={handleUse} className="w-full">
              使用此經歷
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

