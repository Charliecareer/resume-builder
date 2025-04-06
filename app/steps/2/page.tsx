"use client"

import { useState } from "react"
import { StepLayout } from "@/components/step-layout"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, BrainCircuit, Lightbulb, Wrench, Heart, Star, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// 模擬 AI 分析結果
const mockAnalyzeJobDescription = (jobDescription: string) => {
  return new Promise<{
    hardSkills: string[]
    softSkills: string[]
    experienceRequirements: string[]
    specialRequirements: string[]
  }>((resolve) => {
    setTimeout(() => {
      // 這裡可以替換為實際的 AI 分析邏輯
      const hardSkills = [
        "React.js",
        "TypeScript",
        "Next.js",
        "RESTful API",
        "GraphQL",
        "前端效能優化",
        "響應式設計",
        "CSS-in-JS",
        "單元測試",
      ]

      const softSkills = ["團隊合作", "溝通能力", "問題解決", "時間管理", "適應力", "自主學習", "細節導向"]

      const experienceRequirements = [
        "3年以上前端開發經驗",
        "參與過大型網站開發",
        "帶領團隊經驗",
        "敏捷開發經驗",
        "跨部門協作經驗",
      ]

      const specialRequirements = ["英文流利", "遠端工作能力", "跨時區協作經驗", "願意出差", "具備產品思維"]

      resolve({ hardSkills, softSkills, experienceRequirements, specialRequirements })
    }, 2000)
  })
}

export default function Step2Page() {
  const [jobDescription, setJobDescription] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [analysisResult, setAnalysisResult] = useState<{
    hardSkills: string[]
    softSkills: string[]
    experienceRequirements: string[]
    specialRequirements: string[]
  } | null>(null)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "請輸入職位描述",
        description: "請提供職位描述以進行分析",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      const result = await mockAnalyzeJobDescription(jobDescription)
      setAnalysisResult(result)

      // 儲存分析結果到 localStorage
      localStorage.setItem("resumeBuilder_jobDescription", jobDescription)
      localStorage.setItem("resumeBuilder_analysisResult", JSON.stringify(result))
    } catch (error) {
      toast({
        title: "分析失敗",
        description: "無法分析職位描述，請稍後再試",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleNext = () => {
    if (!analysisResult) {
      toast({
        title: "請先分析職位描述",
        description: "請點擊「分析職位」按鈕進行分析",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  return (
    <StepLayout
      title="分析職位描述"
      description="請提供職位描述，我們將分析出該職位最重要的技能和特質要求"
      currentStep={2}
      nextDisabled={!analysisResult}
      onNext={handleNext}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="jobDescription" className="text-lg font-medium">
            職位描述 (JD)
          </Label>
          <Textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="請貼上完整的職位描述，包括職責、要求和資格條件..."
            className="min-h-[200px]"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobDescription.trim()}
              className="mt-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  分析職位
                </>
              )}
            </Button>
          </div>
        </div>

        {analysisResult && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">分析結果</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Wrench className="mr-2 h-5 w-5 text-emerald-600" />
                    硬技能
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {analysisResult.hardSkills.map((skill, index) => (
                      <li key={index} className="flex items-start gap-1.5">
                        <Star className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                        <span className="text-sm">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Heart className="mr-2 h-5 w-5 text-emerald-600" />
                    軟技能/人格特質
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {analysisResult.softSkills.map((skill, index) => (
                      <li key={index} className="flex items-start gap-1.5">
                        <Star className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                        <span className="text-sm">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Briefcase className="mr-2 h-5 w-5 text-emerald-600" />
                    相關經歷要求
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {analysisResult.experienceRequirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-1.5">
                        <Star className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Lightbulb className="mr-2 h-5 w-5 text-emerald-600" />
                    特殊要求
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {analysisResult.specialRequirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-1.5">
                        <Star className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
              <h3 className="mb-2 font-medium">AI 建議</h3>
              <p className="text-sm text-muted-foreground">
                根據分析，這個職位非常重視技術能力和團隊協作。在您的履歷中，請確保突出您的 React 和 TypeScript 經驗，
                並提供具體的專案案例來展示您的前端開發技能。同時，強調您的溝通能力和團隊合作經驗，
                這對於這個職位來說非常重要。請特別注意展示您的大型專案經驗和跨部門協作能力。
              </p>
            </div>
          </div>
        )}
      </div>
    </StepLayout>
  )
}

