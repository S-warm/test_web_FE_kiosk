// src/hooks/useKioskTrackers.ts
import { useEffect, useRef } from 'react';
import { useKioskLog } from '../context/KioskLogContext';

export const useClickTracker = () => {
  const { logAction } = useKioskLog();
  const clickBuffer = useRef<{ html: string; time: number }[]>([]);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const isBackground = target === document.body || target.id === 'root';
      if (isBackground) return;

      const interactable = target.closest('button, a, input, select, textarea, [role="button"]');
      const el = (interactable || target) as HTMLElement;

      if (!interactable && !el.textContent?.trim()) return;

      const html = el.outerHTML;
      const now = Date.now();

      clickBuffer.current = clickBuffer.current.filter(c => now - c.time < 1500);
      clickBuffer.current.push({ html, time: now });

      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        const sameEl = clickBuffer.current.filter(c => c.html === html);
        const count = sameEl.length;

        if (count >= 2) {
          logAction('click', html, count);
        } else {
          logAction('click', html);
        }

        clickBuffer.current = clickBuffer.current.filter(c => c.html !== html);
      }, 300);
    };

    window.addEventListener('click', handleClick, true);
    return () => {
      window.removeEventListener('click', handleClick, true);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [logAction]);
};

export const useInputTracker = () => {
  const { logAction } = useKioskLog();

  useEffect(() => {
    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;

      const safeHtml = target.type === 'password'
        ? `<input type="password" name="${target.name || ''}">`
        : `<${target.tagName.toLowerCase()} name="${target.name || ''}" value="${(target.value || '').slice(0, 30)}">`;

      logAction('input', safeHtml);
    };

    window.addEventListener('change', handleChange, true);
    return () => window.removeEventListener('change', handleChange, true);
  }, [logAction]);
};