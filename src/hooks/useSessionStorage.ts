import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

/**
 * Custom hook to sync string state with sessionStorage to retain user text across tool navigations.
 */
export function useSessionStorageString(
  key: string,
  initialValue: string
): [string, Dispatch<SetStateAction<string>>] {
  const [value, setValue] = useState<string>(() => {
    try {
      const saved = window.sessionStorage.getItem(key);
      return saved !== null ? saved : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // handle storage quota or private browsing exceptions
    }
  }, [key, value]);

  return [value, setValue];
}
