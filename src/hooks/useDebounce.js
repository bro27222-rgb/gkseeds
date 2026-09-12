import { useState, useEffect } from 'react';

export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the value only AFTER the user stops typing
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If the user types again before the timer finishes, clear it and start over
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}