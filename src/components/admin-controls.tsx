"use client"

import { useState } from "react"
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "password"

export default function AdminControls() {
  const { toast } = useToast()
  const [streamUrl, setStreamUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const fetchStreamUrl = async () => {
    try {
      const docRef = doc(db, "livestream", "config")
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setStreamUrl(docSnap.data().streamUrl || "")
      }
    } catch (error) {
      console.error("Error fetching settings: ", error)
    }
  }

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
    fetchStreamUrl()
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setIsAuthenticated(false)
    setUsername("")
    setPassword("")
  }

  const handleLogin = () => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid credentials.",
      })
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const docRef = doc(db, "livestream", "config")
      await setDoc(docRef, { streamUrl })
      toast({
        title: "Success",
        description: "Stream URL updated successfully.",
      })
      handleCloseDialog()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update stream URL.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = async () => {
    setIsLoading(true)
    try {
      const chatCollection = collection(db, "chat")
      const chatSnapshot = await getDocs(chatCollection)
      const promises = chatSnapshot.docs.map((doc) => deleteDoc(doc.ref))
      await Promise.all(promises)
      toast({
        title: "Success",
        description: "Chat history cleared successfully.",
      })
      setIsConfirmClearOpen(false)
      handleCloseDialog()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear chat history.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        className="fixed top-6 right-6 z-50 glass-card w-12 h-12 p-0 border border-white/30 hover:bg-white/40 transition-all duration-200"
        size="icon"
        variant="ghost"
      >
        <Settings className="w-5 h-5 text-gray-700" />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border border-white/30 sm:max-w-[425px]">
          {!isAuthenticated ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900 font-bold">Admin Login</DialogTitle>
                <DialogDescription className="text-gray-600 font-medium">
                  Enter your credentials to access admin controls.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="username" className="text-gray-700 font-semibold">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="elegant-input"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-gray-700 font-semibold">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="elegant-input"
                  />
                </div>
              </div>
              <DialogFooter>
                <button onClick={handleLogin} className="premium-button">
                  Login
                </button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900 font-bold">Admin Controls</DialogTitle>
                <DialogDescription className="text-gray-600 font-medium">
                  Manage stream settings and chat.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="stream-url" className="text-gray-700 font-semibold">
                    Stream URL
                  </Label>
                  <Input
                    id="stream-url"
                    value={streamUrl}
                    onChange={(e) => setStreamUrl(e.target.value)}
                    placeholder="https://www.youtube.com/embed/..."
                    className="elegant-input"
                  />
                  <button onClick={handleSave} disabled={isLoading} className="premium-button">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save URL
                  </button>
                </div>
                <Separator className="bg-white/30" />
                <div className="grid gap-2">
                  <Label className="text-gray-700 font-semibold">Chat Management</Label>
                  <Button
                    variant="destructive"
                    onClick={() => setIsConfirmClearOpen(true)}
                    disabled={isLoading}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium"
                  >
                    Clear Chat History
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmClearOpen} onOpenChange={setIsConfirmClearOpen}>
        <AlertDialogContent className="glass-card border border-white/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 font-bold">Clear Chat History?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 font-medium">
              This will permanently delete all chat messages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isLoading}
              className="border-white/40 text-gray-700 hover:text-gray-900 hover:bg-white/40"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearChat}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 text-white font-medium"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Clear Chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
