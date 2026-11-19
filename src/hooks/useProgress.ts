"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Progress } from "../types";

const STORAGE_KEY = "roadmap-progress";
const EMPTY: Progress = {};

const listeners = new Set<() => void>();
let current: Progress | null = null;

function load(): Progress {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return Object.fromEntries(
        Object.entries(parsed).filter(([, done]) => done === true),
      );
    }
  } catch {
    // Missing, corrupt or blocked storage: start fresh.
  }
  return {};
}

function save(next: Progress) {
  current = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (e.g. private mode): keep progress in memory only.
  }
  listeners.forEach((notify) => notify());
}

function getSnapshot(): Progress {
  current ??= load();
  return current;
}

// The server has no localStorage, so it always renders "nothing done".
function getServerSnapshot(): Progress {
  return EMPTY;
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  // Keep other open tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      current = load();
      notify();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((topicId: string) => {
    const next = { ...getSnapshot() };
    if (next[topicId]) delete next[topicId];
    else next[topicId] = true;
    save(next);
  }, []);

  return { progress, toggle };
}
