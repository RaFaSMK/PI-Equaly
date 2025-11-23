"use client";

import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useEffect, useState } from "react";

export default function AccessibilityBar() {
  const { increaseFontSize, decreaseFontSize, resetFontSize, fontSizeLevel } =
    useAccessibility();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calcular porcentagem para exibir
  const percentage = 100 + fontSizeLevel * 12.5;
  const displayPercentage = mounted ? percentage : 100; // evita divergência SSR/CSR

  return (
    <div className="bg-zinc-50 border-b border-zinc-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-1.5 sm:px-4 sm:py-2">
        <div className="flex items-center gap-2 text-zinc-700">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#755fe3]/10 text-[#4f3dd3] text-xs font-bold">
            A
          </span>
          <span className="text-xs sm:text-sm font-medium">
            Ajuste de leitura
          </span>
          <span className="hidden md:inline text-xs text-zinc-500">
            Tamanho e conforto visual
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span
            suppressHydrationWarning
            className="hidden md:inline text-[11px] font-semibold text-zinc-700 bg-white px-2 py-0.5 rounded border border-[#755fe3]/40 min-w-[3rem] text-center"
          >
            {displayPercentage}%
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1 rounded-md bg-white ring-1 ring-inset ring-[#755fe3]/30">
            <button
              onClick={decreaseFontSize}
              disabled={fontSizeLevel <= -2}
              className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold text-[#4f3dd3] hover:bg-[#755fe3] hover:text-white transition-colors rounded-l-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              aria-label="Diminuir tamanho da fonte"
              title="Diminuir tamanho da fonte"
            >
              A-
            </button>
            <button
              onClick={resetFontSize}
              suppressHydrationWarning
              className={`px-2 py-0.5 sm:px-3 sm:py-1 text-sm sm:text-base font-semibold border-x border-[#755fe3]/30 transition-colors ${
                fontSizeLevel === 0
                  ? "bg-[#755fe3] text-white hover:bg-[#6550d3]"
                  : "text-[#4f3dd3] hover:bg-[#755fe3] hover:text-white"
              }`}
              aria-label="Tamanho padrão da fonte"
              title="Tamanho padrão da fonte"
            >
              A
            </button>
            <button
              onClick={increaseFontSize}
              disabled={fontSizeLevel >= 4}
              className="px-2 py-0.5 sm:px-3 sm:py-1 text-base sm:text-lg font-semibold text-[#4f3dd3] hover:bg-[#755fe3] hover:text-white transition-colors rounded-r-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
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
