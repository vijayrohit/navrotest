"use client";

import { useEffect, useState } from 'react';

const CONFETTI_COLORS = ['#E6E6FA', '#FFD700', '#F5B7B1', '#85C1E9', '#A9DFBF'];
const CONFETTI_COUNT = 150;

const Confetti = () => {
  const [confetti, setConfetti] = useState<any[]>([]);

  useEffect(() => {
    const newConfetti = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}vw`,
        backgroundColor: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        animationDelay: `${Math.random() * 2}s`,
        width: `${Math.floor(Math.random() * 8) + 8}px`,
        height: `${Math.floor(Math.random() * 5) + 5}px`,
        transform: `rotate(${Math.random() * 360}deg)`,
      }
    }));
    setConfetti(newConfetti);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      {confetti.map(c => (
        <div key={c.id} className="confetti" style={c.style} />
      ))}
    </div>
  );
};

export default Confetti;
