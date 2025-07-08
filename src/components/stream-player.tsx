"use client"

import { useState, useEffect } from "react"
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  where,
  getDocs,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import FloatingReactions from "./floating-reactions"
import ConfettiEffect from "./confetti-effect"
import AdminControls from "./admin-controls"
import { Play, Sparkles } from "lucide-react"

interface StreamPlayerProps {
  streamUrl: string | null
  isLoading: boolean
}

interface Reaction {
  id: string
  emoji: string
  createdAt: any
  x: number
  y: number
}

const getEmbedUrl = (url: string) => {
  if (!url) return null

  try {
    const urlObj = new URL(url)
    let embedUrl = null

    if (urlObj.hostname.includes("youtube.com") || urlObj.hostname.includes("youtu.be")) {
      let videoId: string | null = null
      if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.substring(1)
      } else if (urlObj.pathname.includes("/embed/")) {
        return url
      } else if (urlObj.pathname.includes("/live/")) {
        videoId = urlObj.pathname.split("/live/")[1]
      } else {
        videoId = urlObj.searchParams.get("v")
      }

      if (videoId) {
        const cleanVideoId = videoId.split("?")[0]
        embedUrl = `https://www.youtube.com/embed/${cleanVideoId}?autoplay=1&mute=1`
      }
    } else if (urlObj.hostname.includes("vimeo.com")) {
      const videoId = urlObj.pathname.split("/").pop()
      if (videoId) {
        embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1`
      }
    }

    return embedUrl || url
  } catch (error) {
    return url
  }
}

export default function StreamPlayer({ streamUrl, isLoading }: StreamPlayerProps) {
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiCooldown, setConfettiCooldown] = useState(false)

  useEffect(() => {
    const q = query(collection(db, "reactions"), orderBy("createdAt", "desc"), limit(20))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newReactions: Reaction[] = []
      const now = Date.now()

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        if (data.createdAt) {
          const reactionTime = data.createdAt.toDate().getTime()
          if (now - reactionTime < 10000) {
            newReactions.push({
              id: doc.id,
              emoji: data.emoji,
              createdAt: data.createdAt,
              x: data.x,
              y: data.y,
            })
          }
        }
      })
      setReactions(newReactions)
    })

    const cleanupInterval = setInterval(async () => {
      const cutoffTime = new Date(Date.now() - 5000)
      const q = query(collection(db, "reactions"), where("createdAt", "<", cutoffTime))
      const snapshot = await getDocs(q)
      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref)
      })
    }, 2000)

    return () => {
      unsubscribe()
      clearInterval(cleanupInterval)
    }
  }, [])

  const sendReaction = async (emoji: string) => {
    await addDoc(collection(db, "reactions"), {
      emoji,
      createdAt: serverTimestamp(),
      x: Math.random() * 70 + 15,
      y: Math.random() * 50 + 25,
    })
  }

  const triggerConfetti = async () => {
    if (confettiCooldown) return

    setConfettiCooldown(true)
    setShowConfetti(true)

    await sendReaction("🎊")

    setTimeout(() => setShowConfetti(false), 5000)
    setTimeout(() => setConfettiCooldown(false), 8000)
  }

  const embedUrl = getEmbedUrl(streamUrl || "")

  if (isLoading) {
    return (
      <div className="glass-card aspect-video flex items-center justify-center animate-fade-in">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
          </div>
          <div>
            <p className="text-gray-900 text-xl font-semibold mb-2">Preparing the celebration...</p>
            <p className="text-gray-600 font-medium">Please wait while we set up your experience</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <AdminControls />
      <div className="glass-card overflow-hidden animate-fade-in">
        {embedUrl ? (
          <>
            <div className="aspect-video relative bg-black overflow-hidden rounded-t-xl">
              <iframe
                src={embedUrl}
                title="Wedding Live Stream"
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />

              <FloatingReactions reactions={reactions} />
              {showConfetti && <ConfettiEffect />}

              {/* Premium live indicator */}
              <div className="absolute top-6 left-6 live-indicator">
                <div className="live-dot"></div>
                <span className="font-semibold">LIVE</span>
              </div>

              {/* Elegant gradient overlay */}
              <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black/20 via-transparent to-transparent pointer-events-none"></div>
            </div>

            <div className="p-8 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-xl">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Share Your Joy</h3>
                  <Sparkles className="w-6 h-6 text-blue-600 ml-3" />
                </div>

                {/* Premium reaction buttons */}
                <div className="flex justify-center items-center gap-4 mb-8">
                  {[
                    { emoji: "❤️", label: "Love" },
                    { emoji: "👏", label: "Applause" },
                    { emoji: "🥂", label: "Cheers" },
                    { emoji: "✨", label: "Magic" },
                    { emoji: "🎉", label: "Celebrate" },
                  ].map((reaction, index) => (
                    <button
                      key={index}
                      onClick={() => sendReaction(reaction.emoji)}
                      className="reaction-button group"
                      title={reaction.label}
                    >
                      <span className="group-hover:scale-110 transition-transform duration-200">{reaction.emoji}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={triggerConfetti}
                  disabled={confettiCooldown}
                  className="premium-button text-lg px-10 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-2xl mr-3">🎊</span>
                  {confettiCooldown ? "Celebration in progress..." : "Celebrate Together"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-xl">
            <div className="text-center space-y-8 p-12">
              <div className="relative">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-elegant-lg">
                  <Play className="w-12 h-12 text-blue-600 ml-1" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-elegant">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-gray-900">Welcome to Our Wedding</h2>
                <p className="text-gray-700 text-xl font-medium">The celebration will begin shortly</p>
                <p className="text-gray-600 font-medium">Thank you for joining us on this magical day</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
