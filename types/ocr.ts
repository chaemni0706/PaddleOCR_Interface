// OCR 서비스를 위한 타입 정의
export interface UploadResponse {
  success: boolean
  jobId: string
  message: string
}

export interface JobStatus {
  jobId: string
  status: "pending" | "processing" | "completed" | "failed"
  progress: number
  currentStep: string
  estimatedTime?: number
  error?: string
}

export interface OCRResult {
  jobId: string
  status: "completed"
  extractedText: string
  layoutAnalysis: LayoutElement[]
  confidence: number
  processingTime: number
  pageCount: number
  rawData: any
}

export interface LayoutElement {
  type: "text" | "table" | "image" | "header" | "footer"
  content: string
  bbox: [number, number, number, number] // [x1, y1, x2, y2]
  confidence: number
  page: number
}

export interface ProcessingError {
  code: string
  message: string
  details?: any
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: ProcessingError
}
