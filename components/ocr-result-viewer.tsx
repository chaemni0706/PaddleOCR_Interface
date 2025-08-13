"use client"

import { useState } from "react"

interface OCRBlock {
  type: "title" | "paragraph" | "list" | "table" | "image"
  bbox: [number, number, number, number]
  text: string
}

interface OCRPage {
  pageNumber: number
  text: string
  confidence: number
  layout: {
    blocks: OCRBlock[]
  }
}

interface OCRResult {
  pages: OCRPage[]
  processingTime: number
  totalPages: number
  extractedText: string
  metadata: {
    fileName: string
    fileSize: number
    processedAt: string
  }
}

interface OCRResultViewerProps {
  result: OCRResult
}

export function OCRResultViewer({ result }: OCRResultViewerProps) {
  const [activeTab, setActiveTab] = useState<"text" | "layout" | "raw">("text")
  const [selectedPage, setSelectedPage] = useState(0)

  const currentPage = result.pages[selectedPage]

  const getBlockTypeColor = (type: string) => {
    switch (type) {
      case "title":
        return "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
      case "paragraph":
        return "bg-gray-100 dark:bg-gray-700/30 border-gray-300 dark:border-gray-600"
      case "list":
        return "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700"
      case "table":
        return "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700"
      case "image":
        return "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700"
      default:
        return "bg-gray-100 dark:bg-gray-700/30 border-gray-300 dark:border-gray-600"
    }
  }

  const getBlockTypeLabel = (type: string) => {
    switch (type) {
      case "title":
        return "제목"
      case "paragraph":
        return "문단"
      case "list":
        return "목록"
      case "table":
        return "표"
      case "image":
        return "이미지"
      default:
        return "기타"
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      {/* 탭 헤더 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          {[
            { key: "text", label: "추출된 텍스트" },
            { key: "layout", label: "레이아웃 분석" },
            { key: "raw", label: "원본 데이터" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 페이지 선택 (다중 페이지인 경우) */}
      {result.totalPages > 1 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">페이지:</span>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {result.pages.map((_, index) => (
                <option key={index} value={index}>
                  {index + 1}페이지
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              (신뢰도: {Math.round(currentPage.confidence * 100)}%)
            </span>
          </div>
        </div>
      )}

      {/* 탭 컨텐츠 */}
      <div className="p-6">
        {activeTab === "text" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">추출된 텍스트</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">{currentPage.text.length}자</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                {currentPage.text}
              </pre>
            </div>
          </div>
        )}

        {activeTab === "layout" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">레이아웃 분석</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentPage.layout.blocks.length}개 블록
              </span>
            </div>

            {/* 블록 타입 범례 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {["title", "paragraph", "list", "table", "image"].map((type) => (
                <div key={type} className={`px-2 py-1 rounded text-xs ${getBlockTypeColor(type)}`}>
                  {getBlockTypeLabel(type)}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {currentPage.layout.blocks.map((block, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${getBlockTypeColor(block.type)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {getBlockTypeLabel(block.type)} #{index + 1}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      위치: ({block.bbox[0]}, {block.bbox[1]}) - ({block.bbox[2]}, {block.bbox[3]})
                    </span>
                  </div>
                  <div className="text-sm text-gray-800 dark:text-gray-200">
                    <pre className="whitespace-pre-wrap font-mono">{block.text}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "raw" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">원본 JSON 데이터</h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-xs text-gray-800 dark:text-gray-200 font-mono">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
