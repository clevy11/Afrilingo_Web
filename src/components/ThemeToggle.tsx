
import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/components/ThemeProvider';

const themes = [
  { name: 'Light Mode', key: 'light', primary: 'bg-amber-800', secondary: 'bg-amber-50', icon: Sun },
  { name: 'Dark Mode', key: 'dark', primary: 'bg-gray-800', secondary: 'bg-gray-100', icon: Moon },
  { name: 'System', key: 'system', primary: 'bg-slate-700', secondary: 'bg-slate-100', icon: Sun },
  { name: 'Warm Brown', key: 'theme-brown', primary: 'bg-amber-900', secondary: 'bg-amber-100', icon: Sun },
  { name: 'Rich Mahogany', key: 'theme-mahogany', primary: 'bg-red-900', secondary: 'bg-red-100', icon: Sun }
];

const ThemeToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme: currentTheme, setTheme } = useTheme();
  const [activeTheme, setActiveTheme] = useState<string>(() =>
    currentTheme && ['light', 'dark', 'system'].includes(currentTheme) ? currentTheme : 'light'
  );

  const changeTheme = (key: string) => {
    const root = document.documentElement;

    // Remove any custom theme-* classes first
    themes
      .map((t) => t.key)
      .filter(Boolean)
      .forEach((k) => {
        if (k.startsWith('theme-')) root.classList.remove(k);
      });

    // Built-in themes go through provider
    if (key === 'light' || key === 'dark' || key === 'system') {
      // Clear inline CSS variables left by custom themes
      ['--background', '--foreground', '--card', '--card-foreground', '--border', '--input'].forEach((v) =>
        root.style.removeProperty(v)
      );
      setTheme(key as any);
      setActiveTheme(key);
      setIsOpen(false);
      return;
    }

    // Otherwise apply custom theme class and set CSS vars
    root.classList.add(key);
    switch (key) {
      case 'theme-brown':
        root.style.setProperty('--background', '39 100% 97%');
        root.style.setProperty('--foreground', '39 100% 15%');
        root.style.setProperty('--card', '0 0% 100%');
        root.style.setProperty('--card-foreground', '39 100% 15%');
        root.style.setProperty('--border', '39 15% 85%');
        root.style.setProperty('--input', '39 15% 85%');
        break;
      case 'theme-mahogany':
        root.style.setProperty('--background', '0 100% 97%');
        root.style.setProperty('--foreground', '0 100% 15%');
        root.style.setProperty('--card', '0 0% 100%');
        root.style.setProperty('--card-foreground', '0 100% 15%');
        root.style.setProperty('--border', '0 15% 85%');
        root.style.setProperty('--input', '0 15% 85%');
        break;
      default:
        break;
    }

    setActiveTheme(key);
    setIsOpen(false);
  };

  const activeThemeData = themes.find((t) => t.key === activeTheme) || themes[0];
  const ActiveIcon = activeThemeData.icon;

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 left-6 h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-50"
        size="icon"
      >
        <ActiveIcon className="h-5 w-5" />
      </Button>

      {isOpen && (
  <Card className="fixed bottom-40 left-6 w-64 shadow-2xl z-40 border-2 border-border bg-card">
          <CardContent className="p-4">
            <h3 className="font-semibold text-amber-900 mb-4">App Appearance</h3>
            <div className="space-y-2">
              {themes.map((theme) => {
                const ThemeIcon = theme.icon;
                return (
                  <button
                    key={theme.key}
                    onClick={() => changeTheme(theme.key)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeTheme === theme.key
                        ? 'bg-card/80 border-2 border-border'
                        : 'hover:bg-card/95 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex gap-1 items-center">
                      <ThemeIcon className="h-4 w-4 text-amber-800" />
                      <div className={`w-4 h-4 rounded-full ${theme.primary}`}></div>
                      <div className={`w-4 h-4 rounded-full ${theme.secondary}`}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground">{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ThemeToggle;
