import { useEffect, useState } from "react";
import FlipUnit from "../../../../player/onboarding/components/countdown/FlipUnit";

const getTimeRemaining = (targetDate) => {
    if (!targetDate) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
    }

    const target = new Date(targetDate).getTime();
    const now = Date.now();

    if (Number.isNaN(target)) {
        console.error("Invalid countdown date:", targetDate);

        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
    }

    const difference = target - now;

    if (difference <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
    }

    return {
        days: Math.floor(
            difference / (1000 * 60 * 60 * 24)
        ),

        hours: Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        ),

        minutes: Math.floor(
            (difference / (1000 * 60)) % 60
        ),

        seconds: Math.floor(
            (difference / 1000) % 60
        ),
    };
};

const RegistrationCountdown = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState(() =>
        getTimeRemaining(targetDate)
    );

    useEffect(() => {
        if (!targetDate) return;

        const updateCountdown = () => {
            setTimeLeft(getTimeRemaining(targetDate));
        };

        updateCountdown();

        const interval = setInterval(
            updateCountdown,
            1000
        );

        return () => {
            clearInterval(interval);
        };
    }, [targetDate]);

    return (
        <div className="flex items-start gap-2">
            <FlipUnit
                value={timeLeft.days}
                label="Days"
            />

            <FlipUnit
                value={timeLeft.hours}
                label="Hrs"
            />

            <FlipUnit
                value={timeLeft.minutes}
                label="Min"
            />

            <FlipUnit
                value={timeLeft.seconds}
                label="Sec"
            />
        </div>
    );
};

export default RegistrationCountdown;