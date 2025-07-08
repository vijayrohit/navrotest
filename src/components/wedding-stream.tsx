"use client"

import { useState, useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import StreamPlayer from "./stream-player"
import ChatPanel from "./chat-panel"
import WeddingHeader from "./wedding-header"
import { Button } from "@/components/ui/button"
import { MessageCircle, Video, Sparkles } from "lucide-react"

export default function WeddingStream() {
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"stream" | "chat">("stream")
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "livestream", "config"), (doc) => {
      const data = doc.data()
      setStreamUrl(data?.streamUrl || null)
      setIsLoading(false)
    })

    // Show content after curtain animation
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 4000) // Changed from 2500 to 4000 to match curtain timing

    return () => {
      unsubscribe()
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="min-h-screen gradient-bg-light">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Mobile header */}
      <div
        className={`block lg:hidden relative z-10 transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}
      >
        <header className="glass-card sticky top-0 z-40 border-b-0 rounded-none">
          <div className="px-6 py-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
              <h1 className="font-sacramento text-3xl text-gray-900">Rohit & Navaneetha</h1>
              <Sparkles className="w-5 h-5 text-blue-600 ml-2" />
            </div>
            <p className="text-gray-600 font-medium">Wedding Celebration</p>
          </div>
        </header>
      </div>

      {/* Desktop header */}
      <div
        className={`hidden lg:block relative z-10 transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}
      >
        <WeddingHeader />
      </div>

      {/* Mobile: Premium tabbed interface */}
      <div
        className={`block lg:hidden relative z-10 transition-all duration-1000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="flex glass-card sticky top-[120px] z-30 rounded-none border-t border-white/20">
          <Button
            variant="ghost"
            className={`flex-1 rounded-none h-14 border-r border-white/20 transition-all duration-300 ${
              activeTab === "stream"
                ? "bg-blue-600/10 text-blue-700 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/30"
            }`}
            onClick={() => setActiveTab("stream")}
          >
            <Video className="w-5 h-5 mr-3" />
            <span className="font-medium">Live Stream</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 rounded-none h-14 transition-all duration-300 ${
              activeTab === "chat"
                ? "bg-blue-600/10 text-blue-700 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/30"
            }`}
            onClick={() => setActiveTab("chat")}
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            <span className="font-medium">Live Chat</span>
          </Button>
        </div>

        <div className="p-6">
          {activeTab === "stream" && <StreamPlayer streamUrl={streamUrl} isLoading={isLoading} />}
          {activeTab === "chat" && (
            <div className="h-[calc(100vh-280px)]">
              <ChatPanel />
            </div>
          )}
        </div>
      </div>

      {/* Desktop: Premium layout */}
      <div
        className={`hidden lg:flex flex-row gap-8 p-8 max-w-[1400px] mx-auto relative z-10 transition-all duration-1000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="flex-1 lg:flex-[2]">
          <div className="h-[700px]">
            <StreamPlayer streamUrl={streamUrl} isLoading={isLoading} />
          </div>
        </div>
        <div className="w-full lg:w-[400px] lg:flex-shrink-0">
          <div className="h-[700px]">
            <ChatPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
