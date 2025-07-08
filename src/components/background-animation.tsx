"use client"

import { useEffect, useState } from "react"

interface FloatingEmoji {
  id: number
  emoji: string
  x: number
  size: number
  duration: number
  delay: number
}

const WEDDING_EMOJIS = ["💕", "🥂", "🎉", "✨", "💍", "🌸", "🎊", "💖"]

export default function BackgroundAnimation() {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([])

  useEffect(() => {
    const createEmojis = () => {
      const newEmojis = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        emoji: WEDDING_EMOJIS[Math.floor(Math.random() * WEDDING_EMOJIS.length)],
        x: Math.random() * 100,
        size: Math.random() * 20 + 15,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
      }))
      setEmojis(newEmojis)
    }

    createEmojis()
    const interval = setInterval(createEmojis, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {emojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute animate-float-background opacity-20"
          style={{
            left: `${emoji.x}%`,
            fontSize: `${emoji.size}px`,
            animationDuration: `${emoji.duration}s`,
            animationDelay: `${emoji.delay}s`,
          }}
        >
          {emoji.emoji}
        </div>
      ))}
    </div>
  )
}
