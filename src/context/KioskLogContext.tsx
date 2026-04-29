// src/context/KioskLogContext.tsx
import React, { createContext, useContext, useRef, useCallback } from 'react';

export interface ActionLog {
  action_type: 'click' | 'input';
  target_html: string;
  timestamp: string;
  count?: number;
}

export interface PageLog {
  step_order: number;
  url: string;
  page_duration_ms: number;
  skipped: boolean;
  actions: ActionLog[];
}

export interface SessionLog {
  session_id: string;
  is_success: boolean;
  total_duration_ms: number;
  pages: PageLog[];
}

interface KioskLogContextType {
  enterPage: (url: string) => void;
  leavePage: (skipped?: boolean) => void;
  logAction: (actionType: ActionLog['action_type'], targetHtml: string, count?: number) => void;
  finishSession: (isSuccess: boolean) => SessionLog;
  resetSession: () => void;
}

const KioskLogContext = createContext<KioskLogContextType | null>(null);

const generateSessionId = () =>
  `kiosk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const KioskLogProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const startTime = useRef(Date.now());
  const stepOrder = useRef(0);
  const pageEnterTime = useRef(Date.now());

  const log = useRef<SessionLog>({
    session_id: generateSessionId(),
    is_success: false,
    total_duration_ms: 0,
    pages: [],
  });

  const currentPage = useRef<PageLog | null>(null);

  const enterPage = useCallback((url: string) => {
    stepOrder.current += 1;
    pageEnterTime.current = Date.now();
    const page: PageLog = {
      step_order: stepOrder.current,
      url,
      page_duration_ms: 0,
      skipped: false,
      actions: [],
    };
    log.current.pages.push(page);
    currentPage.current = page;
  }, []);

  const leavePage = useCallback((skipped = false) => {
    if (!currentPage.current) return;
    currentPage.current.page_duration_ms = Date.now() - pageEnterTime.current;
    if (skipped) currentPage.current.skipped = true;
  }, []);

  const logAction = useCallback((
    actionType: ActionLog['action_type'],
    targetHtml: string,
    count?: number
  ) => {
    if (!currentPage.current) return;
    currentPage.current.actions.push({
      action_type: actionType,
      target_html: targetHtml,
      timestamp: new Date().toISOString(),
      ...(count && count > 1 ? { count } : {}),
    });
  }, []);

  const finishSession = useCallback((isSuccess: boolean): SessionLog => {
    if (currentPage.current) {
      currentPage.current.page_duration_ms = Date.now() - pageEnterTime.current;
    }
    const hasSkip = log.current.pages.some(p => p.skipped);
    log.current.is_success = isSuccess && !hasSkip;
    log.current.total_duration_ms = Date.now() - startTime.current;
    return JSON.parse(JSON.stringify(log.current));
  }, []);

  // 로그 초기화 - 처음부터 다시하기
  const resetSession = useCallback(() => {
    log.current = {
      session_id: generateSessionId(),
      is_success: false,
      total_duration_ms: 0,
      pages: [],
    };
    stepOrder.current = 0;
    startTime.current = Date.now();
    currentPage.current = null;
  }, []);

  return (
    <KioskLogContext.Provider value={{ enterPage, leavePage, logAction, finishSession, resetSession }}>
      {children}
    </KioskLogContext.Provider>
  );
};

export const useKioskLog = () => {
  const ctx = useContext(KioskLogContext);
  if (!ctx) throw new Error('useKioskLog must be used within KioskLogProvider');
  return ctx;
};