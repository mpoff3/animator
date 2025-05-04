"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import VideoPlayer from "@/components/video-player"
import { Card } from "@/components/ui/card"

type VideoResponse = {
  id: string
  question: string
  videoUrl: string
  timestamp: Date
}

export default function VideoQAInterface() {
  const [question, setQuestion] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<VideoResponse | null>(null)
  const [history, setHistory] = useState<VideoResponse[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim() || isGenerating) return

    // Start generating
    setIsGenerating(true)

    // Simulate video generation delay
    setTimeout(() => {
      const newVideo: VideoResponse = {
        id: Date.now().toString(),
        question,
        // Using a sample video for demonstration
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        timestamp: new Date(),
      }

      setCurrentVideo(newVideo)
      setHistory((prev) => [newVideo, ...prev])
      setIsGenerating(false)
      setQuestion("")
    }, 3000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="overflow-hidden bg-white dark:bg-slate-900 shadow-md">
          <div className="p-4 border-b dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              {currentVideo ? "Video Response" : "Ask a question to generate a video"}
            </h2>
          </div>

          <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative">
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Generating your video...</p>
              </div>
            ) : currentVideo ? (
              <VideoPlayer videoUrl={currentVideo.videoUrl} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-slate-500 dark:text-slate-400 text-center px-4">
                  Your video response will appear here
                </p>
              </div>
            )}
          </div>

          {currentVideo && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-medium text-slate-900 dark:text-slate-200 mb-1">Question:</h3>
              <p className="text-slate-700 dark:text-slate-300">{currentVideo.question}</p>
            </div>
          )}

          <div className="p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask any question..."
                className="flex-1"
                disabled={isGenerating}
              />
              <Button
                type="submit"
                disabled={isGenerating || !question.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                {isGenerating ? "Generating..." : "Send"}
              </Button>
            </form>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="bg-white dark:bg-slate-900 shadow-md">
          <div className="p-4 border-b dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Previous Questions</h2>
          </div>

          <div className="p-2 max-h-[500px] overflow-y-auto">
            {history.length > 0 ? (
              <ul className="divide-y dark:divide-slate-700">
                {history.map((item) => (
                  <li
                    key={item.id}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer rounded-md"
                    onClick={() => setCurrentVideo(item)}
                  >
                    <p className="text-slate-800 dark:text-slate-200 line-clamp-2 mb-1">{item.question}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.timestamp.toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400">No previous questions</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
