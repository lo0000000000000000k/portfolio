'use client';
import { useState, useEffect, useRef } from 'react';

export function useTypingEffect(phrases: string[], typingSpeed = 65, deletingSpeed = 35, pauseDuration = 2200) {
  const [displayed, setDisplayed] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const phrase = phrases[phraseIdx];

    const tick = () => {
      if (!isDeleting) {
        const next = charIdx + 1;
        setDisplayed(phrase.substring(0, next));
        setCharIdx(next);
        if (next === phrase.length) {
          timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseDuration);
          return;
        }
      } else {
        const next = charIdx - 1;
        setDisplayed(phrase.substring(0, next));
        setCharIdx(next);
        if (next === 0) {
          setIsDeleting(false);
          setPhraseIdx((prev) => (prev + 1) % phrases.length);
        }
      }
    };

    timeoutRef.current = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [charIdx, isDeleting, phraseIdx, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return displayed;
}
