"use client";

import { useEffect } from "react";

/**
 * AntiInspect:
 * Disables context menu (right click), devtools hotkeys (F12, Ctrl+Shift+I,
 * Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U), text selection shortcuts, and
 * debugger loop detection to deter inspect element in CTF mode.
 */
export default function AntiInspect() {
  useEffect(() => {
    // 1. Disable Right Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Cmd+Opt+I)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      const ctrlOrCmd = e.ctrlKey || e.metaKey;

      // Ctrl+Shift+I (DevTools) / Cmd+Option+I (Mac)
      if (ctrlOrCmd && e.shiftKey && (e.key === "I" || e.key === "i" || e.keyCode === 73)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+J (Console) / Cmd+Option+J (Mac)
      if (ctrlOrCmd && e.shiftKey && (e.key === "J" || e.key === "j" || e.keyCode === 74)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+C (Inspect Element) / Cmd+Option+C (Mac)
      if (ctrlOrCmd && e.shiftKey && (e.key === "C" || e.key === "c" || e.keyCode === 67)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+U (View Page Source)
      if (ctrlOrCmd && (e.key === "U" || e.key === "u" || e.keyCode === 85)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+S (Save Page)
      if (ctrlOrCmd && (e.key === "S" || e.key === "s" || e.keyCode === 83)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 3. Periodic debugger trap if DevTools is opened
    const interval = setInterval(() => {
      // In dev mode we don't aggressively trigger debugger statements, only in production
      if (process.env.NODE_ENV === "production") {
        const start = performance.now();
        // eslint-disable-next-line no-debugger
        debugger;
        if (performance.now() - start > 100) {
          document.body.innerHTML = `
            <div style="background:#0d0b0a;color:#ff4444;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;text-align:center;padding:20px;">
              <h1 style="font-size:24px;margin-bottom:10px;">॥ कलियुग स्तम्भनम् ॥</h1>
              <p style="color:#e8dcc4;">Sanjaya's gate does not reveal its secrets through the glass of devtools, traveller.</p>
            </div>
          `;
        }
      }
    }, 1500);

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  return null;
}
