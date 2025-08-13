"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { OCRResultViewer } from "@/components/ocr-result-viewer"

// 시뮬레이션된 OCR 결과 데이터
const mockOCRResult = {
  pages: [
    {
      pageNumber: 1,
      text: `PDF OCR 테스트 문서

이것은 PDF OCR 기능을 테스트하기 위한 샘플 문서입니다.

주요 기능:
• 텍스트 추출
• 레이아웃 분석
• 표 인식
• 이미지 영역 감지

연락처 정보:
이름: 홍길동
전화: 010-1234-5678
이메일: hong@example.com

표 예시:
항목        수량    가격
사과        10개    5,000원
바나나      5개     3,000원
오렌지      8개     4,000원
합계        23개    12,000원

이 문서는 OCR 정확도를 테스트하기 위해 다양한 형태의 텍스트와 레이아웃을 포함하고 있습니다.`,
      confidence: 0.95,
      layout: {
        blocks: [
          { type: "title", bbox: [50, 50, 500, 100], text: "PDF OCR 테스트 문서" },
          {
            type: "paragraph",
            bbox: [50, 120, 500, 180],
            text: "이것은 PDF OCR 기능을 테스트하기 위한 샘플 문서입니다.",
          },
          {
            type: "list",
            bbox: [50, 200, 500, 320],
            text: "주요 기능:\n• 텍스트 추출\n• 레이아웃 분석\n• 표 인식\n• 이미지 영역 감지",
          },
          {
            type: "table",
            bbox: [50, 400, 500, 520],
            text: "표 예시:\n항목        수량    가격\n사과        10개    5,000원\n바나나      5개     3,000원\n오렌지      8개     4,000원\n합계        23개    12,000원",
          },
        ],
      },
    },
  ],
  processingTime: 3.2,
  totalPages: 1,
  extractedText: "",
  metadata: {
    fileName: "",
    fileSize: 0,
    processedAt: new Date().toISOString(),
  },
}

export default function ResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileName = searchParams.get("file")

  const [ocrResult, setOCRResult] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!fileName) {
      router.push("/")
      return
    }

    // 시뮬레이션된 결과 로딩
    setTimeout(() => {
      const result = {
        ...mockOCRResult,
        extractedText: mockOCRResult.pages[0].text,
        metadata: {
          ...mockOCRResult.metadata,
          fileName: fileName,
          fileSize: Math.floor(Math.random() * 1000000) + 100000, // 100KB ~ 1MB
        },
      }
      setOCRResult(result)
      setIsLoading(false)
    }, 1000)
  }, [fileName, router])

  const handleNewUpload = () => {
    router.push("/")
  }

  const handleDownloadText = () => {
    if (!ocrResult) return

    const blob = new Blob([ocrResult.extractedText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${fileName}_extracted.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadJSON = () => {
    if (!ocrResult) return

    const blob = new Blob([JSON.stringify(ocrResult, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${fileName}_ocr_result.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">결과를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">OCR 결과</h1>
            <button
              onClick={handleNewUpload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              새 파일 업로드
            </button>
          </div>

          {/* 파일 정보 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">파일명:</span>
                <p className="font-medium text-gray-900 dark:text-white">{fileName}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">파일 크기:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {ocrResult ? (ocrResult.metadata.fileSize / 1024).toFixed(1) : 0} KB
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">처리 시간:</span>
                <p className="font-medium text-gray-900 dark:text-white">{ocrResult?.processingTime}초</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">페이지 수:</span>
                <p className="font-medium text-gray-900 dark:text-white">{ocrResult?.totalPages}페이지</p>
              </div>
            </div>
          </div>
        </div>

        {/* 다운로드 버튼 */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={handleDownloadText}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            텍스트 다운로드
          </button>
          <button
            onClick={handleDownloadJSON}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            JSON 다운로드
          </button>
        </div>

        {/* OCR 결과 뷰어 */}
        {ocrResult && <OCRResultViewer result={ocrResult} />}
      </div>
    </div>
  )
}
