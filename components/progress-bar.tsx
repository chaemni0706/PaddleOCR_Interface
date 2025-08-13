interface ProgressBarProps {
  progress: number // 0-100
  className?: string
  showPercentage?: boolean
  label?: string
}

export function ProgressBar({ progress, className = "", showPercentage = true, label }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
}
