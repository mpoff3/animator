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
import "katex/dist/katex.min.css"; // Ensure KaTeX CSS is imported
import Latex from "react-latex-next";

// Define the base prompt string outside the component for efficiency
const baseManimPrompt = "You're an expert educator and Manim CE developer. Create a **complete and runnable Manim CE script** that visually explains the following math question in a clear, step-by-step animation: **Question:** \"{QUESTION}\" Goals:   * Define a class called GeneratedScene that inherits from Scene\n      Break the explanation into 3–6 short steps\n      Use `Text()` to explain each step simply (one sentence max)\n      Use `MathTex()` for all math (e.g., equations, fractions, dot products)\n      If applicable, use `Matrix()` objects to show visual matrix/vector layout\n      Use `Write`, `Create`, and `FadeOut` to animate content\n      Add pauses using `wait(1)` or `wait(2)` after each step\n      Visually show the final answer at the end of the scene\n      Constraints:\n      Don't use `.dot()`, `.T`, or real math operations\n      Don't use numpy, sympy, or external math libraries\n      Keep all math symbolic and visually instructive\n      + Keep visuals uncluttered: \n      If multiple elements are on screen together, use `.next_to()` or `.shift()` to space them\n      If an element replaces the previous one, center it (e.g., at `ORIGIN`, `DOWN`, or `UP`) so content stays vertically balanced\n      Ensure that everything that's being displayed at all time should be centered on the screen vertically and horizontally\n      Nothing should be outside of the bounds of the screen\n      Manim script shouldn't include unneccesary comments\n      Output:\n      Respond ONLY with valid Python code\n      The script must run with `manim -pql script.py {SCENE_NAME}` without errors";

//const manimServerURL = "https://mathlens-beta-937226988264.us-central1.run.app";
const manimServerURL = "http://127.0.0.1:5000";


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

    // Trigger both fetches concurrently
    await Promise.allSettled([
      queryExplanation(query),
      queryVideo(query)
    ]);

    // Note: Error handling is done within each query function
    // isSearching will be set to false within queryVideo (assuming it finishes last or handles errors)
    // If queryExplanation fails, its error state is set, but loading might stop prematurely if queryVideo finishes first.
    // Consider more robust state management if needed (e.g., tracking loading/error state for each fetch separately)
    // For now, setting isSearching=false in queryVideo's finally block is kept.
  }

  const queryExplanation = async (currentQuery: string) => {
    try {
      // Fetch explanation from local API endpoint
      const res = await fetch(`/api/getExplanation?query=${encodeURIComponent(currentQuery)}`)
      if (!res.ok) {
        throw new Error(`Explanation fetch failed: ${res.statusText}`);
      }
      const data = await res.json()
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch explanation from API.");
      }
      setExplanation(data.explanation || "No explanation available.");
    } catch (error) {
      const errorMsg = `Failed to fetch explanation: ${error instanceof Error ? error.message : String(error)}`;
      setSearchError((prevError) => prevError ? `${prevError}\n${errorMsg}` : errorMsg); // Append error messages
      console.error("Explanation fetch error:", error)
    }
  }

  const queryVideo = async (currentQuery: string) => {
    try {
      // Prepare the prompt by replacing the placeholder with the actual query
      const manimPrompt = baseManimPrompt.replace("{QUESTION}", currentQuery);

      // Prepare FormData
      const formData = new FormData();
      formData.append("question", currentQuery);
      formData.append("prompt", manimPrompt); // Use 'prompt' as the field name

      // Send request using FormData to external backend
      const response = await fetch(`${manimServerURL}/generate`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        let errorBody = "Unknown error";
        try {
            const errorData = await response.json();
            errorBody = errorData.error || JSON.stringify(errorData);
        } catch (parseError) {
            errorBody = await response.text();
        }
        throw new Error(`Video generation HTTP error! Status: ${response.status}, Message: ${errorBody}`)
      }

      const data = await response.json()

      console.log("Video generation response:", data)

      if (data.video_url) {
        // Prepend the base URL if the backend returns a relative path
        const fullVideoUrl = data.video_url.startsWith("http") ? data.video_url : `${manimServerURL}/${data.video_url.replace(/^\/+/,'')}`;
        setVideoUrl(fullVideoUrl);
        console.log("Video URL:", fullVideoUrl);
      } else if (data.error) {
        throw new Error(`Video generation API Error: ${data.error}`);
      } else {
        throw new Error("Unexpected response format from video generation API.");
      }
    } catch (error) {
      const errorMsg = `Failed to generate video: ${error instanceof Error ? error.message : String(error)}`;
      setSearchError((prevError) => prevError ? `${prevError}\n${errorMsg}` : errorMsg); // Append error messages
      console.error("Video generation error:", error)
    } finally {
      // Set searching to false after video attempt finishes (or fails)
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
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white">Mathlens</h1>
      </motion.div>

      {/* Search input */}
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

      {/* Search history */}
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
            {/* Display multi-line errors */} 
            {searchError.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
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
        ) : (explanation || videoUrl) ? (
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
                <div className="prose dark:prose-invert max-w-none">
                  {explanation ? (
                    <Latex>{explanation}</Latex>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400">No explanation available.</p>
                  )}
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

