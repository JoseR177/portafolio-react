import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    Activity,
    AlertTriangle,
    Battery,
    Bell,
    Heart,
    Play,
    RotateCcw,
    Siren,
    Square,
    Zap,
} from "lucide-react";
import Footer from "../components/Footer";
import FadeIn from "../components/FadeIn";
import ShineBorder from "../components/ShineBorder";
import { detenerAlarma, prepararAudio, tocarAlarma } from "../utils/alarma";

const LIMITE_ALTO = 65;
const LIMITE_MODERADO = 35;

const RECOMENDACIONES = {
    bajo: [
        "Todo en orden. Mantén tus horarios de sueño y toma tu medicación como lo indique tu médico.",
        "Sigue con tus actividades habituales, pero evita el estrés acumulado.",
    ],
    moderado: [
        "Riesgo moderado: reduce estímulos intensos (luces, ruido) y haz una pausa de 15 minutos.",
        "Hidrátate, respira lento y avísale a alguien de confianza dónde estás.",
        "Ten a la mano tu plan de acción o medicación de rescate si tu médico la indicó.",
    ],
    alto: [
        "Riesgo alto: siéntate o acuéstate en un lugar seguro y alejado de objetos peligrosos.",
        "No manejes ni cruces calles. Quédate acompañado si es posible.",
        "Activa tu contacto de emergencia y sigue tu plan de acción para crisis.",
    ],
};

export default function NeuroRisk() {
    const [activo, setActivo] = useState(false);
    const [señales, setSeñales] = useState({ frecuencia: 78, movimiento: 30, fatiga: 35, aura: false });
    const [riesgo, setRiesgo] = useState(14);
    const [historial, setHistorial] = useState([]);
    const [alarmaActiva, setAlarmaActiva] = useState(false);
    const [notifPermiso, setNotifPermiso] = useState("default");
    const [sosConfirmado, setSosConfirmado] = useState(false);
    const [abierto, setAbierto] = useState(null);
    const [contacto, setContacto] = useState(() => {
        try {
            const guardado = JSON.parse(localStorage.getItem("nr-contacto"));
            return guardado || { nombre: "", telefono: "" };
        } catch {
            return { nombre: "", telefono: "" };
        }
    });

    const señalesRef = useRef(señales);
    const contadorAura = useRef(0);
    const disparadaRef = useRef(false);

    const nivel = riesgo >= LIMITE_ALTO ? "alto" : riesgo >= LIMITE_MODERADO ? "moderado" : "bajo";
    const colorNivel =
        nivel === "alto" ? "var(--peligro)" : nivel === "moderado" ? "var(--destacar)" : "var(--ideal)";

    useEffect(() => {
        señalesRef.current = señales;
    }, [señales]);

    useEffect(() => () => detenerAlarma(), []);

    useEffect(() => {
        if (!activo) return;

        const temporizador = setInterval(() => {
            const prev = señalesRef.current;

            let frecuencia = Math.max(60, Math.min(135, prev.frecuencia + (Math.random() * 14 - 7)));
            let movimiento = Math.max(0, Math.min(100, prev.movimiento + (Math.random() * 26 - 13)));
            const fatiga = Math.max(0, Math.min(100, prev.fatiga + (Math.random() * 8 - 4)));
            let aura = prev.aura;

            if (aura) {
                contadorAura.current -= 1;
                if (contadorAura.current <= 0) aura = false;
            } else if (Math.random() < 0.06) {
                aura = true;
                contadorAura.current = 3;
                frecuencia = Math.min(135, frecuencia + 35);
                movimiento = Math.min(100, movimiento + 30);
            }

            const siguientes = {
                frecuencia: Math.round(frecuencia),
                movimiento: Math.round(movimiento),
                fatiga: Math.round(fatiga),
                aura,
            };

            señalesRef.current = siguientes;
            setSeñales(siguientes);

            const r = calcularRiesgo(siguientes);
            setRiesgo(r);
            setHistorial((h) => [...h, Math.round(r)].slice(-30));
        }, 1500);

        return () => clearInterval(temporizador);
    }, [activo]);

    useEffect(() => {
        if (nivel === "alto" && !disparadaRef.current) {
            disparadaRef.current = true;
            setAlarmaActiva(true);
            tocarAlarma();
            notificar(
                "NeuroRisk — Riesgo alto",
                "Riesgo estimado alto de una posible crisis. Abre la app y sigue tus recomendaciones."
            );
        } else if (nivel !== "alto") {
            disparadaRef.current = false;
        }
    }, [nivel]);

    function notificar(titulo, cuerpo) {
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification(titulo, { body: cuerpo, icon: "favicon.svg" });
        }
    }

    async function pedirPermisoNotificaciones() {
        if (typeof Notification === "undefined") return;
        const permiso = await Notification.requestPermission();
        setNotifPermiso(permiso);
    }

    function iniciar() {
        prepararAudio();
        setActivo(true);
    }

    function detener() {
        setActivo(false);
        detenerAlarma();
        setAlarmaActiva(false);
        if (sosConfirmado) setSosConfirmado(false);
    }

    function simularCrisis() {
        prepararAudio();
        const siguientes = { frecuencia: 128, movimiento: 88, fatiga: 80, aura: true };
        señalesRef.current = siguientes;
        setSeñales(siguientes);
        setRiesgo(88);
        setHistorial((h) => [...h, 88].slice(-30));
    }

    function probarAlarma() {
        prepararAudio();
        tocarAlarma();
        setAlarmaActiva(true);
        notificar("NeuroRisk — Prueba de alarma", "Así se ve una alerta de riesgo alto.");
    }

    function reconocerAlarma() {
        detenerAlarma();
        setAlarmaActiva(false);
    }

    function activarSOS() {
        prepararAudio();
        tocarAlarma();
        setAlarmaActiva(true);
        setSosConfirmado(true);
        notificar("NeuroRisk — SOS", "Alarma SOS activada. Avisando a tu contacto de emergencia.");

        if (contacto.telefono) {
            const texto = encodeURIComponent(
                "¡Hola " +
                    (contacto.nombre || "amigo") +
                    "! Te escribo desde NeuroRisk. Necesito ayuda: existe riesgo de una crisis epiléptica. ⚠️"
            );
            window.open("https://wa.me/" + contacto.telefono + "?text=" + texto, "_blank", "noopener");
        }
    }

    function guardarContacto() {
        try {
            localStorage.setItem("nr-contacto", JSON.stringify(contacto));
        } catch {
            // almacenamiento no disponible
        }
    }

    return (
        <>
            <Link to="/" className="volver-flotante" aria-label="Volver al inicio">
                ← Volver
            </Link>

            <main>
                <section className="epilepsia-hero">
                    <FadeIn>
                        <div className="epilepsia-hero-info">
                            <span className="proyecto-badge">Prototipo — Monitoreo simulado</span>
                            <h1>NeuroRisk</h1>
                            <p>
                                La app te ayuda a saber cuándo podrías estar cerca de una crisis epiléptica.
                                Una IA integrada analiza señales de tu cuerpo y activa recomendaciones,
                                notificaciones y alarmas cuando el riesgo es alto.
                            </p>
                            <div className="hero-botones izquierda">
                                <a href="#app-monitor" className="boton-primario">Probar la app</a>
                                <a href="#como-funciona" className="boton-secundario">Cómo funciona</a>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <div className="epilepsia-estado">
                            <ShineBorder
                                borderWidth={1}
                                duration={8}
                                shineColor={["#00ff9d", "#ffd60a"]}
                            />
                            <h3>Estado del proyecto</h3>
                            <p className="estado-fase">
                                Fase actual: <strong>Prototipo simulado</strong>
                            </p>
                            <BarraProgreso etiqueta="Investigación" valor={100} color="#00ff9d" />
                            <BarraProgreso etiqueta="Definición técnica" valor={100} color="#00ff9d" />
                            <BarraProgreso etiqueta="Prototipo simulado" valor={60} color="#ffd60a" />
                            <p className="estado-nota">
                                Progreso estimado. NeuroRisk solo simula señales; la detección real
                                requeriría sensores certificados.
                            </p>
                        </div>
                    </FadeIn>
                </section>

                <section id="app-monitor">
                    <span className="seccion-etiqueta">La app</span>
                    <h2>Monitoreo en vivo</h2>
                    <p className="seccion-expl">
                        Este prototipo simula señales fisiológicas en tiempo real. La IA estima tu
                        riesgo de crisis y, si es alto, dispara una alarma sonora, una notificación
                        y recomendaciones. Pulsa <strong>Iniciar</strong> para verlo funcionar.
                    </p>

                    <div className="nr-grid">
                        <FadeIn>
                            <div className="nr-tarjeta">
                                <div className="nr-cabecera">
                                    <span className={"nr-estado" + (activo ? " on" : "")}>
                                        {activo ? "● MONITOREO ACTIVO" : "○ MONITOREO EN PAUSA"}
                                    </span>
                                    <div className="nr-controles">
                                        {!activo ? (
                                            <button className="nr-btn" onClick={iniciar}>
                                                <Play size={16} /> Iniciar
                                            </button>
                                        ) : (
                                            <button className="nr-btn" onClick={detener}>
                                                <Square size={16} /> Detener
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="nr-nivel" style={{ borderColor: colorNivel }}>
                                    <span className="nr-nivel-texto">
                                        {nivel === "alto" ? "⚠ Riesgo alto" : nivel === "moderado" ? "▲ Riesgo moderado" : "✓ Riesgo bajo"}
                                    </span>
                                    <span className="nr-nivel-numero" style={{ color: colorNivel }}>
                                        {riesgo}<small>%</small>
                                    </span>
                                    <div className="nr-medidor">
                                        <div
                                            className="nr-gauge-fill"
                                            style={{ width: riesgo + "%", background: colorNivel }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="nr-señales">
                                    <Señal
                                        icono={<Heart size={16} />}
                                        etiqueta="Frecuencia cardíaca"
                                        valor={señales.frecuencia}
                                        unidad=" bpm"
                                        max={135}
                                        min={60}
                                    />
                                    <Señal
                                        icono={<Activity size={16} />}
                                        etiqueta="Movimiento"
                                        valor={señales.movimiento}
                                        unidad="%"
                                        max={100}
                                        min={0}
                                    />
                                    <Señal
                                        icono={<Battery size={16} />}
                                        etiqueta="Fatiga"
                                        valor={señales.fatiga}
                                        unidad="%"
                                        max={100}
                                        min={0}
                                    />
                                    <div className={"nr-aura" + (señales.aura ? " activo" : "")}>
                                        <Zap size={16} />
                                        {señales.aura ? "Aura detectada — riesgo elevado" : "Sin aura detectada"}
                                    </div>
                                </div>

                                <div className="nr-historial">
                                    <span className="nr-historial-titulo">últimas lecturas</span>
                                    <div className="nr-histograma">
                                        {historial.length === 0 && (
                                            <span className="nr-vacio">— esperando datos —</span>
                                        )}
                                        {historial.map((v, i) => (
                                            <span
                                                key={i}
                                                style={{
                                                    height: Math.max(6, v) + "%",
                                                    background:
                                                        v >= LIMITE_ALTO
                                                            ? "var(--peligro)"
                                                            : v >= LIMITE_MODERADO
                                                              ? "var(--destacar)"
                                                              : "var(--ideal)",
                                                }}
                                            ></span>
                                        ))}
                                    </div>
                                </div>

                                <div className="nr-actions">
                                    <button className="nr-btn peligro" onClick={simularCrisis}>
                                        <Zap size={16} /> Simular crisis
                                    </button>
                                    <button className="nr-btn" onClick={probarAlarma}>
                                        <Bell size={16} /> Probar alarma
                                    </button>
                                    {notifPermiso === "granted" ? (
                                        <button className="nr-btn" disabled>
                                            <Bell size={16} /> Notificaciones activas
                                        </button>
                                    ) : (
                                        <button className="nr-btn" onClick={pedirPermisoNotificaciones}>
                                            <AlertTriangle size={16} />
                                            {notifPermiso === "denied" ? "Permiso denegado" : "Activar notificaciones"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.1}>
                            <div className="nr-tarjeta">
                                <h3 className="nr-tarjeta-titulo">Recomendación de la IA</h3>
                                <ul className="nr-recomendaciones" key={nivel}>
                                    {RECOMENDACIONES[nivel].map((texto, i) => (
                                        <li key={i} style={{ borderColor: colorNivel }}>
                                            <span className="nr-rec-caja" style={{ background: colorNivel }}>
                                                {nivel === "alto" ? "!" : String(i + 1).padStart(2, "0")}
                                            </span>
                                            {texto}
                                        </li>
                                    ))}
                                </ul>
                                <p className="nr-aviso">
                                    Las recomendaciones son educativas y no sustituyen indicación médica.
                                </p>
                            </div>

                            <div className="nr-tarjeta">
                                <h3 className="nr-tarjeta-titulo">Contacto de emergencia</h3>
                                <label className="nr-label" htmlFor="nr-nombre">Nombre</label>
                                <input
                                    id="nr-nombre"
                                    className="nr-input"
                                    type="text"
                                    placeholder="Ej: mamá"
                                    value={contacto.nombre}
                                    onChange={(e) => setContacto({ ...contacto, nombre: e.target.value })}
                                />
                                <label className="nr-label" htmlFor="nr-tel">WhatsApp (con código del país, sin +)</label>
                                <input
                                    id="nr-tel"
                                    className="nr-input"
                                    type="tel"
                                    placeholder="Ej: 573001234567 — Colombia"
                                    value={contacto.telefono}
                                    onChange={(e) => setContacto({ ...contacto, telefono: e.target.value })}
                                />
                                <button className="nr-btn" onClick={guardarContacto}>
                                    <RotateCcw size={16} /> Guardar contacto
                                </button>

                                <button className="nr-sos" onClick={activarSOS}>
                                    <Siren size={22} /> ACTIVAR SOS
                                </button>
                                <p className="nr-aviso">
                                    SOS activa la alarma, envía una notificación y abre WhatsApp con tu
                                    contacto de emergencia.
                                </p>
                            </div>
                        </FadeIn>
                    </div>

                    <p className="nr-disclaimer">
                        Aviso: NeuroRisk es un prototipo que SIMULA señales para demostrar un concepto.
                        No es un dispositivo médico, no diagnostica ni certifica crisis. La detección real
                        requeriría sensores validados y aprobación médica.
                    </p>
                </section>

                <section id="como-funciona">
                    <span className="seccion-etiqueta">IA integrada</span>
                    <h2>Cómo funciona el riesgo</h2>
                    <div className="foco-grid">
                        {COMO_FUNCIONA.map((item, i) => (
                            <FadeIn key={item.titulo} delay={i * 0.08}>
                                <div className="foco-card">
                                    <span className="foco-numero">{String(i + 1).padStart(2, "0")}</span>
                                    <h3>{item.titulo}</h3>
                                    <p>{item.descripcion}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                    <div className="nr-formula">
                        <span className="nr-formula-linea"># modelo de riesgo (prototipo IA explicable)</span>
                        <pre><code>{`riesgo = 0.30·frecuencia_cardíaca
       + 0.20·movimiento
       + 0.20·fatiga
       + 0.30·aura

nivel = riesgo >= 65 ? ALTO
      : riesgo >= 35 ? MODERADO
      :                BAJO`}</code></pre>
                    </div>
                </section>

                <section id="hoja-de-ruta">
                    <span className="seccion-etiqueta">Plan</span>
                    <h2>Hoja de ruta</h2>
                    <ol className="hojaruta">
                        {FASES.map((fase) => (
                            <li className={"hojaruta-item " + fase.estado} key={fase.nombre}>
                                <span className="hojaruta-punto"></span>
                                <div className="hojaruta-contenido">
                                    <div className="hojaruta-cabecera">
                                        <h3>{fase.nombre}</h3>
                                        <span className="hojaruta-etiqueta">{fase.etiqueta}</span>
                                    </div>
                                    <p>{fase.detalle}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                <section id="preguntas">
                    <span className="seccion-etiqueta">Preguntas frecuentes</span>
                    <h2>Qué debes saber del prototipo</h2>
                    {PREGUNTAS.map((pregunta, i) => (
                        <div className="acordeon" key={pregunta.titulo}>
                            <button
                                className={"acordeon-boton" + (abierto === i ? " activo" : "")}
                                onClick={() => setAbierto(abierto === i ? null : i)}
                            >
                                {pregunta.titulo} <span>+</span>
                            </button>
                            <div className={"acordeon-contenido" + (abierto === i ? " abierto" : "")}>
                                <p>{pregunta.contenido}</p>
                            </div>
                        </div>
                    ))}
                </section>

                <section id="bitacora">
                    <span className="seccion-etiqueta">Actualizaciones</span>
                    <h2>Bitácora de avances</h2>
                    <ul className="actualizaciones">
                        <li><strong>Agosto 2026:</strong> NeuroRisk pasa a prototipo: monitoreo simulado en vivo, IA de riesgo, recomendaciones, notificaciones, alarma sonora y botón SOS.</li>
                        <li><strong>Agosto 2026:</strong> Inicio de la investigación teórica y definición del problema a resolver.</li>
                    </ul>
                    <p className="bitacora-pronto">Próximamente iré subiendo nuevas entradas conforme avance el proyecto.</p>
                </section>
            </main>

            <Footer />

            {alarmaActiva && (
                <div className="nr-overlay">
                    <Siren className="nr-overlay-sirena" size={48} />
                    <h2>⚠ Riesgo alto de crisis</h2>
                    <p>
                        El modelo estima un riesgo del <strong>{riesgo}%</strong>. Sigue las
                        recomendaciones y, si lo necesitas, activa SOS para avisar a tu contacto.
                    </p>
                    {sosConfirmado && (
                        <p className="nr-overlay-sos">SOS enviado a {contacto.nombre || "tu contacto"} ✓</p>
                    )}
                    <div className="nr-overlay-botones">
                        <button className="nr-btn" onClick={reconocerAlarma}>Entendido</button>
                        <button className="nr-sos" onClick={activarSOS}>
                            <Siren size={18} /> ACTIVAR SOS
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

function calcularRiesgo(s) {
    const frecNormalizada = Math.max(0, Math.min(1, (s.frecuencia - 60) / 70));
    return Math.round(
        Math.max(
            0,
            Math.min(
                99,
                0.3 * frecNormalizada * 100 + 0.2 * s.movimiento + 0.2 * s.fatiga + 0.3 * (s.aura ? 100 : 0)
            )
        )
    );
}

function Señal({ icono, etiqueta, valor, unidad, max, min }) {
    const pct = Math.round(((valor - min) / (max - min)) * 100);
    return (
        <div className="nr-señal">
            <div className="nr-señal-info">
                <span className="nr-señal-icono">{icono}</span>
                <span className="nr-señal-nombre">{etiqueta}</span>
            </div>
            <div className="nr-señal-barra">
                <div className="nr-señal-fill" style={{ width: Math.max(2, pct) + "%" }}></div>
            </div>
            <span className="nr-señal-valor">{valor}{unidad}</span>
        </div>
    );
}

function BarraProgreso({ etiqueta, valor, color }) {
    const [ancho, setAncho] = useState(0);

    useEffect(() => {
        const temporizador = setTimeout(() => setAncho(valor), 300);
        return () => clearTimeout(temporizador);
    }, [valor]);

    return (
        <div className="estado-barra">
            <div className="estado-barra-cabecera">
                <span>{etiqueta}</span>
                <span>{valor}%</span>
            </div>
            <div className="estado-barra-track">
                <div className="estado-barra-fill" style={{ width: ancho + "%", background: color }}></div>
            </div>
        </div>
    );
}

const COMO_FUNCIONA = [
    {
        titulo: "Reúne las señales",
        descripcion:
            "Lee en tiempo real variables del cuerpo: frecuencia cardíaca, movimiento y fatiga. En el prototipo estas señales se simulan; en una app real llegarían de sensores validados.",
    },
    {
        titulo: "La IA estima el riesgo",
        descripcion:
            "Un modelo de pesos (prototipo de IA explicable) combina las señales y devuelve un riesgo de 0 a 99. Al detectar una posible aura, el riesgo sube de inmediato.",
    },
    {
        titulo: "Recomienda y alerta",
        descripcion:
            "Según el nivel de riesgo, la app muestra recomendaciones, dispara notificaciones, activa una alarma sonora y permite un botón SOS hacia un contacto de emergencia.",
    },
];

const FASES = [
    {
        nombre: "Investigación",
        detalle: "Entender el problema desde la literatura médica y los datos públicos de la OMS.",
        estado: "activo",
        etiqueta: "Completada",
    },
    {
        nombre: "Definición técnica",
        detalle: "Elegir señales, modelo de riesgo y arquitectura del prototipo.",
        estado: "activo",
        etiqueta: "Completada",
    },
    {
        nombre: "Prototipo simulado",
        detalle: "Primera versión funcional con monitoreo en vivo simulado, IA de riesgo, alertas y SOS.",
        estado: "activo",
        etiqueta: "Actual",
    },
    {
        nombre: "Validación",
        detalle: "Iterar con usuarios, medir alertas y mejorar la experiencia.",
        estado: "pendiente",
        etiqueta: "Próxima",
    },
    {
        nombre: "Sensores reales",
        detalle: "Conectar datos reales de sensores certificados para dejar la simulación.",
        estado: "pendiente",
        etiqueta: "Próxima",
    },
    {
        nombre: "Publicación",
        detalle: "Empaquetar la app, documentar el proceso y compartir los aprendizajes.",
        estado: "pendiente",
        etiqueta: "Próxima",
    },
];

const PREGUNTAS = [
    {
        titulo: "¿NeuroRisk detecta crisis reales ahora mismo?",
        contenido: "No. En esta versión, las señales se SIMULAN para demostrar el flujo completo: cálculo de riesgo, recomendaciones, notificaciones, alarma y SOS. La detección real requiere sensores certificados y validación médica.",
    },
    {
        titulo: "¿Cómo funciona la IA integrada?",
        contenido: "Por ahora es un prototipo de IA explicable: un modelo de pesos que combina frecuencia cardíaca, movimiento, fatiga y presencia de aura para devolver un riesgo de 0 a 99. La idea es que cada decisión sea transparente y justificable.",
    },
    {
        titulo: "¿Qué pasa cuando el riesgo es alto?",
        contenido: "La app activa una alarma sonora y una notificación, muestra recomendaciones concretas y deja un botón SOS que abre WhatsApp con el mensaje hacia tu contacto de emergencia.",
    },
    {
        titulo: "¿La app reemplazaría la atención médica?",
        contenido: "No. Es una herramienta de apoyo y monitoreo complementaria, no un sistema de diagnóstico. No es un dispositivo médico certificado: cualquier decisión de salud debe tomarla personal profesional.",
    },
];