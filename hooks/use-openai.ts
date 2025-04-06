"use client"

import { useState } from "react"

interface UseOpenAIOptions {
  model?: string
  temperature?: number
  stream?: boolean
}

export function useOpenAI({ model = "gpt-3.5-turbo", temperature = 0.7, stream = false }: UseOpenAIOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateText = async (prompt: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          model,
          temperature,
          stream,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate text")
      }

      const data = await response.json()
      return data.result
    } catch (err: any) {
      setError(err.message || "An error occurred")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateText,
    isLoading,
    error,
  }
}

