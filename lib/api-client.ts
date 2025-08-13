import type { APIResponse, UploadResponse, JobStatus, OCRResult } from "@/types/ocr"

class APIClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API request failed:", error)
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "네트워크 오류가 발생했습니다.",
        },
      }
    }
  }

  async uploadPDF(file: File): Promise<APIResponse<UploadResponse>> {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(`${this.baseURL}/api/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Upload failed:", error)
      return {
        success: false,
        error: {
          code: "UPLOAD_ERROR",
          message: error instanceof Error ? error.message : "파일 업로드에 실패했습니다.",
        },
      }
    }
  }

  async getJobStatus(jobId: string): Promise<APIResponse<JobStatus>> {
    return this.request<JobStatus>(`/api/job/${jobId}/status`)
  }

  async getJobResult(jobId: string): Promise<APIResponse<OCRResult>> {
    return this.request<OCRResult>(`/api/job/${jobId}/result`)
  }

  async cancelJob(jobId: string): Promise<APIResponse<{ cancelled: boolean }>> {
    return this.request<{ cancelled: boolean }>(`/api/job/${jobId}/cancel`, {
      method: "POST",
    })
  }

  async healthCheck(): Promise<APIResponse<{ status: string; version: string }>> {
    return this.request<{ status: string; version: string }>("/api/health")
  }
}

export const apiClient = new APIClient()
