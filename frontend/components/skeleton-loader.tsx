import { Card } from "@/components/ui/card"

interface SkeletonLoaderProps {
  type: "text" | "video"
}

export default function SkeletonLoader({ type }: SkeletonLoaderProps) {
  return (
    <Card className="overflow-hidden shadow-md bg-white dark:bg-slate-900">
      <div className="p-6">
        <div className="h-6 w-32 bg-gray-200 dark:bg-slate-800 rounded-md mb-4 animate-pulse"></div>

        {type === "text" ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-md w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-md w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-md w-4/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-md w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-md w-3/4 animate-pulse"></div>
          </div>
        ) : (
          <div className="aspect-video bg-gray-200 dark:bg-slate-800 rounded-md animate-pulse"></div>
        )}
      </div>
    </Card>
  )
}
