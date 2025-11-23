"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AccessibilityContextType {
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  fontSizeLevel: number;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(() => {
    // Carregar preferência inicial do localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fontSizeLevel");
      if (saved) {
        const level = parseInt(saved, 10);
        if (!isNaN(level)) {
          return level;
        }
      }
    }
    return 0; // 0 = tamanho padrão (100%)
  });

  useEffect(() => {
    // Salvar preferência no localStorage
    localStorage.setItem("fontSizeLevel", fontSizeLevel.toString());

    // Aplicar tamanho de fonte no elemento raiz (html)
    // Cada nível aumenta/diminui 12.5% (equivalente a 2px se base for 16px)
    // Nível 0 = 100%, Nível 1 = 112.5%, Nível -1 = 87.5%
    const percentage = 100 + fontSizeLevel * 12.5;

    // Aplicar no elemento html para afetar todos os rem/em do Tailwind
    document.documentElement.style.fontSize = `${percentage}%`;

    // Também aplicar no body como fallback
    document.body.style.fontSize = `${percentage}%`;
  }, [fontSizeLevel]);

  const increaseFontSize = () => {
    setFontSizeLevel((current) => Math.min(current + 1, 4)); // Máximo 4 níveis (150%)
  };

  const decreaseFontSize = () => {
    setFontSizeLevel((current) => Math.max(current - 1, -2)); // Mínimo -2 níveis (75%)
  };

  const resetFontSize = () => {
    setFontSizeLevel(0);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        fontSizeLevel,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within AccessibilityProvider"
    );
  }
  return context;
}
