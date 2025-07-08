"use client";

import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, PartyPopper } from 'lucide-react';
import Confetti from './confetti';
import AdminControls from './admin-controls';
import RingsIcon from './icons/rings-icon';

interface Reaction {
  id: string;
  emoji: string;
  x: number;
}

const getEmbedUrl = (url: string) => {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    let embedUrl = null;

    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId: string | null = null;
      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.substring(1);
      } else if (urlObj.pathname.includes('/embed/')) {
        return url;
      } else if (urlObj.pathname.includes('/live/')) {
        videoId = urlObj.pathname.split('/live/')[1];
      } else {
        videoId = urlObj.searchParams.get('v');
      }

      if (videoId) {
        const cleanVideoId = videoId.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${cleanVideoId}?autoplay=1&mute=1`;
      }
    }
    else if (urlObj.hostname.includes('vimeo.com')) {
      const videoId = urlObj.pathname.split('/').pop();
      if (videoId) {
        embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1`;
      }
    }

    return embedUrl || url;
  } catch (error) {
    return url;
  }
};

const ChampagneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22h8"/>
        <path d="M12 16v6"/>
        <path d="M10.5 16h3"/>
        <path d="m14.5 12-1-10h-3l-1 10"/>
        <path d="M6 12h12"/>
    </svg>
)

export default function LiveStream() {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiCooldown, setConfettiCooldown] = useState(false);

  useEffect(() => {
    const unsubConfig = onSnapshot(doc(db, "livestream", "config"), (doc) => {
      const data = doc.data();
      setStreamUrl(data?.streamUrl || null);
      setIsLoading(false);
    });

    const unsubReactions = onSnapshot(doc(db, "livestream", "reactions"), (doc) => {
        const data = doc.data();
        if (data && data.emoji) {
            const newReaction: Reaction = {
                id: `${Date.now()}-${Math.random()}`,
                emoji: data.emoji,
                x: Math.random() * 90 + 5,
            };
            setReactions((prev) => [...prev, newReaction]);
            setTimeout(() => {
                setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
            }, 3000);
        }
    });
    
    const unsubConfetti = onSnapshot(doc(db, "livestream", "confetti"), (doc) => {
        const data = doc.data();
        if (data && data.triggeredAt) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        }
    });

    return () => {
      unsubConfig();
      unsubReactions();
      unsubConfetti();
    };
  }, []);

  const sendReaction = async (emoji: string) => {
    await setDoc(doc(db, "livestream", "reactions"), { emoji, triggeredAt: serverTimestamp() });
  };
  
  const triggerConfetti = async () => {
    if (confettiCooldown) return;
    setConfettiCooldown(true);
    await setDoc(doc(db, "livestream", "confetti"), { triggeredAt: serverTimestamp() });
    setTimeout(() => setConfettiCooldown(false), 10000);
  }

  const embedUrl = getEmbedUrl(streamUrl || '');

  return (
    <div className="relative w-full h-full bg-secondary flex items-center justify-center">
      <AdminControls />
      {isLoading ? (
        <Card className="bg-transparent border-none text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-primary animate-pulse">Loading Stream...</CardTitle>
          </CardHeader>
        </Card>
      ) : embedUrl ? (
        <>
          <iframe
            src={embedUrl}
            title="Live Wedding Stream"
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {reactions.map((r) => (
              <div
                key={r.id}
                className="absolute bottom-24 text-4xl reaction-emoji"
                style={{ left: `${r.x}%` }}
              >
                {r.emoji}
              </div>
            ))}
          </div>
          
          {showConfetti && <Confetti />}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-background/50 backdrop-blur-sm rounded-full shadow-lg border border-border">
            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full hover:bg-accent" onClick={() => sendReaction('❤️')}>
              <Heart className="w-7 h-7 text-primary fill-primary" />
            </Button>
            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full hover:bg-accent" onClick={() => sendReaction('🥂')}>
              <ChampagneIcon className="w-7 h-7 text-primary" />
            </Button>
            <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full hover:bg-accent" onClick={() => sendReaction('🎉')}>
              <PartyPopper className="w-7 h-7 text-primary" />
            </Button>
            <Button
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-3xl ml-2 transition-all duration-300 ease-in-out disabled:scale-100 disabled:opacity-70"
              onClick={triggerConfetti}
              disabled={confettiCooldown}
              aria-label="Confetti Bomb"
            >
              🎊
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center p-8 h-full w-full flex flex-col items-center justify-center">
            <RingsIcon className="w-20 h-20 text-primary mb-6" />
            <Card className="bg-transparent p-8 shadow-none border-none max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-4xl text-foreground">Welcome to Our Wedding</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-lg mt-2">The live stream has not started yet.</p>
                    <p className="text-muted-foreground text-lg mt-1">We're so happy you could join us!</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
