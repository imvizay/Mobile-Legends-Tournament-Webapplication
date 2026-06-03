import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeToggle() {
  const {theme,toggleTheme} = useTheme()
  
  if(!theme) return
  const dark = theme == "dark" ;

  console.log("Perfered Theme:",theme)

  return (
    <button
      onClick={toggleTheme}
      className="
        relative
        flex items-center
        w-[80px] h-[40px] p-[4px]

        bg-[var(--glass-navbar)] backdrop-blur-xl

        rounded-full border border-[var(--border-default)] shadow-[0_4px_20px_rgba(0,0,0,0.08)]
        transition-all duration-300
      "
    >
      {/* Slider */}
      <div
        className={`
          absolute top-[4px] w-[30px] h-[30px]
          rounded-full

         bg-[var(--toggle-thumb)] shadow-[0_4px_12px_rgba(0,0,0,0.15)]

          flex items-center justify-center
          transition-all duration-300 ease-in

          ${ dark ? "translate-x-[44px]" : "translate-x-0" }
        `}
      >
        {dark ? (
          <Moon size={18} strokeWidth={2.5} className="text-[var(--toggle-moon)]" />
        ) : (
          <Sun size={18} strokeWidth={2.5} className="text-[var(--toggle-sun)]" />
        )}
      </div>

      {/* Icons */}
      <div className="w-full flex justify-between px-[10px]">
        <Sun
          size={18}
          className={`
            text-[var(--toggle-sun)]
            transition-opacity
            duration-300
            ${dark ? "opacity-30" : "opacity-100"}
          `}
        />

        <Moon
          size={18}
          className={`
            text-[var(--toggle-moon)]
            transition-opacity
            duration-300
            ${dark ? "opacity-100" : "opacity-30"}
          `}
        />
      </div>
    </button>
  );
}