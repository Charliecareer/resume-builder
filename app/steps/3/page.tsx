"use client"

import type React from "react"

import { useState, useRef } from "react"
import { StepLayout } from "@/components/step-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// 模擬履歷分析結果
const mockAnalyzeResume = (resumeText: string, analysisResult: any) => {
  return new Promise<{
    overallMatch: number
    skillsMatch: number
    experienceMatch: number
    educationMatch: number
    missingSkills: string[]
    missingExperiences: string[]
    strengths: string[]
  }>((resolve) => {
    setTimeout(() => {
      // 這裡可以替換為實際的 AI 分析邏輯
      resolve({
        overallMatch: 68,
        skillsMatch: 75,
        experienceMatch: 60,
        educationMatch: 85,
        missingSkills: ["GraphQL", "前端效能優化", "單元測試"],
        missingExperiences: ["大型專案協作經驗", "跨時區團隊合作", "帶領團隊經驗"],
        strengths: ["React.js 開發經驗", "TypeScript 熟練度", "響應式設計能力", "良好的溝通能力"],
      })
    }, 2000)
  })
}

export default function Step3Page() {
  const [resumeText, setResumeText] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [analysisResult, setAnalysisResult] = useState<{
    overallMatch: number
    skillsMatch: number
    experienceMatch: number
    educationMatch: number
    missingSkills: string[]
    missingExperiences: string[]
    strengths: string[]
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 在實際應用中，這裡應該使用適當的文件解析庫
    // 這裡僅模擬文件上傳
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setResumeText(content || "")
      toast({
        title: "履歷上傳成功",
        description: `已上傳 ${file.name}`,
      })
    }
    reader.readAsText(file)
  }

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "請提供履歷內容",
        description: "請上傳或貼上您的履歷內容",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      // 從 localStorage 獲取職位分析結果
      const savedAnalysisResult = localStorage.getItem("resumeBuilder_analysisResult")
      const jobAnalysis = savedAnalysisResult ? JSON.parse(savedAnalysisResult) : null

      const result = await mockAnalyzeResume(resumeText, jobAnalysis)
      setAnalysisResult(result)

      // 儲存履歷和分析結果到 localStorage
      localStorage.setItem("resumeBuilder_resume", resumeText)
      localStorage.setItem("resumeBuilder_resumeAnalysis", JSON.stringify(result))
    } catch (error) {
      toast({
        title: "分析失敗",
        description: "無法分析履歷，請稍後再試",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleNext = () => {
    if (!analysisResult) {
      toast({
        title: "請先分析履歷",
        description: "請點擊「分析匹配度」按鈕進行分析",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  return (
    <StepLayout
      title="分析履歷匹配度"
      description="請提供您的履歷，我們將分析其與目標職位的匹配程度"
      currentStep={3}
      nextDisabled={!analysisResult}
      onNext={handleNext}
    >
      <div className="space-y-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">上傳履歷</TabsTrigger>
            <TabsTrigger value="paste">貼上內容</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 pt-4">
            <div
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-12 text-center hover:border-emerald-300 dark:border-slate-700 dark:hover:border-emerald-700"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mb-4 h-10 w-10 text-slate-400" />
              <h3 className="mb-2 text-lg font-medium">上傳您的履歷</h3>
              <p className="mb-4 text-sm text-muted-foreground">支援 .pdf, .docx, .txt 格式 (最大 5MB)</p>
              <Button variant="outline" className="bg-white dark:bg-slate-950">
                選擇檔案
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
              />
            </div>

            {resumeText && (
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">已上傳履歷</span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{resumeText.substring(0, 200)}...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="paste" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="resumeText" className="text-lg font-medium">
                履歷內容
              </Label>
              <Textarea
                id="resumeText"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="請貼上您的履歷內容，包括個人資料、工作經驗、教育背景、技能等..."
                className="mt-2 min-h-[300px]"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !resumeText.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                分析匹配度
              </>
            )}
          </Button>
        </div>

        {analysisResult && (
          <div className="space-y-6">
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">匹配度分析</h2>

              <div className="mb-6 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">整體匹配度</span>
                  <span className="font-medium">{analysisResult.overallMatch}%</span>
                </div>
                <Progress value={analysisResult.overallMatch} className="h-3" />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>技能匹配</span>
                    <span>{analysisResult.skillsMatch}%</span>
                  </div>
                  <Progress value={analysisResult.skillsMatch} className="h-2" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>經驗匹配</span>
                    <span>{analysisResult.experienceMatch}%</span>
                  </div>
                  <Progress value={analysisResult.experienceMatch} className="h-2" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>教育匹配</span>
                    <span>{analysisResult.educationMatch}%</span>
                  </div>
                  <Progress value={analysisResult.educationMatch} className="h-2" />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-4">
                  <h3 className="mb-3 flex items-center gap-2 font-medium text-red-600 dark:text-red-500">
                    <AlertCircle className="h-5 w-5" />
                    缺少的技能
                  </h3>
                  <ul className="space-y-1">
                    {analysisResult.missingSkills.map((skill, index) => (
                      <li key={index} className="text-sm">
                        • {skill}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="mb-3 flex items-center gap-2 font-medium text-red-600 dark:text-red-500">
                    <AlertCircle className="h-5 w-5" />
                    缺少的經驗
                  </h3>
                  <ul className="space-y-1">
                    {analysisResult.missingExperiences.map((exp, index) => (
                      <li key={index} className="text-sm">
                        • {exp}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="mb-3 flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-500">
                    <CheckCircle className="h-5 w-5" />
                    您的優勢
                  </h3>
                  <ul className="space-y-1">
                    {analysisResult.strengths.map((strength, index) => (
                      <li key={index} className="text-sm">
                        • {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
              <h3 className="mb-2 font-medium">AI 建議</h3>
              <p className="text-sm text-muted-foreground">
                您的履歷與目標職位的整體匹配度為 {analysisResult.overallMatch}%。您在 React.js 和 TypeScript
                方面有很好的經驗， 這是這個職位的核心要求。然而，您需要在下一步中補充一些關鍵技能和經驗，特別是 GraphQL
                和前端效能優化方面的經驗。 建議您在工作經驗部分更具體地描述您的專案規模和團隊協作情況。
              </p>
            </div>
          </div>
        )}
      </div>
    </StepLayout>
  )
}

