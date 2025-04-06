"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface StepNavigatorProps {
  currentStep: number
  totalSteps: number
  nextDisabled?: boolean
  onNext?: () => Promise<boolean> | boolean
}

export function StepNavigator({ currentStep, totalSteps, nextDisabled = false, onNext }: StepNavigatorProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleNext = async () => {
    if (onNext) {
      const canProceed = await onNext()
      if (!canProceed) return
    }

    if (currentStep < totalSteps) {
      router.push(`/steps/${currentStep + 1}`)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      router.push(`/steps/${currentStep - 1}`)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="flex justify-between pt-8">
      <Button variant="outline" onClick={handlePrevious} className="flex items-center gap-1">
        <ChevronLeft className="h-4 w-4" />
        {currentStep === 1 ? "返回首頁" : "上一步"}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        步驟 {currentStep} / {totalSteps}
      </div>

      <Button
        onClick={handleNext}
        disabled={nextDisabled}
        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
      >
        {currentStep === totalSteps ? "完成" : "下一步"}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

