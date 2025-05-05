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
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function SearchInterface() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)

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
    setExplanation(null)
    setVideoUrl(null)
    setSearchError(null) // Clear previous errors

    // Add to history (keep only last 5)
    setSearchHistory((prev) => {
      const newHistory = [query, ...prev.filter((item) => item !== query)]
      return newHistory.slice(0, 5)
    })

    await Promise.all([queryExplanation(query), queryVideo(query)])
  }
  const queryExplanation = async (query: string) => {
    const res = await fetch(`/api/getExplanation?query=${encodeURIComponent(query)}`)
    if (!res.ok) {
      setSearchError("Failed to fetch explanation.")
      console.error("Failed to fetch explanation:", res.statusText)
      return
    }
    const data = await res.json()
    if (!data.success) {
      setSearchError("Failed to fetch explanation.")
      console.error("Failed to fetch explanation:", data)
      return
    }
    const explanation = data.explanation || "No explanation available."
    setExplanation(explanation);
  }
  const queryVideo = async (query: string) => {
    try {
      // const formData = new FormData()
      // formData.append("question", query)
      // const response = await fetch("https://mathlens-beta-937226988264.us-central1.run.app/generate", {
      //   method: "POST",
      //   body: formData,
      // })
      const manimPrompt = `You're an expert educator and Manim CE developer. Create a **complete and runnable Manim CE script** that visually explains the following math question in a clear, step-by-step animation: **Question:** "{QUESTION}" Goals:   * Define a class called GeneratedScene that inherits from Scene
      Break the explanation into 3–6 short steps
      Use \`Text()\` to explain each step simply (one sentence max)
      Use \`MathTex()\` for all math (e.g., equations, fractions, dot products)
      If applicable, use \`Matrix()\` objects to show visual matrix/vector layout
      Use \`Write\`, \`Create\`, and \`FadeOut\` to animate content
      Add pauses using \`wait(1)\` or \`wait(2)\` after each step
      Visually show the final answer at the end of the scene
      Constraints:
      Don't use \`.dot()\`, \`.T\`, or real math operations
      Don't use numpy, sympy, or external math libraries
      Keep all math symbolic and visually instructive
      + Keep visuals uncluttered: 
      If multiple elements are on screen together, use \`.next_to()\` or \`.shift()\` to space them
      If an element replaces the previous one, center it (e.g., at \`ORIGIN\`, \`DOWN\`, or \`UP\`) so content stays vertically balanced
      Ensure that everything that's being displayed at all time should be centered on the screen vertically and horizontally
      Nothing should be outside of the bounds of the screen
      Manim script shouldn't include unneccesary comments
      Output:
      Respond ONLY with valid Python code
      The script must run with \`manim -pql script.py {SCENE_NAME}\` without errors`;

  const response = await fetch("https://mathlens-beta-937226988264.us-central1.run.app/generate", {
    method: "POST",
    body: {
        question: query,
        prompt: manimPrompt,
    }
});
  
      // const response = { // Placeholder for testing
      //   ok: true,
      //   status: 200,
      //   json: async () => ({
      //     error: false,
      //     video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      //   })
      // }

      if (!response.ok) {
        // Handle HTTP errors (e.g., 404, 500)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Response data:", data) // Log the response data for debugging

      if (data.video_url) {
        setVideoUrl(data.video_url)
      } else if (data.error) {
        // Handle errors reported by the backend API
        setSearchError(`API Error: ${data.error}`)
        console.error("Backend API error:", data.error)
      } else {
        // Handle unexpected response format
        setSearchError("Unexpected response format from API.")
        console.error("Unexpected API response:", data)
      }
    } catch (error) {
      // Handle network errors or other fetch issues
      setSearchError(`Error: ${error instanceof Error ? error.message : String(error)}`)
      console.error("Fetch error:", error)
    } finally {
      setIsSearching(false)
    }
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
              disabled={isSearching || !query.trim()}
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

      {/* Error message display */}
      <AnimatePresence>
        {searchError && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-center"
          >
            {searchError}
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
            {/* Keep skeleton for explanation even if not used yet */}
            <SkeletonLoader type="text" />
            <SkeletonLoader type="video" />
          </motion.div>
        ) : (videoUrl || explanation) ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          >
            {/* Explanation card (using placeholder) */}
            <Card className="p-6 shadow-md bg-white dark:bg-slate-900 overflow-hidden">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
                <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Explanation</h2>
                <div className="prose dark:prose-invert">
                  <p className="text-slate-700 dark:text-slate-300">
                  <p className="text-slate-700 dark:text-slate-300">{explanation}</p>
                    <Latex>{explanation || ''}</Latex>
                  </p>
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
                  {videoUrl ? (
                    <VideoPlayer videoUrl={videoUrl} />
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
