import { useMemo } from "react";

function generarEstilos({ number, minDelay, maxDelay, minDuration, maxDuration }) {
    return [...new Array(number)].map(() => ({
        top: (Math.random() * 100) + "%",
        left: (Math.random() * 95) + "%",
        animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + "s",
        animationDuration:
            Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) + "s",
    }));
}

export default function Meteors({
    number = 20,
    minDelay = 0.2,
    maxDelay = 1.2,
    minDuration = 2,
    maxDuration = 10,
    className = "",
}) {
    const meteorStyles = useMemo(
        () => generarEstilos({ number, minDelay, maxDelay, minDuration, maxDuration }),
        [number, minDelay, maxDelay, minDuration, maxDuration]
    );

    return (
        <>
            {meteorStyles.map((meteor, idx) => (
                <span
                    key={idx}
                    className={`meteor pointer-events-none${className ? ` ${className}` : ""}`}
                    style={{
                        top: meteor.top,
                        left: meteor.left,
                        animationDelay: meteor.animationDelay,
                        animationDuration: meteor.animationDuration,
                    }}
                    aria-hidden="true"
                >
                    <div className="meteor-cola" />
                </span>
            ))}
        </>
    );
}
