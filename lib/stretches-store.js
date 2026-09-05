// lib/stretches-store.js
// Single source of truth for the stretch list.
// Holds the data, the loading/error flags, and the four CRUD actions.

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as api from './api';
import * as storage from './storage';

const StretchesContext = createContext(null);

export function StretchesProvider({ children }) {
  const [stretches, setStretches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingCache, setUsingCache] = useState(false);

  // useCallback keeps this function identity stable so the useEffect below
  // doesn't re-run on every render.
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchStretches();
      setStretches(data);
      setUsingCache(false);
      await storage.saveStretchesToCache(data);
    } catch (networkError) {
      // Server unreachable: fall back to the saved copy.
      const cached = await storage.loadStretchesFromCache();
      if (cached) {
        setStretches(cached);
        setUsingCache(true);
      } else {
        setError('Cannot reach the server, and there is no saved copy on this device yet.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addStretch = async (draft) => {
    const created = await api.createStretch(draft);
    setStretches((current) => {
      const next = [...current, created];
      storage.saveStretchesToCache(next);
      return next;
    });
    return created;
  };

  const editStretch = async (id, changes) => {
    const updated = await api.updateStretch(id, changes);
    setStretches((current) => {
      const next = current.map((item) => (item.id === updated.id ? updated : item));
      storage.saveStretchesToCache(next);
      return next;
    });
    return updated;
  };

  const removeStretch = async (id) => {
    await api.deleteStretch(id);
    setStretches((current) => {
      const next = current.filter((item) => item.id !== id);
      storage.saveStretchesToCache(next);
      return next;
    });
  };

  const value = {
    stretches,
    loading,
    error,
    usingCache,
    reload: load,
    addStretch,
    editStretch,
    removeStretch,
  };

  return <StretchesContext.Provider value={value}>{children}</StretchesContext.Provider>;
}

export function useStretches() {
  const value = useContext(StretchesContext);
  if (!value) {
    throw new Error('useStretches must be used inside a StretchesProvider');
  }
  return value;
}