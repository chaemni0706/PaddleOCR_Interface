"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { Upload, FileText, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface FileUploadProps {
  onFileSelect?: (file: File) => void
  accept?: string
  maxSize?: number // MB
  disabled?: boolean
}

export function FileUpload({ onFileSelect, accept = ".pdf", maxSize = 10, disabled = false }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string>("")
  const router = useRouter()

  const validateFile = useCallback(
    (file: File) => {
      if (!file.type.includes("pdf")) {
        setError("PDF 파일만 업로드 가능합니다.")
        return false
      }

      if (file.size > maxSize * 1024 * 1024) {
        setError(`파일 크기는 ${maxSize}MB 이하여야 합니다.`)
        return false
      }

      setError("")
      return true
    },
    [maxSize],
  )

  const handleFileSelect = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        setSelectedFile(file)
        if (onFileSelect) {
          onFileSelect(file)
        } else {
          // Default behavior: navigate to process page
          router.push("/process")
        }
      }
    },
    [validateFile, onFileSelect, router],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      if (disabled) return

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFileSelect(files[0])
      }
    },
    [disabled, handleFileSelect],
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) {
        setIsDragOver(true)
      }
    },
    [disabled],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFileSelect(files[0])
      }
    },
    [handleFileSelect],
  )

  const removeFile = useCallback(() => {
    setSelectedFile(null)
    setError("")
  }, [])

  return (
    <div className="w-full max-w-md mx-auto">
      {!selectedFile ? (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
            ${
              isDragOver
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept={accept}
            onChange={handleInputChange}
            disabled={disabled}
            className="hidden"
          />

          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">PDF 파일을 업로드하세요</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">파일을 드래그하거나 클릭하여 선택하세요</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">최대 {maxSize}MB, PDF 형식만 지원</p>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-red-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              disabled={disabled}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
