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
import Meteors from "../components/Meteors";
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

function desplazarA(id, evento) {
    evento.preventDefault();
    const destino = document.getElementById(id);
    if (destino) destino.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function NeuroFisk() {
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
            const guardado = JSON.parse(localStorage.getItem("nf-contacto"));
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
                "NeuroFisk — Riesgo alto",
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
        notificar("NeuroFisk — Prueba de alarma", "Así se ve una alerta de riesgo alto.");
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
        notificar("NeuroFisk — SOS", "Alarma SOS activada. Avisando a tu contacto de emergencia.");

        if (contacto.telefono) {
            const texto = encodeURIComponent(
                "¡Hola " +
                    (contacto.nombre || "amigo") +
                    "! Te escribo desde NeuroFisk. Necesito ayuda: existe riesgo de una crisis epiléptica. ⚠️"
            );
            window.open("https://wa.me/" + contacto.telefono + "?text=" + texto, "_blank", "noopener");
        }
    }

    function guardarContacto() {
        try {
            localStorage.setItem("nf-contacto", JSON.stringify(contacto));
        } catch {
            // almacenamiento no disponible
        }
    }

    return (
        <>
            <div className="meteores-fondo" aria-hidden="true">
                <Meteors number={60} />
            </div>
            <Link to="/" className="volver-flotante" aria-label="Volver al inicio">
                ← Volver
            </Link>

            <main>
                <section className="epilepsia-hero">
                    <FadeIn>
                        <div className="epilepsia-hero-info">
                            <span className="proyecto-badge">Prototipo — Web (PWA) + Android</span>
                            <h1>NeuroFisk</h1>
                            <p>
                                NeuroFisk estima el riesgo de una posible crisis epiléptica a partir de señales
                                en vivo. La app web simula las señales para demostrar el flujo completo; la app
                                Android además lee el pulso real de un reloj por Bluetooth. Ante un riesgo alto
                                activa recomendaciones, notificaciones, alarma y un botón SOS.
                            </p>
                            <div className="hero-botones izquierda">
                                <a href="#app-monitor" className="boton-primario" onClick={(e) => desplazarA("app-monitor", e)}>Probar la app</a>
                                <a href="#avances" className="boton-secundario" onClick={(e) => desplazarA("avances", e)}>Ver avances</a>
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
                                Fase actual: <strong>App Android con pulso real</strong>
                            </p>
                            <BarraProgreso etiqueta="Investigación clínica" valor={100} color="#00ff9d" />
                            <BarraProgreso etiqueta="Definición técnica" valor={100} color="#00ff9d" />
                            <BarraProgreso etiqueta="Prototipo web (PWA)" valor={100} color="#00ff9d" />
                            <BarraProgreso etiqueta="App Android + Bluetooth" valor={75} color="#ffd60a" />
                            <BarraProgreso etiqueta="Validación clínica" valor={10} color="#ff2d55" />
                            <p className="estado-nota">
                                Progreso estimado. NeuroFisk está en fase 0 de validación: la web simula las
                                señales y la app Android ya lee pulso real, pero no es un dispositivo médico.
                            </p>
                        </div>
                    </FadeIn>
                </section>

                <section id="avances">
                    <span className="seccion-etiqueta">Avances</span>
                    <h2>Lo que hemos avanzado</h2>
                    <p className="seccion-expl">
                        NeuroFisk pasó de un prototipo web a una app instalable con versión Android que lee
                        el pulso real de un reloj. Estos son los avances principales del proyecto.
                    </p>
                    <div className="foco-grid">
                        {AVANCES.map((item, i) => (
                            <FadeIn key={item.titulo} delay={i * 0.06}>
                                <div className="foco-card">
                                    <span className="foco-numero">{String(i + 1).padStart(2, "0")}</span>
                                    <h3>{item.titulo}</h3>
                                    <p>{item.descripcion}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </section>

                <section id="app-monitor">
                    <span className="seccion-etiqueta">La app</span>
                    <h2>Monitoreo en vivo</h2>
                    <p className="seccion-expl">
                        Este prototipo simula señales fisiológicas en tiempo real con el mismo modelo de
                        riesgo que usa la app Android. La IA estima tu riesgo de crisis y, si es alto,
                        dispara una alarma sonora, una notificación y recomendaciones. Pulsa{" "}
                        <strong>Iniciar</strong> para verlo funcionar.
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
                                <label className="nr-label" htmlFor="nf-nombre">Nombre</label>
                                <input
                                    id="nf-nombre"
                                    className="nr-input"
                                    type="text"
                                    placeholder="Ej: mamá"
                                    value={contacto.nombre}
                                    onChange={(e) => setContacto({ ...contacto, nombre: e.target.value })}
                                />
                                <label className="nr-label" htmlFor="nf-tel">WhatsApp (con código del país, sin +)</label>
                                <input
                                    id="nf-tel"
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
                        Aviso: la versión web de NeuroFisk SIMULA las señales para demostrar el concepto.
                        La app Android ya lee el pulso real de un reloj compatible, pero NeuroFisk no es un
                        dispositivo médico: no diagnostica ni certifica crisis. La detección fiable requiere
                        sensores validados y validación clínica.
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
                        <li><strong>Octubre 2026:</strong> rediseño completo con paleta violeta/magenta, modo oscuro, onboarding y SOS con cuenta atrás cancelable.</li>
                        <li><strong>Octubre 2026:</strong> la app Android lee el pulso real de un reloj por Bluetooth; alarma y notificación verificadas en dispositivo.</li>
                        <li><strong>Septiembre 2026:</strong> primera versión web (PWA) con monitoreo simulado, modelo de riesgo, recomendaciones y botón SOS.</li>
                        <li><strong>Agosto 2026:</strong> investigación del problema y definición técnica del prototipo.</li>
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

const AVANCES = [
    {
        titulo: "Rediseño y modo oscuro",
        descripcion:
            "Interfaz renovada con paleta violeta/magenta, nueva tipografía y modo claro, oscuro o automático que se recuerda entre sesiones.",
    },
    {
        titulo: "App Android con Bluetooth",
        descripcion:
            "Versión en React Native (Expo) que lee el pulso real de un reloj por el servicio BLE estándar (0x180D) y usa el acelerómetro del teléfono para el movimiento.",
    },
    {
        titulo: "PWA instalable",
        descripcion:
            "La versión web se instala en el celular con su propio ícono, funciona sin conexión y se actualiza sola.",
    },
    {
        titulo: "Alertas y SOS",
        descripcion:
            "Alarma sonora, notificación del sistema y botón SOS que abre WhatsApp con tu contacto de emergencia.",
    },
    {
        titulo: "SOS con cuenta atrás",
        descripcion:
            "Antes de avisar a un familiar, una cuenta atrás permite cancelar la alerta y evitar falsos positivos.",
    },
    {
        titulo: "Calidad y documentación",
        descripcion:
            "49 pruebas automatizadas del modelo de riesgo, más documentación técnica del modelo clínico y de la hoja de ruta.",
    },
];

const COMO_FUNCIONA = [
    {
        titulo: "Reúne las señales",
        descripcion:
            "Lee en tiempo real frecuencia cardíaca, movimiento y fatiga. En la app Android el pulso llega de un reloj por Bluetooth; en la web se simula para demostrar el flujo.",
    },
    {
        titulo: "La IA estima el riesgo",
        descripcion:
            "Un modelo de pesos (IA explicable) combina las señales y devuelve un riesgo de 0 a 99. Al detectar una posible aura, el riesgo sube de inmediato.",
    },
    {
        titulo: "Recomienda y alerta",
        descripcion:
            "Según el nivel, la app muestra recomendaciones, dispara notificaciones, activa una alarma sonora y deja listo el botón SOS hacia un contacto de emergencia.",
    },
];

const FASES = [
    {
        nombre: "Investigación clínica",
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
        nombre: "Prototipo web (PWA)",
        detalle: "App web instalable con monitoreo simulado, IA de riesgo, alertas y SOS.",
        estado: "activo",
        etiqueta: "Completada",
    },
    {
        nombre: "App Android con Bluetooth",
        detalle: "Versión móvil que lee el pulso real de un reloj por BLE y usa el acelerómetro del teléfono.",
        estado: "activo",
        etiqueta: "Actual",
    },
    {
        nombre: "Validación con usuarios",
        detalle: "Iterar con usuarios, medir alertas y reducir los falsos positivos del modelo.",
        estado: "pendiente",
        etiqueta: "Próxima",
    },
    {
        nombre: "Sensores y monitoreo continuo",
        detalle: "Sensores validados (EDA, muñeca) y un servicio en primer plano para alertar con la app cerrada.",
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
        titulo: "¿NeuroFisk detecta crisis reales ahora mismo?",
        contenido:
            "No. La app Android ya lee el pulso real de un reloj compatible, y la versión web simula las señales para demostrar el flujo completo. Detectar crisis de forma fiable exige sensores validados (como la actividad electrodérmica) y validación médica: NeuroFisk está en fase 0 de ese proceso.",
    },
    {
        titulo: "¿Cómo funciona la IA integrada?",
        contenido:
            "Por ahora es un prototipo de IA explicable: un modelo de pesos que combina frecuencia cardíaca, movimiento, fatiga y presencia de aura para devolver un riesgo de 0 a 99. La idea es que cada decisión sea transparente y justificable.",
    },
    {
        titulo: "¿Qué pasa cuando el riesgo es alto?",
        contenido:
            "La app activa una alarma sonora y una notificación, muestra recomendaciones concretas y deja un botón SOS que abre WhatsApp con el mensaje hacia tu contacto de emergencia. Antes de avisar, una cuenta atrás permite cancelar los falsos positivos.",
    },
    {
        titulo: "¿En qué se diferencian la web y la app Android?",
        contenido:
            "La web es una PWA que se instala en el navegador y simula todas las señales. La app Android, hecha con React Native y Expo, además se conecta a un reloj compatible por Bluetooth (servicio estándar 0x180D) y usa el acelerómetro del teléfono para el movimiento.",
    },
    {
        titulo: "¿La app reemplazaría la atención médica?",
        contenido:
            "No. Es una herramienta de apoyo y monitoreo complementaria, no un sistema de diagnóstico. No es un dispositivo médico certificado: cualquier decisión de salud debe tomarla personal profesional.",
    },
];
