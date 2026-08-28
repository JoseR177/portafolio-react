import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, FileText, FolderKanban, Home, Layers, Mail } from "lucide-react";
import Footer from "./components/Footer";
import Terminal from "./components/Terminal";
import ShineBorder from "./components/ShineBorder";
import BotonTema from "./components/BotonTema";
import FadeIn from "./components/FadeIn";
import { PROYECTOS } from "./data/proyectos";
import useTema from "./hooks/useTema";
import { Dock, DockIcon } from "./components/Dock";

const HABILIDADES = [
    { nombre: "HTML5", nivel: 80 },
    { nombre: "CSS3", nivel: 75 },
    { nombre: "JavaScript", nivel: 55 },
    { nombre: "Flexbox", nivel: 70 },
    { nombre: "Responsive Design", nivel: 65 },
    { nombre: "Git & GitHub", nivel: 50 },
];

export default function App() {
    const [tema, setTema] = useTema();

    return (
        <>
            <main>
                <section id="sobre-mi" className="hero">
                    <div className="hero-avatar">
                        <img src="/imagenes/perfil.jpg" alt="Foto de Jose" className="avatar" />
                    </div>
                    <span className="hero-etiqueta">Desarrollador en formación</span>
                    <h2>Construyendo el futuro, <span className="destacado">una línea de código a la vez</span></h2>
                    <p>Estoy aprendiendo a programar desde cero, con la mira puesta en crear cosas que realmente importen. Cada proyecto es un paso más hacia soluciones reales — como NeuroRisk, mi app para estimar el riesgo de una posible crisis epiléptica.</p>
                    <div className="hero-botones">
                        <a href="#proyectos" className="boton-primario">Ver proyectos</a>
                        <a href="#contacto" className="boton-secundario">Contáctame</a>
                    </div>
                    <Terminal />
                </section>

                <SeccionHabilidades />
                <SeccionProyectos />
                <SeccionContacto />
            </main>

            <Footer />

            <div className="dock-flotante">
                <Dock>
                    <DockIcon>
                        <a href="#sobre-mi" aria-label="Sobre mí"><Home size={22} /></a>
                    </DockIcon>
                    <DockIcon>
                        <a href="#habilidades" aria-label="Habilidades"><Layers size={22} /></a>
                    </DockIcon>
                    <DockIcon>
                        <a href="#proyectos" aria-label="Proyectos"><FolderKanban size={22} /></a>
                    </DockIcon>
                    <DockIcon>
                        <a href="#proyectos" aria-label="Proyectos"><Activity size={22} /></a>
                    </DockIcon>
                    <DockIcon>
                        <Link to="/cv" aria-label="Currículum"><FileText size={22} /></Link>
                    </DockIcon>
                    <DockIcon>
                        <a href="#contacto" aria-label="Contacto"><Mail size={22} /></a>
                    </DockIcon>
                    <DockIcon>
                        <BotonTema tema={tema} setTema={setTema} />
                    </DockIcon>
                </Dock>
            </div>
        </>
    );
}

function SeccionHabilidades() {
    const [animado, setAnimado] = useState(false);

    useEffect(() => {
        const temporizador = setTimeout(() => setAnimado(true), 200);
        return () => clearTimeout(temporizador);
    }, []);

    return (
        <section id="habilidades">
            <h2>Lo que estoy aprendiendo</h2>
            <div className="skills-grid">
                {HABILIDADES.map((habilidad, i) => (
                    <FadeIn key={habilidad.nombre} delay={(i % 3) * 0.08}>
                        <div className="skill-card">
                            <h3>{habilidad.nombre}</h3>
                            <div className="skill-barra">
                                <div
                                    className="skill-progreso"
                                    style={{ width: animado ? habilidad.nivel + "%" : "0%" }}
                                ></div>
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}

function SeccionProyectos() {
    return (
        <section id="proyectos">
            <h2>Mis Proyectos</h2>
            <div className="proyectos-grid">
                {PROYECTOS.map((proyecto, i) => (
                    <FadeIn key={proyecto.slug} delay={i * 0.1}>
                        <div
                            className={"proyecto" + (proyecto.destacado ? " proyecto-destacado" : "")}
                        >
                            {proyecto.destacado && (
                                <ShineBorder
                                    borderWidth={1}
                                    duration={6}
                                    shineColor={["#00ff9d", "#ffd60a", "#ff2d55"]}
                                />
                            )}
                            {proyecto.badge && (
                                <span className="proyecto-badge">{proyecto.badge}</span>
                            )}
                            <h3>{proyecto.titulo}</h3>
                            <p>{proyecto.descripcion}</p>
                            <Link to={"/" + proyecto.slug}>Ver más →</Link>
                        </div>
                    </FadeIn>
                ))}
                <FadeIn delay={0.1}>
                    <div className="proyecto">
                        <h3>Próximo proyecto</h3>
                        <p>Espacio reservado para futuros trabajos.</p>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}

const EMAIL_CONTACTO = "tucorreo@ejemplo.com";

function SeccionContacto() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [mensajeTexto, setMensajeTexto] = useState("");
    const [mensaje, setMensaje] = useState({ texto: "", color: "" });

    function enviar(evento) {
        evento.preventDefault();

        if (nombre === "" || email === "") {
            setMensaje({ texto: "Por favor completa nombre y correo.", color: "var(--peligro)" });
            return;
        }

        const asunto = encodeURIComponent("Mensaje desde mi portafolio de " + nombre);
        const cuerpo = encodeURIComponent(
            "Nombre: " + nombre + "\nCorreo: " + email + "\n\nMensaje:\n" + (mensajeTexto || "(sin texto)")
        );
        window.location.href = "mailto:" + EMAIL_CONTACTO + "?subject=" + asunto + "&body=" + cuerpo;

        setMensaje({
            texto: "¡Gracias " + nombre + "! Se abrirá tu correo para enviar el mensaje.",
            color: "var(--ideal)",
        });
        setNombre("");
        setEmail("");
        setMensajeTexto("");
    }

    return (
        <section id="contacto">
            <h2>Contáctame</h2>
            <p>¿Quieres hablar conmigo? Escríbeme un mensaje.</p>

            <form id="formContacto" onSubmit={enviar}>
                <div className="campo">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        placeholder="Tu nombre"
                        value={nombre}
                        onChange={(evento) => setNombre(evento.target.value)}
                    />
                </div>

                <div className="campo">
                    <label htmlFor="email">Correo:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="tucorreo@ejemplo.com"
                        value={email}
                        onChange={(evento) => setEmail(evento.target.value)}
                    />
                </div>

                <div className="campo">
                    <label htmlFor="mensajeTexto">Mensaje:</label>
                    <textarea
                        id="mensajeTexto"
                        placeholder="Escribe tu mensaje..."
                        value={mensajeTexto}
                        onChange={(evento) => setMensajeTexto(evento.target.value)}
                    ></textarea>
                </div>

                <button type="submit">Enviar</button>
            </form>

            {mensaje.texto && (
                <p id="mensaje" style={{ color: mensaje.color }}>{mensaje.texto}</p>
            )}
        </section>
    );
}