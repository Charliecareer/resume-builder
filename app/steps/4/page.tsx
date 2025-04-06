"use client"

import { useState, useEffect } from "react"
import { StepLayout } from "@/components/step-layout"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, PlusCircle, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
// 在文件頂部導入經歷生成器組件
import { ExperienceGenerator } from "@/components/experience-generator"

interface MissingItem {
  type: "skill" | "experience"
  name: string
  suggestion: string
  userInput: string
}

export default function Step4Page() {
  const [missingItems, setMissingItems] = useState<MissingItem[]>([])
  const [activeTab, setActiveTab] = useState<string>("skills")
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const { toast } = useToast()

  useEffect(() => {
    // 從 localStorage 獲取分析結果
    const savedResumeAnalysis = localStorage.getItem("resumeBuilder_resumeAnalysis")
    const savedAnalysisResult = localStorage.getItem("resumeBuilder_analysisResult")

    if (savedResumeAnalysis && savedAnalysisResult) {
      const resumeAnalysis = JSON.parse(savedResumeAnalysis)
      const analysisResult = JSON.parse(savedAnalysisResult)

      const items: MissingItem[] = []

      // 添加缺少的技能
      resumeAnalysis.missingSkills.forEach((skill: string) => {
        items.push({
          type: "skill",
          name: skill,
          suggestion: generateSkillSuggestion(skill, analysisResult),
          userInput: "",
        })
      })

      // 添加缺少的經驗
      resumeAnalysis.missingExperiences.forEach((exp: string) => {
        items.push({
          type: "experience",
          name: exp,
          suggestion: generateExperienceSuggestion(exp, analysisResult),
          userInput: "",
        })
      })

      setMissingItems(items)
    }
  }, [])

  const generateSkillSuggestion = (skill: string, analysisResult: any) => {
    // 這裡可以根據不同的技能生成不同的建議
    const suggestions = {
      GraphQL:
        "描述您如何使用 GraphQL 查詢數據，以及您對 GraphQL Schema 和解析器的理解。如果您有相關學習經驗，也可以提及。",
      前端效能優化:
        "詳述您如何優化網站性能，例如代碼分割、懶加載、圖片優化、減少 HTTP 請求等方法。提供具體的優化成果數據更佳。",
      單元測試:
        "說明您使用過的測試框架（如 Jest、React Testing Library）和您的測試策略。提及您如何編寫測試用例和確保代碼覆蓋率。",
    }

    return (
      suggestions[skill as keyof typeof suggestions] ||
      "描述您對這項技能的理解和應用經驗。如果您沒有直接經驗，可以提及相關的學習經歷或類似技能的遷移能力。"
    )
  }

  const generateExperienceSuggestion = (experience: string, analysisResult: any) => {
    // 這裡可以根據不同的經驗生成不同的建議
    const suggestions = {
      大型專案協作經驗:
        "描述您參與過的最大規模專案，包括團隊規模、您的角色、使用的協作工具（如 Git、JIRA）以及如何解決協作中的挑戰。",
      跨時區團隊合作: "說明您如何與不同時區的團隊成員有效協作，包括溝通策略、會議安排和任務協調方法。",
    }

    return (
      suggestions[experience as keyof typeof suggestions] ||
      "詳細描述相關經驗，包括您的角色、責任、使用的工具和技術，以及取得的成果。如果沒有直接經驗，可以描述類似情境下的經驗。"
    )
  }

  const handleInputChange = (index: number, value: string) => {
    const updatedItems = [...missingItems]
    updatedItems[index].userInput = value
    setMissingItems(updatedItems)
  }

  const handleSave = () => {
    setIsSaving(true)

    // 模擬保存過程
    setTimeout(() => {
      // 儲存用戶輸入到 localStorage
      localStorage.setItem(
        "resumeBuilder_supplements",
        JSON.stringify(
          missingItems.map((item) => ({
            type: item.type,
            name: item.name,
            content: item.userInput,
          })),
        ),
      )

      setIsSaving(false)
      toast({
        title: "已保存補充內容",
        description: "您的補充內容已成功保存",
      })
    }, 1000)
  }

  const handleNext = () => {
    const hasEmptyInputs = missingItems.some((item) => !item.userInput.trim())

    if (hasEmptyInputs) {
      toast({
        title: "請完成所有補充內容",
        description: "請為所有缺少的技能和經驗提供補充內容",
        variant: "destructive",
      })
      return false
    }

    // 儲存最終版本
    handleSave()
    return true
  }

  const skillItems = missingItems.filter((item) => item.type === "skill")
  const experienceItems = missingItems.filter((item) => item.type === "experience")

  // 在 Step4Page 組件中添加處理生成經歷的函數
  const handleExperienceGenerated = (experience: string) => {
    // 找到第一個經驗類型的項目
    const expIndex = missingItems.findIndex((item) => item.type === "experience")
    if (expIndex !== -1) {
      const updatedItems = [...missingItems]
      updatedItems[expIndex].userInput = experience
      setMissingItems(updatedItems)
    }
  }

  return (
    <StepLayout
      title="補充關鍵內容"
      description="根據分析結果，請補充以下缺少的關鍵技能和經驗"
      currentStep={4}
      onNext={handleNext}
    >
      <div className="space-y-6">
        {/* 在 return 語句中，在 Tabs 組件之前添加經歷生成器 */}
        <div className="mb-6">
          <ExperienceGenerator onGenerated={handleExperienceGenerated} />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="skills">技能補充 ({skillItems.length})</TabsTrigger>
            <TabsTrigger value="experiences">經驗補充 ({experienceItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-6 pt-4">
            {skillItems.length === 0 ? (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">沒有需要補充的技能</p>
              </div>
            ) : (
              skillItems.map((item, index) => {
                const itemIndex = missingItems.findIndex((i) => i === item)
                return (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                        <div className="mb-2 flex items-center gap-1.5">
                          <Lightbulb className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-medium">建議呈現方式</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.suggestion}</p>
                      </div>

                      <div>
                        <Label htmlFor={`skill-${index}`} className="text-sm">
                          您的補充內容
                        </Label>
                        <Textarea
                          id={`skill-${index}`}
                          value={item.userInput}
                          onChange={(e) => handleInputChange(itemIndex, e.target.value)}
                          placeholder="請根據建議補充相關內容..."
                          className="mt-1.5 min-h-[120px]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>

          <TabsContent value="experiences" className="space-y-6 pt-4">
            {experienceItems.length === 0 ? (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">沒有需要補充的經驗</p>
              </div>
            ) : (
              experienceItems.map((item, index) => {
                const itemIndex = missingItems.findIndex((i) => i === item)
                return (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                        <div className="mb-2 flex items-center gap-1.5">
                          <Lightbulb className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-medium">建議呈現方式</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.suggestion}</p>
                      </div>

                      <div>
                        <Label htmlFor={`experience-${index}`} className="text-sm">
                          您的補充內容
                        </Label>
                        <Textarea
                          id={`experience-${index}`}
                          value={item.userInput}
                          onChange={(e) => handleInputChange(itemIndex, e.target.value)}
                          placeholder="請根據建議補充相關內容..."
                          className="mt-1.5 min-h-[120px]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setActiveTab(activeTab === "skills" ? "experiences" : "skills")
            }}
            className="flex items-center gap-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            {activeTab === "skills" ? "切換到經驗補充" : "切換到技能補充"}
          </Button>

          <Button onClick={handleSave} disabled={isSaving} variant="secondary" className="flex items-center gap-1.5">
            {isSaving ? (
              <>儲存中...</>
            ) : (
              <>
                <Save className="h-4 w-4" />
                儲存補充內容
              </>
            )}
          </Button>
        </div>
      </div>
    </StepLayout>
  )
}

