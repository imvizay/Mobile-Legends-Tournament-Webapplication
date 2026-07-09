import { useEffect, useState } from "react";

export default function FlipDigit({ value }) {
    const [current, setCurrent] = useState(value);
    const [flipping, setFlipping] = useState(false);

    useEffect(() => {
        if (value === current) return;

        setFlipping(true);

        const timer = setTimeout(() => {
            setCurrent(value);
            setFlipping(false);
        }, 180);

        return () => clearTimeout(timer);
    }, [value, current]);

    return (
        <div className="relative h-7 w-6 overflow-hidden rounded-md border border-white/10 bg-white/[0.06]">
            <div
                className={`absolute inset-0 flex items-center justify-center font-['Rajdhani'] text-[17px] font-bold text-white transition-transform duration-200 ${
                    flipping
                        ? "-translate-y-full opacity-0"
                        : "translate-y-0 opacity-100"
                }`}
            >
                {String(current).padStart(2, "0")}
            </div>

            {flipping && (
                <div className="absolute inset-0 flex translate-y-full items-center justify-center font-['Rajdhani'] text-[17px] font-bold text-[var(--accent-gold)] transition-transform duration-200">
                    {String(value).padStart(2, "0")}
                </div>
            )}

            {/* Middle split */}
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/30" />
        </div>
    );
}