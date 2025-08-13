"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { toast } from "sonner"

interface UseFileUploadOptions {
  maxSize?: number // bytes
  acceptedTypes?: string[]
  onFileSelect?: (file: File) => void
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB
    acceptedTypes = ["application/pdf"],
    onFileSelect,
  } = options

  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const validateFile = useCallback(
    (file: File): boolean => {
      // 파일 타입 검증
      if (!acceptedTypes.includes(file.type)) {
        toast.error("PDF 파일만 업로드 가능합니다.")
        return false
      }

      // 파일 크기 검증
      if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024))
        toast.error(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`)
        return false
      }

      // 파일명 검증 (한글, 영문, 숫자, 일부 특수문자만 허용)
      const validNamePattern = /^[가-힣a-zA-Z0-9\s\-_().]+\.pdf$/i
      if (!validNamePattern.test(file.name)) {
        toast.error("파일명에 특수문자가 포함되어 있습니다. 한글, 영문, 숫자만 사용해주세요.")
        return false
      }

      return true
    },
    [acceptedTypes, maxSize],
  )

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!validateFile(file)) {
        return
      }

      setSelectedFile(file)
      onFileSelect?.(file)
      toast.success(`${file.name} 파일이 선택되었습니다.`)
    },
    [validateFile, onFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length === 0) {
        return
      }

      if (files.length > 1) {
        toast.error("한 번에 하나의 파일만 업로드할 수 있습니다.")
        return
      }

      handleFileSelect(files[0])
    },
    [handleFileSelect],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) {
        return
      }

      handleFileSelect(files[0])
    },
    [handleFileSelect],
  )

  const clearFile = useCallback(() => {
    setSelectedFile(null)
    setUploadProgress(0)
    setIsUploading(false)
  }, [])

  const simulateUpload = useCallback(async (): Promise<void> => {
    if (!selectedFile) {
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // 업로드 진행률 시뮬레이션
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 200)

    try {
      // 실제 업로드 로직은 여기에 구현
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setUploadProgress(100)
      setTimeout(() => {
        setIsUploading(false)
      }, 500)
    } catch (error) {
      clearInterval(interval)
      setIsUploading(false)
      setUploadProgress(0)
      throw error
    }
  }, [selectedFile])

  return {
    // 상태
    isDragOver,
    selectedFile,
    uploadProgress,
    isUploading,

    // 핸들러
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
    clearFile,
    simulateUpload,

    // 유틸리티
    validateFile,
  }
}
