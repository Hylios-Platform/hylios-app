import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      // Verificar preferência salva no localStorage
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) return savedTheme;

      // Verificar preferência do sistema
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }

      return 'light';
    } catch {
      // Fallback se localStorage não estiver disponível
      return 'light';
    }
  });

  useEffect(() => {
    try {
      // Salvar preferência no localStorage
      localStorage.setItem('theme', theme);

      // Aplicar classe ao elemento root
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);

      // Adicionar classe de transição
      root.classList.add('transition-colors', 'duration-300');
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
}