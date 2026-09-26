import { useEffect, useState } from "react";

export default function FlipUnit({ value, label }) {
    
    const formatted = String(value).padStart(2, "0");

    const [current, setCurrent] = useState(formatted);
    const [flipping, setFlipping] = useState(false);

    useEffect(() => {
        if (formatted === current) return;

        setFlipping(true);

        const timer = setTimeout(() => {
            setCurrent(formatted);
            setFlipping(false);
        }, 180);

        return () => clearTimeout(timer);
    }, [formatted, current]);

    return (
        <div className="flex flex-col items-center gap-1">

            {/* Fixed card */}
            <div className="relative h-8 w-11 overflow-hidden rounded-md border border-white/10 bg-[#171719] shadow-[0_5px_15px_rgba(0,0,0,0.35)]">

                {/* Number */}
                <div
                    key={current}
                    className={`absolute inset-0 flex items-center justify-center font-['Rajdhani'] text-[18px] font-bold text-white ${
                        flipping ? "flip-out" : "flip-in"
                    }`}
                >
                    {current}
                </div>

                {/* Center split */}
                <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px bg-black/50" />

                {/* Top highlight */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-1/2 bg-gradient-to-b from-white/[0.04] to-transparent" />
            </div>

            <span className="font-['Barlow_Condensed'] text-[6px] font-semibold uppercase tracking-[0.16em] text-white/30">
                {label}
            </span>
        </div>
    );
}