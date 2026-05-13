
import { useEffect, useState } from 'react';

/**
 * Debounce হুক - সার্চ টাইপিং এর সময় API কল কমানোর জন্য
 * @param value - যে ভ্যালুটি debounce করতে চান (সার্চ টার্ম)
 * @param delay - কত মিলিসেকেন্ড পরে কল হবে (ডিফল্ট: 500ms)
 * @returns debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     fetchResults(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
