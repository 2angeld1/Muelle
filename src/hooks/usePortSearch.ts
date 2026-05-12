'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Port {
  _id: string;
  name: string;
  code: string;
  country: string;
  countryCode: string;
  type: "port" | "city" | "terminal" | "depot";
  region: string;
}

export function usePortSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Port[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/ports/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
      setIsOpen(data.length > 0);
      setHighlightIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedPort(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const selectPort = (port: Port) => {
    setSelectedPort(port);
    setQuery(`${port.name}, ${port.region} (${port.code})`);
    setIsOpen(false);
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        if (highlightIndex >= 0 && results[highlightIndex]) {
          e.preventDefault();
          selectPort(results[highlightIndex]);
        } else {
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    query,
    results,
    isOpen,
    loading,
    selectedPort,
    highlightIndex,
    wrapperRef,
    inputRef,
    setIsOpen,
    handleChange,
    selectPort,
    handleKeyDown,
  };
}
