
import { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/components/ThemeProvider';

const themes = [
  { name: 'Light Mode', key: 'light', icon: Sun, desc: 'Warm amber theme' },
  { name: 'Dark Mode', key: 'dark', icon: Moon, desc: 'Easy on the eyes' },
  { name: 'System', key: 'system', icon: Monitor, desc: 'Match your OS' },
];

const ThemeToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme: currentTheme, setTheme } = useTheme();
  const activeTheme = currentTheme && ['light', 'dark', 'system'].includes(currentTheme) ? currentTheme : 'light';

  const changeTheme = (key: string) => {
    setTheme(key as any);
    setIsOpen(false);
  };

  const activeThemeData = themes.find((t) => t.key === activeTheme) || themes[0];
  const ActiveIcon = activeThemeData.icon;

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 left-6 h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-50 transition-transform hover:scale-110"
        size="icon"
      >
        <ActiveIcon className="h-5 w-5" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <Card className="fixed bottom-40 left-6 w-64 shadow-2xl z-50 border-2 border-border bg-card">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-1">Appearance</h3>
              <p className="text-xs text-muted-foreground mb-4">Choose your preferred theme</p>
              <div className="space-y-1.5">
                {themes.map((theme) => {
                  const ThemeIcon = theme.icon;
                  const isActive = activeTheme === theme.key;
                  return (
                    <button
                      key={theme.key}
                      onClick={() => changeTheme(theme.key)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${isActive
                          ? 'bg-primary/10 border-2 border-primary/30 shadow-sm'
                          : 'hover:bg-accent border-2 border-transparent'
                        }`}
                    >
                      <div className={`p-2 rounded-lg ${isActive
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                        }`}>
                        <ThemeIcon className="h-4 w-4" />
                      </div>
                      <div className="text-left flex-1">
                        <span className={`text-sm font-medium block ${isActive ? 'text-primary' : 'text-foreground'
                          }`}>
                          {theme.name}
                        </span>
                        <span className="text-xs text-muted-foreground">{theme.desc}</span>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

export default ThemeToggle;
