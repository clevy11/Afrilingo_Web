
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system' | string;

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove explicit light/dark first
    root.classList.remove('light', 'dark');

    // Remove any previous custom theme-* classes
    Array.from(root.classList)
      .filter((c) => c.startsWith('theme-'))
      .forEach((c) => root.classList.remove(c));

    // If theme is system, map to actual system preference
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);

      // clear inline variables in case a custom theme previously set them
      ['--background', '--foreground', '--card', '--card-foreground', '--border', '--input'].forEach((v) =>
        root.style.removeProperty(v)
      );

      return;
    }

    // If theme is a built-in (light/dark), apply it and clear custom CSS variables
    if (theme === 'light' || theme === 'dark') {
      root.classList.add(theme);
      ['--background', '--foreground', '--card', '--card-foreground', '--border', '--input'].forEach((v) =>
        root.style.removeProperty(v)
      );
      return;
    }

    // Otherwise treat it as a custom theme class name (e.g., 'theme-brown')
    root.classList.add(theme);
    // We don't remove inline variables here because custom themes may rely on them
  }, [theme]);

  const value = {
    theme,
    setTheme: (t: Theme) => {
      localStorage.setItem(storageKey, t);
      setTheme(t);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
