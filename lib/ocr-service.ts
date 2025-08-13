import { apiClient } from "./api-client"
import type { JobStatus, OCRResult } from "@/types/ocr"

export class OCRService {
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map()

  async processFile(file: File): Promise<string | null> {
    // 파일 유효성 검사
    if (!this.validateFile(file)) {
      throw new Error("유효하지 않은 파일입니다. PDF 파일만 업로드 가능합니다.")
    }

    // 파일 업로드
    const uploadResponse = await apiClient.uploadPDF(file)

    if (!uploadResponse.success || !uploadResponse.data) {
      throw new Error(uploadResponse.error?.message || "파일 업로드에 실패했습니다.")
    }

    return uploadResponse.data.jobId
  }

  async pollJobStatus(
    jobId: string,
    onProgress: (status: JobStatus) => void,
    onComplete: (result: OCRResult) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    const poll = async () => {
      try {
        const statusResponse = await apiClient.getJobStatus(jobId)

        if (!statusResponse.success || !statusResponse.data) {
          onError(statusResponse.error?.message || "상태 확인에 실패했습니다.")
          this.stopPolling(jobId)
          return
        }

        const status = statusResponse.data
        onProgress(status)

        if (status.status === "completed") {
          this.stopPolling(jobId)
          const resultResponse = await apiClient.getJobResult(jobId)

          if (resultResponse.success && resultResponse.data) {
            onComplete(resultResponse.data)
          } else {
            onError(resultResponse.error?.message || "결과 조회에 실패했습니다.")
          }
        } else if (status.status === "failed") {
          this.stopPolling(jobId)
          onError(status.error || "처리 중 오류가 발생했습니다.")
        }
      } catch (error) {
        onError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.")
        this.stopPolling(jobId)
      }
    }

    // 즉시 한 번 실행
    await poll()

    // 2초마다 폴링
    const interval = setInterval(poll, 2000)
    this.pollingIntervals.set(jobId, interval)
  }

  stopPolling(jobId: string): void {
    const interval = this.pollingIntervals.get(jobId)
    if (interval) {
      clearInterval(interval)
      this.pollingIntervals.delete(jobId)
    }
  }

  async cancelJob(jobId: string): Promise<boolean> {
    this.stopPolling(jobId)

    const response = await apiClient.cancelJob(jobId)
    return response.success && response.data?.cancelled === true
  }

  private validateFile(file: File): boolean {
    // PDF 파일 검사
    if (file.type !== "application/pdf") {
      return false
    }

    // 파일 크기 검사 (50MB 제한)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return false
    }

    return true
  }

  cleanup(): void {
    // 모든 폴링 정리
    this.pollingIntervals.forEach((interval) => {
      clearInterval(interval)
    })
    this.pollingIntervals.clear()
  }
}

export const ocrService = new OCRService()
