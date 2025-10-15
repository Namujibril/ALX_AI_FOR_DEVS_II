'use client'

import { cn } from "@/lib/utils"

export type PollOptionResult = {
  id?: string | number
  label: string
  votes: number
  color?: string
}

export type PollResultChartProps = {
  options: PollOptionResult[]
  totalVotes?: number
  showCounts?: boolean
  showPercentages?: boolean
  className?: string
  highlightOptionId?: string | number
  sortBy?: 'original' | 'votes' | 'percentage'
  maxBars?: number
  emptyStateText?: string
}

export default function PollResultChart({
  options,
  totalVotes,
  showCounts = true,
  showPercentages = true,
  className,
  highlightOptionId,
  sortBy = 'votes',
  maxBars,
  emptyStateText = 'No votes yet',
}: PollResultChartProps) {
  const computedTotal = typeof totalVotes === 'number'
    ? totalVotes
    : options.reduce((acc, item) => acc + (item.votes || 0), 0)

  const withPercentages = options.map((opt) => {
    const percentage = computedTotal > 0 ? (opt.votes / computedTotal) * 100 : 0
    return { ...opt, percentage }
  })

  const sorted = [...withPercentages].sort((a, b) => {
    if (sortBy === 'original') return 0
    if (sortBy === 'percentage') return b.percentage - a.percentage
    return b.votes - a.votes
  })

  const visible = typeof maxBars === 'number' ? sorted.slice(0, maxBars) : sorted

  if (!options.length) {
    return (
      <div className={cn("text-sm text-gray-500", className)}>
        {emptyStateText}
      </div>
    )
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex justify-between items-baseline">
        <div className="text-sm text-gray-500">
          {computedTotal} total votes
        </div>
      </div>

      <div className="space-y-4">
        {visible.map((option) => {
          const isHighlighted =
            highlightOptionId !== undefined && option.id === highlightOptionId
          const barWidth = `${option.percentage.toFixed(3)}%`
          const colorClass = option.color ? '' : 'bg-blue-600'
          const barStyle = option.color ? { width: barWidth, backgroundColor: option.color } : { width: barWidth }

          return (
            <div key={(option.id ?? option.label).toString()} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={cn("truncate", isHighlighted && "font-semibold")}>{option.label}</span>
                <span className={cn("flex items-center gap-2 text-gray-700", isHighlighted && "font-semibold")}
                >
                  {showCounts && <span>{option.votes} votes</span>}
                  {showCounts && showPercentages && <span className="text-gray-300">•</span>}
                  {showPercentages && <span>{option.percentage.toFixed(1)}%</span>}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={cn(colorClass, "h-2 rounded-full transition-all duration-300")}
                  style={barStyle}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


