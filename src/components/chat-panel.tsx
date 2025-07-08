"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, type Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, MessageCircle, Users, Edit3, Sparkles } from "lucide-react"

interface Message {
  id: string
  text: string
  user: string
  createdAt: Timestamp
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [guestName, setGuestName] = useState("")
  const [nameInput, setNameInput] = useState("")
  const [hasJoined, setHasJoined] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)
  const [isEditingName, setIsEditingName] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("guestName")
      if (storedName) {
        setGuestName(storedName)
        setHasJoined(true)
      }
    }
  }, [])

  useEffect(() => {
    if (!hasJoined) return

    const q = query(collection(db, "chat"), orderBy("createdAt", "asc"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = []
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message)
      })
      setMessages(msgs)
      const recentMessages = msgs.filter(
        (msg) => msg.createdAt && Date.now() - msg.createdAt.toDate().getTime() < 300000,
      )
      const uniqueUsers = new Set(recentMessages.map((msg) => msg.user))
      setOnlineCount(uniqueUsers.size)
    })

    return () => unsubscribe()
  }, [hasJoined])

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [messages])

  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (nameInput.trim()) {
      const name = nameInput.trim()
      setGuestName(name)
      setHasJoined(true)
      if (typeof window !== "undefined") {
        localStorage.setItem("guestName", name)
      }
    }
  }

  const handleChangeName = (e: React.FormEvent) => {
    e.preventDefault()
    if (nameInput.trim()) {
      const name = nameInput.trim()
      setGuestName(name)
      setIsEditingName(false)
      if (typeof window !== "undefined") {
        localStorage.setItem("guestName", name)
      }
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "" || !guestName) return

    await addDoc(collection(db, "chat"), {
      text: newMessage,
      user: guestName,
      createdAt: serverTimestamp(),
    })

    setNewMessage("")
  }

  const formatTimestamp = (timestamp: Timestamp | undefined | null) => {
    if (!isMounted || !timestamp) {
      return ""
    }
    return new Date(timestamp.toDate().getTime()).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!hasJoined) {
    return (
      <div className="glass-card h-full flex flex-col animate-fade-in">
        <div className="text-center p-8 flex-1 flex flex-col justify-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-8 shadow-elegant-lg">
            <MessageCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the Celebration</h2>
          <p className="text-gray-600 font-medium mb-8">Enter your name to share in the joy with other guests</p>

          <form onSubmit={handleJoinChat} className="space-y-6 max-w-sm mx-auto">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-gray-700 font-semibold text-sm tracking-wide">
                YOUR NAME
              </Label>
              <Input
                id="name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your full name"
                required
                className="elegant-input text-center"
              />
            </div>
            <button type="submit" className="premium-button w-full">
              <Sparkles className="w-5 h-5 mr-2" />
              Join Celebration
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card h-full flex flex-col animate-fade-in">
      <div className="p-6 border-b border-white/20 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-t-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="w-6 h-6 mr-3 text-blue-600" />
            Live Celebration Chat
          </h2>
          <div className="flex items-center space-x-2 text-gray-600 bg-white/60 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-elegant">
            <Users className="w-4 h-4" />
            <span className="text-sm font-semibold">{onlineCount} online</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0 custom-scrollbar" ref={scrollAreaRef}>
        <div className="p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start space-x-4 group animate-slide-in">
              <Avatar className="h-10 w-10 shadow-elegant border-2 border-white/50 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-gray-800 text-sm font-semibold">
                  {getInitials(msg.user)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline space-x-3 mb-2">
                  <p className="font-semibold text-gray-900 text-sm">{msg.user}</p>
                  <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatTimestamp(msg.createdAt)}
                  </span>
                </div>
                <div className="chat-message">
                  <p className="text-gray-800 text-sm break-words font-medium leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-white/20 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-b-xl flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 text-sm text-gray-700">
            <Avatar className="h-7 w-7 border border-white/50">
              <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-gray-800 text-xs font-semibold">
                {getInitials(guestName)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">
              Chatting as <span className="font-bold text-gray-900">{guestName}</span>
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsEditingName(true)
              setNameInput(guestName)
            }}
            className="text-gray-600 hover:text-gray-900 hover:bg-white/40 p-2 rounded-lg transition-all duration-200"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>

        {isEditingName ? (
          <form onSubmit={handleChangeName} className="space-y-3 mb-4">
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter new name"
              className="elegant-input"
              autoFocus
            />
            <div className="flex space-x-2">
              <Button type="submit" size="sm" className="premium-button text-sm px-4 py-2">
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditingName(false)}
                className="border-white/40 text-gray-700 hover:text-gray-900 hover:bg-white/40"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : null}

        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share your thoughts and well wishes..."
            className="elegant-input flex-1"
            disabled={!guestName}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || !guestName}
            className="premium-button w-12 h-12 p-0"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
