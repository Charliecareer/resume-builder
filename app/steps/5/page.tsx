"use client"

import { useState, useEffect } from "react"
import { StepLayout } from "@/components/step-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Download, Share2, FileText, Languages } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// 更新 mockGenerateResume 函數中的工作經驗部分，確保使用STAR原則

const mockGenerateResume = () => {
  return new Promise<{
    chinese: string
    english: string
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        chinese: `# 王小明

## 聯絡資訊
電話: 0912-345-678
Email: wang.xiaoming@example.com
LinkedIn: linkedin.com/in/wang-xiaoming

## 專業摘要
資深前端開發工程師，擁有5年 React.js 和 TypeScript 開發經驗。專注於打造高效能、響應式的 Web 應用程式，具備優秀的團隊協作和溝通能力。熟悉現代前端開發工具和最佳實踐，能夠快速適應新技術和挑戰。

## 技能
- **前端框架**: React.js, Next.js, Vue.js
- **程式語言**: TypeScript, JavaScript, HTML5, CSS3
- **狀態管理**: Redux, Context API, Zustand
- **UI 框架**: Material-UI, Tailwind CSS, Ant Design
- **API 整合**: RESTful API, GraphQL
- **前端效能優化**: 代碼分割, 懶加載, 圖片優化
- **測試**: Jest, React Testing Library
- **版本控制**: Git, GitHub
- **其他工具**: Webpack, Vite, ESLint, Prettier

## 工作經驗
### 資深前端工程師 | 台灣科技公司 | 2020年6月 - 至今
- **領導**5人前端團隊開發企業級 SaaS 平台，設計並實現了模組化的前端架構
- **優化**前端性能，將頁面加載時間減少40%，提升用戶體驗和留存率
- **導入**GraphQL 替代傳統 RESTful API，減少50%的網絡請求和數據傳輸量
- **建立**前端自動化測試流程，提高代碼覆蓋率至85%，減少生產環境bug數量30%
- **協調**跨時區團隊協作，使用敏捷開發方法，確保專案按時交付並達到質量標準

### 前端開發工程師 | 創新數位公司 | 2018年3月 - 2020年5月
- **重構**舊有電商平台，將jQuery代碼遷移至React框架，提升開發效率40%
- **設計**響應式UI組件庫，確保在各種設備上的一致用戶體驗
- **實現**購物車和結帳流程，整合多種支付系統，提升轉化率15%
- **優化**網站SEO和可訪問性，使有機流量增加25%，降低跳出率10%
- **參與**大型專案協作，與後端團隊密切合作，確保前後端無縫對接

## 教育背景
### 國立台灣大學 | 資訊工程學系 | 2014年9月 - 2018年6月
- 學士學位，GPA: 3.8/4.0
- 相關課程: 網頁程式設計, 資料結構, 演算法, 資料庫系統

## 語言能力
- 中文: 母語
- 英文: 流利 (TOEIC 900分)

## 專案經驗
### 企業數據分析儀表板
- **開發**複雜的數據可視化儀表板，使用React.js, TypeScript和D3.js
- **實現**實時數據更新和互動式圖表，提升用戶數據分析效率30%
- **優化**大數據集渲染性能，處理超過10萬條記錄的流暢顯示，減少95%的渲染時間

### 跨平台電商應用
- **構建**React Native應用，實現iOS和Android平台的統一代碼庫
- **設計**離線模式和數據同步功能，提升用戶在弱網環境下的使用體驗
- **整合**多種支付方式和物流追蹤系統，使訂單完成率提高20%`,
        english: `# Wang Xiaoming

## Contact Information
Phone: 0912-345-678
Email: wang.xiaoming@example.com
LinkedIn: linkedin.com/in/wang-xiaoming

## Professional Summary
Senior Front-end Developer with 5 years of experience in React.js and TypeScript. Focused on building high-performance, responsive web applications with excellent team collaboration and communication skills. Proficient in modern front-end development tools and best practices, with the ability to quickly adapt to new technologies and challenges.

## Skills
- **Front-end Frameworks**: React.js, Next.js, Vue.js
- **Programming Languages**: TypeScript, JavaScript, HTML5, CSS3
- **State Management**: Redux, Context API, Zustand
- **UI Frameworks**: Material-UI, Tailwind CSS, Ant Design
- **API Integration**: RESTful API, GraphQL
- **Front-end Performance Optimization**: Code splitting, Lazy loading, Image optimization
- **Testing**: Jest, React Testing Library
- **Version Control**: Git, GitHub
- **Other Tools**: Webpack, Vite, ESLint, Prettier

## Work Experience
### Senior Front-end Engineer | Taiwan Tech Company | June 2020 - Present
- **Led** a 5-person front-end team in developing an enterprise-level SaaS platform with a modular architecture
- **Optimized** front-end performance, reducing page load time by 40% and improving user experience and retention
- **Implemented** GraphQL to replace traditional RESTful APIs, reducing network requests by 50% and data transfer volume
- **Established** front-end automated testing processes, increasing code coverage to 85% and reducing production bugs by 30%
- **Coordinated** with cross-timezone teams using agile methodologies to ensure on-time delivery and quality standards

### Front-end Developer | Digital Innovation Company | March 2018 - May 2020
- **Refactored** legacy e-commerce platform, migrating jQuery code to React framework, improving development efficiency by 40%
- **Designed** responsive UI component library, ensuring consistent user experience across various devices
- **Implemented** shopping cart and checkout process, integrating multiple payment systems, increasing conversion rate by 15%
- **Enhanced** website SEO and accessibility, resulting in 25% increase in organic traffic and 10% decrease in bounce rate
- **Participated** in large-scale project collaboration, working closely with backend team to ensure seamless integration

## Education
### National Taiwan University | Computer Science | September 2014 - June 2018
- Bachelor's Degree, GPA: 3.8/4.0
- Relevant Courses: Web Programming, Data Structures, Algorithms, Database Systems

## Language Proficiency
- Chinese: Native
- English: Fluent (TOEIC 900)

## Project Experience
### Enterprise Data Analytics Dashboard
- **Developed** complex data visualization dashboards using React.js, TypeScript, and D3.js
- **Implemented** real-time data updates and interactive charts, improving user data analysis efficiency by 30%
- **Optimized** rendering performance for large datasets, handling smooth display of over 100,000 records with 95% reduction in rendering time

### Cross-platform E-commerce Application
- **Built** React Native application with unified codebase for iOS and Android platforms
- **Designed** offline mode and data synchronization features, improving user experience in weak network environments
- **Integrated** multiple payment methods and logistics tracking systems, increasing order completion rate by 20%`,
      })
    }, 2000)
  })
}

// 履歷模板選項
const resumeTemplates = [
  { id: "professional", name: "專業簡潔" },
  { id: "creative", name: "創意設計" },
  { id: "academic", name: "學術研究" },
  { id: "technical", name: "技術導向" },
  { id: "executive", name: "高階管理" },
]

export default function Step5Page() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [resumeData, setResumeData] = useState<{
    chinese: string
    english: string
  } | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("professional")
  const [activeTab, setActiveTab] = useState<string>("chinese")
  const { toast } = useToast()

  useEffect(() => {
    // 自動生成履歷
    generateResume()
  }, [])

  const generateResume = async () => {
    setIsGenerating(true)
    try {
      const result = await mockGenerateResume()
      setResumeData(result)
    } catch (error) {
      toast({
        title: "生成失敗",
        description: "無法生成履歷，請稍後再試",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!resumeData) return

    // 在實際應用中，這裡應該使用適當的 PDF 生成庫
    // 這裡僅模擬下載功能
    const content = activeTab === "chinese" ? resumeData.chinese : resumeData.english
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = activeTab === "chinese" ? "履歷_中文.md" : "resume_english.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "下載成功",
      description: `已下載${activeTab === "chinese" ? "中文" : "英文"}履歷`,
    })
  }

  const handleShare = () => {
    // 模擬分享功能
    toast({
      title: "分享連結已複製",
      description: "履歷分享連結已複製到剪貼簿",
    })
  }

  return (
    <StepLayout title="生成完整履歷" description="您的中英文履歷已生成完畢，可以預覽、下載或分享" currentStep={5}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <Label htmlFor="template" className="text-base font-medium">
              選擇履歷模板
            </Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger id="template" className="w-full sm:w-[200px]">
                <SelectValue placeholder="選擇模板" />
              </SelectTrigger>
              <SelectContent>
                {resumeTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare} className="flex items-center gap-1.5">
              <Share2 className="h-4 w-4" />
              分享
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isGenerating || !resumeData}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
            >
              <Download className="h-4 w-4" />
              下載履歷
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chinese" className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              中文履歷
            </TabsTrigger>
            <TabsTrigger value="english" className="flex items-center gap-1.5">
              <Languages className="h-4 w-4" />
              英文履歷
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chinese" className="pt-4">
            <Card>
              <CardContent className="p-6">
                {isGenerating ? (
                  <div className="flex h-[600px] items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-emerald-600" />
                      <p>正在生成您的中文履歷...</p>
                    </div>
                  </div>
                ) : resumeData ? (
                  <div className="prose prose-slate max-w-none dark:prose-invert">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: resumeData.chinese
                          .replace(/^# (.*$)/gm, "<h1>$1</h1>")
                          .replace(/^## (.*$)/gm, "<h2>$1</h2>")
                          .replace(/^### (.*$)/gm, "<h3>$1</h3>")
                          .replace(/\n- /g, "<br/>• ")
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex h-[600px] items-center justify-center">
                    <p>無法載入履歷內容</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="english" className="pt-4">
            <Card>
              <CardContent className="p-6">
                {isGenerating ? (
                  <div className="flex h-[600px] items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-emerald-600" />
                      <p>Generating your English resume...</p>
                    </div>
                  </div>
                ) : resumeData ? (
                  <div className="prose prose-slate max-w-none dark:prose-invert">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: resumeData.english
                          .replace(/^# (.*$)/gm, "<h1>$1</h1>")
                          .replace(/^## (.*$)/gm, "<h2>$1</h2>")
                          .replace(/^### (.*$)/gm, "<h3>$1</h3>")
                          .replace(/\n- /g, "<br/>• ")
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex h-[600px] items-center justify-center">
                    <p>Unable to load resume content</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
          <h3 className="mb-2 font-medium">完成！</h3>
          <p className="text-sm text-muted-foreground">
            恭喜您完成了履歷優化流程！您現在擁有了一份針對目標職位客製化的專業履歷。
            您可以下載中英文版本，或分享連結給他人查看。如果您想要進一步優化，可以重新開始流程或編輯現有內容。
          </p>
          <div className="mt-4 flex justify-center">
            <Link href="/">
              <Button variant="outline">返回首頁</Button>
            </Link>
          </div>
        </div>
      </div>
    </StepLayout>
  )
}

