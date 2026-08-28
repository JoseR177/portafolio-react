import { Children, cloneElement, isValidElement, useRef } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "motion/react";

const TAMANO_DEFECTO = 40;
const MAGNIFICACION_DEFECTO = 60;
const DISTANCIA_DEFECTO = 140;

export function Dock({
    children,
    iconSize = TAMANO_DEFECTO,
    iconMagnification = MAGNIFICACION_DEFECTO,
    disableMagnification = false,
    iconDistance = DISTANCIA_DEFECTO,
    direction = "middle",
    className = "",
}) {
    const mouseX = useMotionValue(Infinity);

    const renderChildren = () =>
        Children.map(children, (child) => {
            if (isValidElement(child) && child.type === DockIcon) {
                return cloneElement(child, {
                    ...child.props,
                    mouseX: mouseX,
                    size: iconSize,
                    magnification: iconMagnification,
                    disableMagnification: disableMagnification,
                    distance: iconDistance,
                });
            }
            return child;
        });

    const alineado =
        direction === "top"
            ? "items-start"
            : direction === "bottom"
              ? "items-end"
              : "items-center";

    return (
        <motion.div
            onMouseMove={(evento) => mouseX.set(evento.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={`dock ${alineado}${className ? ` ${className}` : ""}`}
        >
            {renderChildren()}
        </motion.div>
    );
}

export function DockIcon({
    size = TAMANO_DEFECTO,
    magnification = MAGNIFICACION_DEFECTO,
    disableMagnification = false,
    distance = DISTANCIA_DEFECTO,
    mouseX,
    className = "",
    children,
    ...props
}) {
    const ref = useRef(null);
    const padding = Math.max(6, size * 0.2);
    const mouseXDefecto = useMotionValue(Infinity);

    const distanciaAlCursor = useTransform(mouseX ?? mouseXDefecto, (valor) => {
        const limites = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return valor - limites.x - limites.width / 2;
    });

    const tamanoObjetivo = disableMagnification ? size : magnification;

    const cambioTamano = useTransform(
        distanciaAlCursor,
        [-distance, 0, distance],
        [size, tamanoObjetivo, size]
    );

    const tamanoAnimado = useSpring(cambioTamano, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    return (
        <motion.div
            ref={ref}
            style={{ width: tamanoAnimado, height: tamanoAnimado, padding }}
            className={`dock-icon${className ? ` ${className}` : ""}`}
            {...props}
        >
            <div>{children}</div>
        </motion.div>
    );
}