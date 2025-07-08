"use client"

import { useEffect, useState } from "react"

const CONFETTI_COLORS = [
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ef4444", // Red
  "#10b981", // Green
  "#f59e0b", // Yellow
  "#ec4899", // Pink
]

const CONFETTI_COUNT = 120

interface ConfettiPiece {
  id: number
  x: number
  color: string
  size: number
  delay: number
  duration: number
}

export default function ConfettiEffect() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const pieces = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 6 + 3,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 4,
    }))

    setConfetti(pieces)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall shadow-lg"
          style={{
            left: `${piece.x}%`,
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  )
}
