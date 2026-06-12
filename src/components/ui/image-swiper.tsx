"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand } from 'lucide-react';

interface ImageSwiperProps {
  images: string;
  cardWidth?: number;
  cardHeight?: number;
  className?: string;
}

export const ImageSwiper: React.FC<ImageSwiperProps> = ({
  images,
  cardWidth = 280,  // slightly larger
  cardHeight = 400,
  className = ''
}) => {
  const cardStackRef = useRef<HTMLDivElement>(null);
  const isSwiping = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  const imageList = images.split(',').map(img => img.trim()).filter(img => img);
  const [cardOrder, setCardOrder] = useState<number[]>(() =>
    Array.from({ length: imageList.length }, (_, i) => i)
  );

  const [hasInteracted, setHasInteracted] = useState(false);

  const getDurationFromCSS = useCallback((
    variableName: string,
    element?: HTMLElement | null
  ): number => {
    const targetElement = element || document.documentElement;
    const value = getComputedStyle(targetElement)
      ?.getPropertyValue(variableName)
      ?.trim();
    if (!value) return 0;
    if (value.endsWith("ms")) return parseFloat(value);
    if (value.endsWith("s")) return parseFloat(value) * 1000;
    return parseFloat(value) || 0;
  }, []);

  const getCards = useCallback((): HTMLElement[] => {
    if (!cardStackRef.current) return [];
    return [...cardStackRef.current.querySelectorAll('.image-card')] as HTMLElement[];
  }, []);

  const getActiveCard = useCallback((): HTMLElement | null => {
    const cards = getCards();
    return cards[0] || null;
  }, [getCards]);

  const updatePositions = useCallback(() => {
    const cards = getCards();
    cards.forEach((card, i) => {
      card.style.setProperty('--i', (i + 1).toString());
      card.style.setProperty('--swipe-x', '0px');
      card.style.setProperty('--swipe-rotate', '0deg');
      card.style.opacity = '1';
    });
  }, [getCards]);

  const applySwipeStyles = useCallback((deltaX: number) => {
    const card = getActiveCard();
    if (!card) return;
    card.style.setProperty('--swipe-x', `${deltaX}px`);
    card.style.setProperty('--swipe-rotate', `${deltaX * 0.15}deg`);
    card.style.opacity = (1 - Math.min(Math.abs(deltaX) / 150, 1) * 0.5).toString();
  }, [getActiveCard]);

  const handleStart = useCallback((clientX: number) => {
    setHasInteracted(true);
    if (isSwiping.current) return;
    isSwiping.current = true;
    startX.current = clientX;
    currentX.current = clientX;
    const card = getActiveCard();
    if (card) card.style.transition = 'none';
  }, [getActiveCard]);

  const handleEnd = useCallback(() => {
    if (!isSwiping.current) return;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    const deltaX = currentX.current - startX.current;
    const threshold = 50;
    const duration = getDurationFromCSS('--card-swap-duration', cardStackRef.current);
    const card = getActiveCard();

    if (card) {
      card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

      if (Math.abs(deltaX) > threshold) {
        const direction = Math.sign(deltaX);
        card.style.setProperty('--swipe-x', `${direction * 300}px`);
        card.style.setProperty('--swipe-rotate', `${direction * 20}deg`);

        setTimeout(() => {
          if (getActiveCard() === card) {
            card.style.setProperty('--swipe-rotate', `${-direction * 20}deg`);
          }
        }, duration * 0.5);

        setTimeout(() => {
          setCardOrder(prev => {
            if (prev.length === 0) return [];
            return [...prev.slice(1), prev[0]];
          });
        }, duration);
      } else {
        applySwipeStyles(0);
      }
    }

    isSwiping.current = false;
    startX.current = 0;
    currentX.current = 0;
  }, [getDurationFromCSS, getActiveCard, applySwipeStyles]);

  const handleMove = useCallback((clientX: number) => {
    if (!isSwiping.current) return;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    animationFrameId.current = requestAnimationFrame(() => {
      currentX.current = clientX;
      const deltaX = currentX.current - startX.current;
      applySwipeStyles(deltaX);

      if (Math.abs(deltaX) > 50) {
        handleEnd();
      }
    });
  }, [applySwipeStyles, handleEnd]);

  useEffect(() => {
    const cardStackElement = cardStackRef.current;
    if (!cardStackElement) return;

    const handlePointerDown = (e: PointerEvent) => handleStart(e.clientX);
    const handlePointerMove = (e: PointerEvent) => handleMove(e.clientX);
    const handlePointerUp = (e: PointerEvent) => handleEnd();

    cardStackElement.addEventListener('pointerdown', handlePointerDown);
    cardStackElement.addEventListener('pointermove', handlePointerMove);
    cardStackElement.addEventListener('pointerup', handlePointerUp);
    cardStackElement.addEventListener('pointercancel', handlePointerUp);
    cardStackElement.addEventListener('pointerleave', handlePointerUp);

    return () => {
      cardStackElement.removeEventListener('pointerdown', handlePointerDown);
      cardStackElement.removeEventListener('pointermove', handlePointerMove);
      cardStackElement.removeEventListener('pointerup', handlePointerUp);
      cardStackElement.removeEventListener('pointercancel', handlePointerUp);
      cardStackElement.removeEventListener('pointerleave', handlePointerUp);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleStart, handleMove, handleEnd]);

  useEffect(() => {
    updatePositions();
  }, [cardOrder, updatePositions]);

  return (
    <div className={`relative ${className}`}>
      {/* Swipe Indicator */}
      <AnimatePresence>
        {!hasInteracted && imageList.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#1B2D5E] text-[#FFFCF7] px-4 py-2 rounded-full shadow-lg pointer-events-none"
          >
            <motion.div
              animate={{ x: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <Hand size={18} className="text-[#C9A84C]" />
            </motion.div>
            <span className="text-sm font-medium tracking-wide">Swipe Cards</span>
          </motion.div>
        )}
      </AnimatePresence>

      <section
        className={`relative grid place-content-center select-none w-full`}
        ref={cardStackRef}
        style={{
          height: cardHeight + 40,
          touchAction: 'none',
          transformStyle: 'preserve-3d',
          '--card-perspective': '900px',
          '--card-z-offset': '15px',
          '--card-y-offset': '10px',
          '--card-max-z-index': imageList.length.toString(),
          '--card-swap-duration': '0.4s',
        } as React.CSSProperties}
      >
        {cardOrder.map((originalIndex, displayIndex) => (
          <article
            key={`${imageList[originalIndex]}-${originalIndex}`}
            className="image-card absolute cursor-grab active:cursor-grabbing place-self-center overflow-hidden will-change-transform rounded-2xl shadow-2xl"
            style={{
              '--i': (displayIndex + 1).toString(),
              zIndex: imageList.length - displayIndex,
              width: cardWidth,
              height: cardHeight,
              border: "4px solid #FBF8F2",
              boxShadow: "0 20px 40px rgba(16, 27, 56, 0.2), 0 0 0 1px rgba(201, 168, 76, 0.2)",
              transform: `perspective(var(--card-perspective))
                         translateZ(calc(-1 * var(--card-z-offset) * var(--i)))
                         translateY(calc(var(--card-y-offset) * var(--i)))
                         translateX(var(--swipe-x, 0px))
                         rotateZ(var(--swipe-rotate, 0deg))` // Changed rotateY to rotateZ for classic card swipe effect
            } as React.CSSProperties}
          >
            <div className="absolute inset-0 bg-[#101B38] opacity-10 mix-blend-overlay z-10 pointer-events-none" />
            <img
              src={imageList[originalIndex]}
              alt={`Lumina showcase ${originalIndex + 1}`}
              className="w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
            />
          </article>
        ))}
      </section>
    </div>
  );
};
