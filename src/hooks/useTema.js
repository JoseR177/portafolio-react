import { useEffect, useState } from "react";

const NOMBRE_ALMACEN = "tema";

function temaInicial() {
    try {
        const guardado = localStorage.getItem(NOMBRE_ALMACEN);
        if (guardado === "claro" || guardado === "oscuro") return guardado;
    } catch {
        return "oscuro";
    }

    if (typeof window !== "undefined" && window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: light)").matches ? "claro" : "oscuro";
    }
    return "oscuro";
}

export default function useTema() {
    const [tema, setTema] = useState(temaInicial);

    useEffect(() => {
        document.documentElement.setAttribute("data-tema", tema);
        try {
            localStorage.setItem(NOMBRE_ALMACEN, tema);
        } catch {
            // almacenamiento no disponible: no bloquear el cambio de tema
        }
    }, [tema]);

    return [tema, setTema];
}