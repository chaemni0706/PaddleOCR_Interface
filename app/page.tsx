"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
import { FileText, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">PDF OCR 서비스</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">PDF 문서를 텍스트로 변환하세요</h2>
            <p className="text-xl text-gray-600 mb-8">PaddleOCR과 PP-Structure 기술로 정확하고 빠른 OCR 처리</p>
          </div>

          {/* Upload Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                PDF 파일 업로드
              </CardTitle>
              <CardDescription>PDF 파일을 선택하여 OCR 처리를 시작하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload />
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  빠른 처리
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">최적화된 PaddleOCR 엔진으로 빠르고 정확한 텍스트 추출</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  구조 분석
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">PP-Structure로 문서의 레이아웃과 구조를 정확히 분석</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  간편한 사용
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">드래그 앤 드롭으로 간단하게 파일을 업로드하고 결과 확인</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
