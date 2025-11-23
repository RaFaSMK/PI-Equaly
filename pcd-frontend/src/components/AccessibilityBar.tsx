"use client";

import { useAccessibility } from "@/contexts/AccessibilityContext";

export default function AccessibilityBar() {
  const { increaseFontSize, decreaseFontSize, resetFontSize, fontSizeLevel } =
    useAccessibility();

  // Calcular porcentagem para exibir
  const percentage = 100 + fontSizeLevel * 12.5;

  return (
    <div className="bg-zinc-50 border-b border-zinc-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-1.5 sm:px-4 sm:py-2">
        <span className="text-xs sm:text-sm font-medium text-zinc-700">
          Acessibilidade
        </span>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xs text-zinc-600 hidden sm:inline">
            Tamanho da fonte:
          </span>
          <span className="text-xs text-zinc-500 font-medium hidden md:inline min-w-[3rem] text-right">
            {percentage}%
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1 bg-white border border-zinc-300 rounded-md">
            <button
              onClick={decreaseFontSize}
              disabled={fontSizeLevel <= -2}
              className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors rounded-l-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              aria-label="Diminuir tamanho da fonte"
              title="Diminuir tamanho da fonte"
            >
              A-
            </button>
            <button
              onClick={resetFontSize}
              className={`px-2 py-0.5 sm:px-3 sm:py-1 text-sm sm:text-base font-semibold hover:bg-zinc-100 border-x border-zinc-300 transition-colors ${
                fontSizeLevel === 0
                  ? "bg-[#755fe3] text-white hover:bg-[#6550d3]"
                  : "text-zinc-700"
              }`}
              aria-label="Tamanho padrão da fonte"
              title="Tamanho padrão da fonte"
            >
              A
            </button>
            <button
              onClick={increaseFontSize}
              disabled={fontSizeLevel >= 4}
              className="px-2 py-0.5 sm:px-3 sm:py-1 text-base sm:text-lg font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors rounded-r-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              aria-label="Aumentar tamanho da fonte"
              title="Aumentar tamanho da fonte"
            >
              A+
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
