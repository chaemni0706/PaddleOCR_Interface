"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProgressBar } from "@/components/progress-bar"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function ProcessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileName = searchParams.get("file")

  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("파일 업로드 중...")
  const [isComplete, setIsComplete] = useState(false)

  const steps = ["파일 업로드 중...", "PDF 분석 중...", "텍스트 추출 중...", "레이아웃 분석 중...", "결과 생성 중..."]

  useEffect(() => {
    if (!fileName) {
      router.push("/")
      return
    }

    // 시뮬레이션된 OCR 처리 과정
    const processOCR = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i])

        // 각 단계별 진행률 업데이트
        const stepProgress = ((i + 1) / steps.length) * 100

        // 점진적 진행률 증가 애니메이션
        for (let j = Math.floor(progress); j <= stepProgress; j += 2) {
          setProgress(j)
          await new Promise((resolve) => setTimeout(resolve, 50))
        }

        // 각 단계 완료 대기
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }

      setProgress(100)
      setCurrentStep("완료!")
      setIsComplete(true)

      // 2초 후 결과 페이지로 이동
      setTimeout(() => {
        router.push(`/result?file=${encodeURIComponent(fileName)}`)
      }, 2000)
    }

    processOCR()
  }, [fileName, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">PDF 처리 중</h1>
              <p className="text-gray-600 dark:text-gray-300">{fileName}을(를) 분석하고 있습니다</p>
            </div>

            <div className="space-y-6">
              {/* 진행률 표시 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>{currentStep}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <ProgressBar progress={progress} />
              </div>

              {/* 로딩 스피너 */}
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>

              {/* 단계별 체크리스트 */}
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const stepProgress = ((index + 1) / steps.length) * 100
                  const isCompleted = progress >= stepProgress
                  const isCurrent = currentStep === step

                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isCompleted
                          ? "bg-green-50 dark:bg-green-900/20"
                          : isCurrent
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : "bg-gray-50 dark:bg-gray-700"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrent
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isCompleted
                            ? "text-green-700 dark:text-green-300"
                            : isCurrent
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  )
                })}
              </div>

              {isComplete && (
                <div className="text-center py-4">
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    처리가 완료되었습니다! 결과 페이지로 이동합니다...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
