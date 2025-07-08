"use client"

import { useState, useEffect } from "react"
import { Sparkles, Heart } from "lucide-react"

export default function WeddingHeader() {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    // Start the curtain animation after a longer delay so users can see it
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 3000) // Changed from 1000 to 3000

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Theater Curtain Overlay */}
      <div className={`fixed inset-0 z-[60] theater-curtain ${isAnimating ? "curtain-closed" : "curtain-open"}`}>
        {/* Curtain fabric texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-900 via-red-800 to-red-900 opacity-95"></div>

        {/* Curtain folds and shadows */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/30 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
        </div>

        {/* Curtain header with elegant text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white animate-fade-in">
            {/* Decorative top border */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>
              <div className="mx-6 w-4 h-4 bg-gold rounded-full shadow-lg animate-pulse"></div>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>
            </div>

            {/* Main title with Sacramento font */}
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-gold mr-8 animate-pulse" />
              <h1 className="font-sacramento text-7xl lg:text-8xl text-gold drop-shadow-2xl animate-pulse">
                Rohit & Navaneetha
              </h1>
              <Sparkles className="w-8 h-8 text-gold ml-8 animate-pulse delay-500" />
            </div>

            {/* Subtitle */}
            <div className="flex items-center justify-center mb-8">
              <Heart className="w-6 h-6 text-pink-300 mr-4 animate-pulse delay-1000" />
              <p className="text-2xl font-serif tracking-widest text-gold/90">WEDDING CELEBRATION</p>
              <Heart className="w-6 h-6 text-pink-300 ml-4 animate-pulse delay-1000" />
            </div>

            {/* Bottom decorative border */}
            <div className="flex items-center justify-center">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>
              <div className="mx-6 w-4 h-4 bg-gold rounded-full shadow-lg animate-pulse"></div>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>
            </div>

            {/* Loading indicator */}
            <div className="mt-12">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce delay-200"></div>
              </div>
              <p className="text-gold/70 text-sm mt-4 font-serif tracking-wide">The show is about to begin...</p>
            </div>
          </div>
        </div>

        {/* Curtain rope and tassels */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-16 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-b-full shadow-lg"></div>
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-gradient-to-b from-yellow-800 to-yellow-900 rounded-full"></div>
      </div>

      {/* Regular header (revealed after curtain opens) */}
      <header className="glass-card sticky top-0 z-40 border-b-0 rounded-none">
        <div className="max-w-[1400px] mx-auto px-8 py-12">
          <div className="text-center">
            {/* Elegant title with Sacramento font */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                <Sparkles className="w-6 h-6 text-blue-600 mr-6 animate-pulse" />
                <Heart className="w-5 h-5 text-pink-500 mr-8 animate-pulse delay-500" />
              </div>
              <h1 className="font-sacramento text-6xl lg:text-7xl text-gray-900 drop-shadow-sm">Rohit & Navaneetha</h1>
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-pink-500 ml-8 animate-pulse delay-500" />
                <Sparkles className="w-6 h-6 text-blue-600 ml-6 animate-pulse" />
              </div>
            </div>

            {/* Elegant divider */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              <div className="mx-6 w-3 h-3 bg-blue-500 rounded-full shadow-elegant"></div>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            </div>

            <p className="text-gray-700 font-semibold text-xl tracking-wide mb-3">WEDDING CELEBRATION</p>
            <p className="text-gray-600 font-medium">Join us as we celebrate our eternal love</p>
          </div>
        </div>
      </header>
    </>
  )
}
