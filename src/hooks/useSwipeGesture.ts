import { useRef, useCallback } from 'react';

export interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  /** Minimum distance in px to trigger a swipe (default: 50) */
  threshold?: number;
  /** Maximum time in ms for swipe (default: 300) */
  maxTime?: number;
  /** If true, only trigger on edge swipes (within 30px of screen edge) */
  edgeOnly?: boolean;
  /** Edge zone width in px (default: 30) */
  edgeWidth?: number;
  /** Prevent default on touch move when swiping */
  preventDefault?: boolean;
}

export function useSwipeGesture(config: SwipeConfig): SwipeHandlers {
  const startRef = useRef<{ x: number; y: number; time: number; isEdge: boolean } | null>(null);
  const threshold = config.threshold ?? 50;
  const maxTime = config.maxTime ?? 300;
  const edgeWidth = config.edgeWidth ?? 30;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const isLeftEdge = touch.clientX < edgeWidth;
    const isRightEdge = touch.clientX > window.innerWidth - edgeWidth;
    startRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
      isEdge: isLeftEdge || isRightEdge,
    };
  }, [edgeWidth]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (config.preventDefault && startRef.current) {
      // Only prevent default if meaningful swipe detected
      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - startRef.current.x);
      const dy = Math.abs(touch.clientY - startRef.current.y);
      if (dx > 10 || dy > 10) {
        // Don't prevent - let the browser handle scroll
      }
    }
  }, [config.preventDefault]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!startRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startRef.current.x;
    const dy = touch.clientY - startRef.current.y;
    const elapsed = Date.now() - startRef.current.time;
    const isEdge = startRef.current.isEdge;

    startRef.current = null;

    if (elapsed > maxTime) return;
    if (config.edgeOnly && !isEdge) return;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Determine dominant direction
    if (absDx > absDy && absDx >= threshold) {
      if (dx > 0) config.onSwipeRight?.();
      else config.onSwipeLeft?.();
    } else if (absDy > absDx && absDy >= threshold) {
      if (dy > 0) config.onSwipeDown?.();
      else config.onSwipeUp?.();
    }
  }, [config, threshold, maxTime]);

  return { onTouchStart, onTouchMove, onTouchEnd };
}

/**
 * Hook for pull-to-refresh gesture.
 * Returns touch handlers + a `refreshing` state indicator.
 */
import { useState } from 'react';

export function usePullToRefresh(onRefresh: () => Promise<void> | void) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  const PULL_THRESHOLD = 60;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.currentTarget as HTMLElement;
    scrollTop.current = target.scrollTop;
    if (scrollTop.current <= 0) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling || refreshing) return;
    const target = e.currentTarget as HTMLElement;
    if (target.scrollTop > 0) {
      setPulling(false);
      setPullDistance(0);
      return;
    }
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) {
      setPullDistance(Math.min(dy * 0.5, 80));
    }
  }, [pulling, refreshing]);

  const onTouchEnd = useCallback(async () => {
    if (pullDistance >= PULL_THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullDistance(0);
      setPulling(false);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    } else {
      setPullDistance(0);
      setPulling(false);
    }
  }, [pullDistance, refreshing, onRefresh]);

  return {
    pullHandlers: { onTouchStart, onTouchMove, onTouchEnd },
    pullDistance,
    refreshing,
  };
}
