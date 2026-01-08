import { useState, useEffect } from "react";

export function useDebounce(value, delay) {
  const [debounce, setDebounce] = useState(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounce(value);
    }, delay);
    return () => {
      clearTimeout(id);
    };
  }, [value, delay]);
  return debounce;
}
