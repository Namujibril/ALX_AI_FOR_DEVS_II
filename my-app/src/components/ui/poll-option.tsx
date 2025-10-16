/** Renders a selectable poll option or a results bar when `showResults` is set. */
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PollOptionProps {
  text: string
  votes?: number
  percentage?: number
  isSelected?: boolean
  showResults?: boolean
  onClick?: () => void
}

export default function PollOption({ 
  text, 
  votes, 
  percentage, 
  isSelected, 
  showResults = false,
  onClick 
}: PollOptionProps) {
  if (showResults && percentage !== undefined) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{text}</span>
          <span className="font-medium">
            {votes} votes ({percentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      className={cn(
        "w-full justify-start h-auto p-4 transition-all",
        isSelected && "bg-blue-50 border-blue-300"
      )}
      onClick={onClick}
    >
      <span className="text-left">{text}</span>
    </Button>
  )
}

