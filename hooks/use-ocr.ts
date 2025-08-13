"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ocrService } from "@/lib/ocr-service"
import type { OCRJob } from "@/types/ocr"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useOCRProcess() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      return await ocrService.processFile(file)
    },
    onSuccess: (job: OCRJob) => {
      toast.success("PDF 처리가 시작되었습니다.")
      // 처리 페이지로 이동
      router.push(`/process?jobId=${job.id}`)
    },
    onError: (error: any) => {
      console.error("OCR 처리 실패:", error)
      toast.error(error.message || "PDF 처리 중 오류가 발생했습니다.")
    },
  })
}

export function useOCRStatus(jobId: string | null, enabled = true) {
  return useQuery({
    queryKey: ["ocr-status", jobId],
    queryFn: () => ocrService.getJobStatus(jobId!),
    enabled: enabled && !!jobId,
    refetchInterval: (data) => {
      // 완료되지 않은 작업은 2초마다 폴링
      if (data?.status === "processing" || data?.status === "pending") {
        return 2000
      }
      return false
    },
    retry: (failureCount, error: any) => {
      // 404 에러는 재시도하지 않음 (작업이 존재하지 않음)
      if (error?.status === 404) {
        return false
      }
      return failureCount < 3
    },
  })
}

export function useOCRResult(jobId: string | null, enabled = true) {
  return useQuery({
    queryKey: ["ocr-result", jobId],
    queryFn: () => ocrService.getResult(jobId!),
    enabled: enabled && !!jobId,
    retry: (failureCount, error: any) => {
      if (error?.status === 404) {
        return false
      }
      return failureCount < 3
    },
  })
}

export function useOCRHistory() {
  return useQuery({
    queryKey: ["ocr-history"],
    queryFn: () => ocrService.getHistory(),
    staleTime: 1000 * 60 * 2, // 2분
  })
}

export function useDeleteOCRJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (jobId: string) => ocrService.deleteJob(jobId),
    onSuccess: () => {
      toast.success("작업이 삭제되었습니다.")
      // 히스토리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["ocr-history"] })
    },
    onError: (error: any) => {
      console.error("작업 삭제 실패:", error)
      toast.error(error.message || "작업 삭제 중 오류가 발생했습니다.")
    },
  })
}
