import { useEffect, useState } from 'react';

export const useTheme = () => {
  // Obtenir le thème initial du localStorage ou utiliser 'light' comme valeur par défaut
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Appliquer le thème et l'enregistrer dans le localStorage
  useEffect(() => {
    const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-bs-theme', theme);
      localStorage.setItem('theme', theme);
    };

    applyTheme(theme);
  }, [theme]);

  return [theme, setTheme];
};
