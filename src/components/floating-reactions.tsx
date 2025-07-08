"use client"

import { useEffect, useState } from "react"

interface Reaction {
  id: string
  emoji: string
  createdAt: any
  x: number
  y: number
}

interface FloatingReactionsProps {
  reactions: Reaction[]
}

interface AnimatedReaction extends Reaction {
  animationKey: string
  startTime: number
}

export default function FloatingReactions({ reactions }: FloatingReactionsProps) {
  const [animatedReactions, setAnimatedReactions] = useState<AnimatedReaction[]>([])
  const [lastReactionCount, setLastReactionCount] = useState(0)

  useEffect(() => {
    if (reactions.length > lastReactionCount) {
      const newReactions = reactions.slice(0, reactions.length - lastReactionCount)

      const newAnimatedReactions = newReactions.map((reaction) => ({
        ...reaction,
        animationKey: `${reaction.id}-${Date.now()}-${Math.random()}`,
        startTime: Date.now(),
      }))

      setAnimatedReactions((prev) => [...prev, ...newAnimatedReactions])
    }

    setLastReactionCount(reactions.length)
  }, [reactions, lastReactionCount])

  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now()
      setAnimatedReactions((prev) => prev.filter((reaction) => now - reaction.startTime < 4000))
    }, 1000)

    return () => clearInterval(cleanup)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {animatedReactions.map((reaction) => (
        <div
          key={reaction.animationKey}
          className="floating-reaction"
          style={{
            left: `${reaction.x}%`,
            top: `${reaction.y}%`,
          }}
        >
          {reaction.emoji}
        </div>
      ))}
    </div>
  )
}
