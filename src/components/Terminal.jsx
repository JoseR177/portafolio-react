import { useEffect, useRef, useState } from "react";

const LINEAS = [
    { tipo: "typing", texto: "jose@dev:~$ whoami" },
    { tipo: "fade", texto: "Jose — Desarrollador en formación" },
    { tipo: "typing", texto: "jose@dev:~$ habilidades" },
    { tipo: "fade", texto: "> HTML5 · CSS3 · JavaScript · Git" },
    { tipo: "typing", texto: "jose@dev:~$ proyecto_actual" },
    { tipo: "fade", texto: "> NeuroRisk — IA anti-crisis" },
    { tipo: "fade", texto: "> Fase: prototipo con monitoreo simulado" },
];

const VELOCIDAD_TECLEO = 60; // ms por carácter
const DURACION_FADE = 350; // ms que dura el fade de cada línea

export default function Terminal() {
    const contenedorRef = useRef(null);
    const [iniciado, setIniciado] = useState(false);
    const [terminadas, setTerminadas] = useState(0);
    const [escritura, setEscritura] = useState(() => LINEAS.map(() => ""));

    // Empieza la secuencia cuando el terminal entra en pantalla
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entradas) => {
                for (const entrada of entradas) {
                    if (entrada.isIntersecting) {
                        setIniciado(true);
                        observer.disconnect();
                    }
                }
            },
            { threshold: 0.3 }
        );
        if (contenedorRef.current) observer.observe(contenedorRef.current);
        return () => observer.disconnect();
    }, []);

    // Avanza la secuencia: teclea o muestra cada línea cuando llega su turno
    useEffect(() => {
        if (!iniciado || terminadas >= LINEAS.length) return;

        const linea = LINEAS[terminadas];

        if (linea.tipo === "typing") {
            let i = 0;
            const intervalo = setInterval(() => {
                i++;
                setEscritura((prev) => {
                    const copia = [...prev];
                    copia[terminadas] = linea.texto.substring(0, i);
                    return copia;
                });
                if (i >= linea.texto.length) {
                    clearInterval(intervalo);
                    setTerminadas((n) => n + 1);
                }
            }, VELOCIDAD_TECLEO);
            return () => clearInterval(intervalo);
        }

        const temporizador = setTimeout(
            () => setTerminadas((n) => n + 1),
            DURACION_FADE
        );
        return () => clearTimeout(temporizador);
    }, [iniciado, terminadas]);

    return (
        <div className="terminal" ref={contenedorRef}>
            <div className="terminal-barra">
                <span className="terminal-punto rojo"></span>
                <span className="terminal-punto amarillo"></span>
                <span className="terminal-punto verde"></span>
            </div>
            <pre>
                <code>
                    {LINEAS.map((linea, i) => {
                        if (i > terminadas) return null;
                        const esActiva = iniciado && i === terminadas;

                        if (linea.tipo === "typing") {
                            return (
                                <span
                                    key={i}
                                    className={"linea-typing" + (esActiva ? " activa" : "")}
                                >
                                    {escritura[i]}
                                </span>
                            );
                        }

                        return (
                            <span key={i} className="linea-fade visible">
                                {linea.texto}
                            </span>
                        );
                    })}
                </code>
            </pre>
        </div>
    );
}