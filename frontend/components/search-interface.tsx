"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import VideoPlayer from "@/components/video-player"
import { motion, AnimatePresence } from "framer-motion"
import SkeletonLoader from "@/components/skeleton-loader"

export default function SearchInterface() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [searchResult, setSearchResult] = useState<{
    explanation: string
    videoUrl: string | null
  } | null>(null)

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory")
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Failed to parse search history", e)
      }
    }
  }, [])

  // Save search history to localStorage when it changes
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
    }
  }, [searchHistory])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim() || isSearching) return

    setIsSearching(true)
    setSearchResult(null)

    // Add to history (keep only last 5)
    setSearchHistory((prev) => {
      const newHistory = [query, ...prev.filter((item) => item !== query)]
      return newHistory.slice(0, 5)
    })

    // Simulate search delay
    setTimeout(() => {
      // In a real implementation, you would fetch data from your API
      setSearchResult({
        explanation: `Here's an explanation about "${query}". This would be the detailed text response from your AI system that explains the concept or answers the question in detail. The text would be comprehensive and informative, providing the user with a thorough understanding of the topic they searched for.`,
        // This would be the URL to your MP4 from docker/cloud storage
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      })

      setIsSearching(false)
    }, 1500)
  }

  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem)
    // Submit the form with the history item
    const formEvent = { preventDefault: () => {} } as React.FormEvent
    handleSearch(formEvent)
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("searchHistory")
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
      {/* Simple black logo with animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white">Mathlens</h1>
      </motion.div>

      {/* Search input with animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-2xl mb-8"
      >
        <form onSubmit={handleSearch} className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
            className="py-6 px-12 rounded-full border border-gray-200 shadow-sm hover:shadow-md focus-visible:shadow-md transition-shadow text-lg dark:border-gray-700"
            disabled={isSearching}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          {query && (
            <Button
              type="submit"
              disabled={isSearching}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black hover:bg-gray-800 text-white"
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          )}
        </form>
      </motion.div>

      {/* Search history with animation */}
      <AnimatePresence>
        {searchHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mb-8 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 justify-center items-center">
              {searchHistory.map((item, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => handleHistoryClick(item)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
                  disabled={isSearching}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.button>
              ))}
              {searchHistory.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: searchHistory.length * 0.05 }}
                  onClick={clearHistory}
                  className="px-3 py-1 text-sm bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 transition-colors"
                  disabled={isSearching}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear history
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator or results */}
      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          >
            <SkeletonLoader type="text" />
            <SkeletonLoader type="video" />
          </motion.div>
        ) : searchResult ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          >
            {/* Explanation card */}
            <Card className="p-6 shadow-md bg-white dark:bg-slate-900 overflow-hidden">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
                <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Explanation</h2>
                <div className="prose dark:prose-invert">
                  <p className="text-slate-700 dark:text-slate-300">{searchResult.explanation}</p>
                </div>
              </motion.div>
            </Card>

            {/* Video card */}
            <Card className="overflow-hidden shadow-md bg-white dark:bg-slate-900">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.3 }}>
                <h2 className="text-xl font-semibold p-6 pb-3 text-slate-800 dark:text-slate-200">
                  Video Visualization
                </h2>
                <div className="aspect-video">
                  {searchResult.videoUrl ? (
                    <VideoPlayer videoUrl={searchResult.videoUrl} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <p className="text-slate-500 dark:text-slate-400">No video available</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
