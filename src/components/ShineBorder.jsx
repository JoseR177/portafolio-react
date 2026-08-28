/**
 * ShineBorder
 *
 * Borde animado con efecto de brillo. Debe colocarse dentro de un
 * contenedor con `position: relative` y `overflow: hidden`.
 */
export default function ShineBorder({
    borderWidth = 1,
    duration = 14,
    shineColor = "#000000",
    className = "",
    style,
    ...props
}) {
    return (
        <div
            style={{
                "--border-width": `${borderWidth}px`,
                "--duration": `${duration}s`,
                backgroundImage: `radial-gradient(transparent, transparent, ${
                    Array.isArray(shineColor) ? shineColor.join(",") : shineColor
                }, transparent, transparent)`,
                backgroundSize: "300% 300%",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                padding: "var(--border-width)",
                ...style,
            }}
            className={`shine-border${className ? ` ${className}` : ""}`}
            aria-hidden="true"
            {...props}
        />
    );
}