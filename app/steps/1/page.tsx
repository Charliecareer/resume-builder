"use client"

import { useState } from "react"
import { StepLayout } from "@/components/step-layout"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Building2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { JobAssistant } from "@/components/job-assistant"

// 模擬產業和職位數據
const industries = [
  "科技/IT",
  "金融/銀行",
  "醫療/健康",
  "教育/學術",
  "製造/工程",
  "零售/電商",
  "媒體/娛樂",
  "行銷/廣告",
  "物流/運輸",
  "顧問/諮詢",
]

// 更新 positions 對象，添加更多非技術職位選項

const positions = {
  "科技/IT": [
    "軟體工程師",
    "前端開發者",
    "後端開發者",
    "全端工程師",
    "產品經理",
    "UI/UX設計師",
    "數據分析師",
    "資安專家",
    "DevOps工程師",
    "QA工程師",
  ],
  "金融/銀行": [
    "財務分析師",
    "投資銀行家",
    "風險管理師",
    "信用分析師",
    "財務顧問",
    "審計師",
    "保險精算師",
    "合規專員",
    "金融科技專家",
    "財富管理顧問",
  ],
  "醫療/健康": [
    "醫生",
    "護士",
    "藥劑師",
    "醫療技術員",
    "醫療管理人員",
    "臨床研究員",
    "健康教育專家",
    "醫療設備銷售",
    "醫療資訊專家",
    "物理治療師",
  ],
  "教育/學術": [
    "教師",
    "教授",
    "教育行政人員",
    "課程設計師",
    "教育顧問",
    "學術研究員",
    "圖書館員",
    "學生輔導員",
    "教育科技專家",
    "特殊教育教師",
  ],
  "製造/工程": [
    "機械工程師",
    "電子工程師",
    "化學工程師",
    "工業工程師",
    "品質控制專員",
    "生產主管",
    "供應鏈經理",
    "研發工程師",
    "製程工程師",
    "自動化工程師",
  ],
  "零售/電商": [
    "零售經理",
    "電商運營專員",
    "商品規劃師",
    "客戶服務代表",
    "銷售顧問",
    "視覺陳列設計師",
    "採購專員",
    "庫存管理員",
    "市場分析師",
    "品牌經理",
  ],
  "媒體/娛樂": [
    "內容創作者",
    "編輯",
    "記者",
    "社群媒體經理",
    "公關專員",
    "影片製作人",
    "攝影師",
    "藝術總監",
    "音效設計師",
    "活動策劃師",
  ],
  "行銷/廣告": [
    "行銷經理",
    "數位行銷專員",
    "廣告文案",
    "SEO專家",
    "品牌策略師",
    "市場研究分析師",
    "行銷活動策劃",
    "CRM專員",
    "廣告投放專員",
    "行銷數據分析師",
  ],
  "物流/運輸": [
    "物流經理",
    "供應鏈專員",
    "倉儲管理員",
    "運輸協調員",
    "進出口專員",
    "配送規劃師",
    "貨運代理人",
    "庫存控制專員",
    "採購專員",
    "海關申報專員",
  ],
  "顧問/諮詢": [
    "管理顧問",
    "策略顧問",
    "人力資源顧問",
    "IT顧問",
    "財務顧問",
    "營運顧問",
    "變革管理顧問",
    "專案管理顧問",
    "風險顧問",
    "永續發展顧問",
  ],
  "業務/銷售": [
    "業務代表",
    "銷售經理",
    "客戶經理",
    "業務開發專員",
    "電話銷售專員",
    "區域銷售經理",
    "銷售總監",
    "客戶成功經理",
    "解決方案顧問",
    "銷售工程師",
  ],
  人力資源: [
    "人資專員",
    "招聘專員",
    "培訓專員",
    "薪資福利專員",
    "人才發展經理",
    "員工關係專員",
    "人資總監",
    "組織發展顧問",
    "績效管理專員",
    "勞資關係專員",
  ],
  客戶服務: [
    "客服專員",
    "客戶體驗經理",
    "技術支援專員",
    "客戶關係經理",
    "客訴處理專員",
    "服務品質分析師",
    "客服主管",
    "客戶成功專員",
    "會員服務專員",
    "售後服務專員",
  ],
  公共關係: [
    "公關經理",
    "媒體關係專員",
    "企業傳播專員",
    "危機管理專員",
    "社區關係經理",
    "政府關係專員",
    "公關活動策劃",
    "品牌發言人",
    "內部溝通專員",
    "贊助管理專員",
  ],
}

// 更新 jobListings 對象，添加更多職位的職缺數據

const jobListings = {
  軟體工程師: [
    { title: "資深軟體工程師", company: "台灣科技公司", location: "台北市", salary: "年薪 120-150 萬" },
    { title: "後端軟體工程師", company: "國際科技集團", location: "新竹市", salary: "年薪 100-130 萬" },
    { title: "Java 軟體工程師", company: "金融科技新創", location: "台北市", salary: "年薪 90-120 萬" },
  ],
  前端開發者: [
    { title: "資深前端工程師", company: "電商平台", location: "台北市", salary: "年薪 100-130 萬" },
    { title: "React 前端開發者", company: "數位行銷公司", location: "台中市", salary: "年薪 80-110 萬" },
    { title: "UI/UX 前端工程師", company: "遊戲開發商", location: "台北市", salary: "年薪 90-120 萬" },
  ],
  行銷經理: [
    { title: "數位行銷經理", company: "國際品牌公司", location: "台北市", salary: "年薪 90-120 萬" },
    { title: "品牌行銷經理", company: "電商集團", location: "台北市", salary: "年薪 85-110 萬" },
    { title: "行銷企劃經理", company: "零售連鎖", location: "台中市", salary: "年薪 80-100 萬" },
  ],
  業務代表: [
    { title: "企業業務代表", company: "科技解決方案公司", location: "台北市", salary: "底薪+獎金 70-120 萬" },
    { title: "業務開發專員", company: "國際貿易公司", location: "高雄市", salary: "底薪+獎金 60-100 萬" },
    { title: "客戶經理", company: "金融服務公司", location: "台北市", salary: "底薪+獎金 80-150 萬" },
  ],
  人資專員: [
    { title: "資深人力資源專員", company: "跨國企業", location: "台北市", salary: "年薪 70-90 萬" },
    { title: "招聘專員", company: "人力資源顧問公司", location: "台北市", salary: "年薪 60-80 萬" },
    { title: "人才發展專員", company: "科技公司", location: "新竹市", salary: "年薪 65-85 萬" },
  ],
}

// 模擬相關公司數據
const relatedCompanies = {
  "科技/IT": [
    {
      name: "台灣科技公司",
      description: "專注於雲端服務和人工智能解決方案",
      logo: "/placeholder.svg?height=40&width=40",
    },
    { name: "國際科技集團", description: "全球領先的硬體和軟體開發商", logo: "/placeholder.svg?height=40&width=40" },
    { name: "金融科技新創", description: "創新的金融科技解決方案提供商", logo: "/placeholder.svg?height=40&width=40" },
  ],
  "行銷/廣告": [
    { name: "數位行銷公司", description: "專注於社群媒體和內容行銷", logo: "/placeholder.svg?height=40&width=40" },
    { name: "國際品牌公司", description: "全球知名品牌的行銷和廣告服務", logo: "/placeholder.svg?height=40&width=40" },
    { name: "創意廣告代理", description: "屢獲獎項的創意廣告和品牌策略", logo: "/placeholder.svg?height=40&width=40" },
  ],
  "業務/銷售": [
    { name: "科技解決方案公司", description: "企業級軟體和服務提供商", logo: "/placeholder.svg?height=40&width=40" },
    { name: "國際貿易公司", description: "專注於跨國貿易和市場拓展", logo: "/placeholder.svg?height=40&width=40" },
    { name: "金融服務公司", description: "提供全方位金融產品和服務", logo: "/placeholder.svg?height=40&width=40" },
  ],
}

export default function Step1Page() {
  const [industry, setIndustry] = useState<string>("")
  const [position, setPosition] = useState<string>("")
  const [customPosition, setCustomPosition] = useState<string>("")
  const [showCustom, setShowCustom] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleIndustryChange = (value: string) => {
    setIndustry(value)
    setPosition("")
    setShowCustom(false)
  }

  const handlePositionChange = (value: string) => {
    if (value === "custom") {
      setShowCustom(true)
      setPosition("")
    } else {
      setShowCustom(false)
      setPosition(value)
    }
  }

  const handleNext = () => {
    const selectedPosition = showCustom ? customPosition : position

    if (!industry || (!position && !customPosition)) {
      toast({
        title: "請完成所有欄位",
        description: "請選擇產業和職位以繼續",
        variant: "destructive",
      })
      return false
    }

    // 儲存選擇到 localStorage
    localStorage.setItem("resumeBuilder_industry", industry)
    localStorage.setItem("resumeBuilder_position", selectedPosition)

    return true
  }

  const availablePositions = industry ? positions[industry as keyof typeof positions] || [] : []
  const jobListingsForPosition = position ? jobListings[position as keyof typeof jobListings] || [] : []
  const relatedCompaniesForIndustry = industry ? relatedCompanies[industry as keyof typeof relatedCompanies] || [] : []

  return (
    <StepLayout
      title="選擇目標產業與職位"
      description="請選擇您希望應徵的產業和職位，我們將為您提供相關職缺參考"
      currentStep={1}
      onNext={handleNext}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-semibold">目標產業</h2>
          </div>

          <div>
            <Label htmlFor="industry">選擇產業</Label>
            <Select value={industry} onValueChange={handleIndustryChange}>
              <SelectTrigger id="industry" className="mt-1.5">
                <SelectValue placeholder="選擇您的目標產業" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {industry && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-emerald-600" />
              <h2 className="text-xl font-semibold">目標職位</h2>
            </div>

            <div>
              <Label htmlFor="position">選擇職位</Label>
              <Select value={position} onValueChange={handlePositionChange}>
                <SelectTrigger id="position" className="mt-1.5">
                  <SelectValue placeholder="選擇您的目標職位" />
                </SelectTrigger>
                <SelectContent>
                  {availablePositions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">其他 (自訂)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showCustom && (
              <div>
                <Label htmlFor="customPosition">自訂職位</Label>
                <Input
                  id="customPosition"
                  value={customPosition}
                  onChange={(e) => setCustomPosition(e.target.value)}
                  placeholder="請輸入您的目標職位"
                  className="mt-1.5"
                />
              </div>
            )}
          </div>
        )}

        {position && jobListingsForPosition.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">相關職缺推薦</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobListingsForPosition.map((job, index) => (
                <Card key={index} className="hover:border-emerald-300 hover:shadow-md dark:hover:border-emerald-800">
                  <CardContent className="p-4">
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    <div className="mt-2 flex justify-between text-xs">
                      <span>{job.location}</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-500">{job.salary}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">* 這些職缺僅供參考，實際職缺可能有所不同</p>
          </div>
        )}

        {industry && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">相關公司推薦</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCompanies[industry as keyof typeof relatedCompanies]?.map((company, index) => (
                <Card key={index} className="hover:border-emerald-300 hover:shadow-md dark:hover:border-emerald-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={company.logo || "/placeholder.svg"}
                        alt={company.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-medium">{company.name}</h3>
                        <p className="text-xs text-muted-foreground">{company.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || <p className="col-span-full text-center text-sm text-muted-foreground">暫無相關公司推薦</p>}
            </div>
            <p className="text-center text-sm text-muted-foreground">* 這些公司僅供參考，實際招聘情況可能有所不同</p>
          </div>
        )}
        <JobAssistant industry={industry} position={position} />
      </div>
    </StepLayout>
  )
}

