'use client';

import { useState } from 'react';

interface Itinerary {
  source: string;
  shipping_line?: string;
  price?: string;
  transit_time?: string;
  delay_risk?: string;
  co2_emissions?: string;
  transshipments?: string;
}

export function useLogisticsSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Itinerary[]>([]);
  const [searchParams, setSearchParams] = useState({ origin: '', destination: '' });

  const performSearch = async (formData: FormData) => {
    setLoading(true);
    const origin = formData.get('origin') as string;
    const destination = formData.get('destination') as string;
    
    setSearchParams({ origin, destination });

    try {
      const response = await fetch('/api/logistics/search', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResults(data.results || []);
      
      // Scroll suave a resultados
      setTimeout(() => {
        document.getElementById('itinerarios-resultados')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Error searching itineraries:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    results,
    searchParams,
    performSearch,
  };
}
