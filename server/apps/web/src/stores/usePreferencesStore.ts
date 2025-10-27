/**
 * User preferences store with localStorage persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Currency } from '../types';

interface PreferencesState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      currency: 'USD',
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'user-preferences',
    }
  )
);
