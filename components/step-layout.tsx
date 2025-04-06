import type React from "react"
import { StepNavigator } from "@/components/step-navigator"

interface StepLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  currentStep: number
  totalSteps?: number
  nextDisabled?: boolean
  onNext?: () => Promise<boolean> | boolean
}

export function StepLayout({
  children,
  title,
  description,
  currentStep,
  totalSteps = 5,
  nextDisabled,
  onNext,
}: StepLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            {children}

            <StepNavigator
              currentStep={currentStep}
              totalSteps={totalSteps}
              nextDisabled={nextDisabled}
              onNext={onNext}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

