"use client";

import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, User2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  id: string;
  text: string;
  user: string;
  createdAt: Timestamp;
}

export default function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('guestName');
      if (storedName) {
        setGuestName(storedName);
        setHasJoined(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!hasJoined) return;

    const q = query(collection(db, 'chat'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [hasJoined]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      const name = nameInput.trim();
      setGuestName(name);
      setHasJoined(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('guestName', name);
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !guestName) return;

    await addDoc(collection(db, 'chat'), {
      text: newMessage,
      user: guestName,
      createdAt: serverTimestamp(),
    });

    setNewMessage('');
  };

  const formatTimestamp = (timestamp: Timestamp | undefined | null) => {
    if (!isMounted || !timestamp) {
      return '';
    }
    return new Date(timestamp.toDate().getTime()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (!hasJoined) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6">
        <Card className="w-full max-w-sm border-none shadow-none bg-transparent">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Join the Celebration</CardTitle>
            <CardDescription>Enter your name to start sending well wishes.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinChat} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground">Your Name</Label>
                <Input
                  id="name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your name..."
                  required
                  className="bg-background"
                />
              </div>
              <Button type="submit" className="w-full font-bold">
                Start Chatting
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card">
      <header className="p-4 border-b">
        <h2 className="text-xl font-bold text-center text-primary">Live Chat</h2>
      </header>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  <User2 className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col w-full">
                <div className="flex items-baseline gap-2">
                  <p className="font-bold text-sm text-foreground">{msg.user}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(msg.createdAt)}
                  </span>
                </div>
                <div className="text-sm break-words text-foreground/90 mt-1">
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-card space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>Sending as: <span className="font-bold text-foreground">{guestName}</span></span>
        </div>
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send your well wishes..."
            className="flex-1"
            disabled={!guestName}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim() || !guestName}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
