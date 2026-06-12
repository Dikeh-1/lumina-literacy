import { useEffect, useRef, useState, useCallback } from "react";

interface UseCountUpOptions {
  end: number;
  duration?: number;
  start?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

export function useCountUp({
  end,
  duration = 2000,
  start = 0,
  decimals = 0,
  suffix = "",
  prefix = "",
}: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsInView(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;

      setCount(Number(current.toFixed(decimals)));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration, start, decimals]);

  const formattedCount = `${prefix}${count.toLocaleString()}${suffix}`;

  return { ref, count, formattedCount, isInView };
}

export function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}
