import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, FileText, FolderKanban, Home, Layers, Mail } from "lucide-react";
import Footer from "./components/Footer";
import Terminal from "./components/Terminal";
import ShineBorder from "./components/ShineBorder";
import BotonTema from "./components/BotonTema";
import FadeIn from "./components/FadeIn";
import Marquee from "./components/Marquee";
import Meteors from "./components/Meteors";
import { PROYECTOS } from "./data/proyectos";
import useTema from "./hooks/useTema";
import { Dock, DockIcon } from "./components/Dock";

const ESPECIALIDADES = [
    {
        numero: "01",
        titulo: "Frontend",
        descripcion:
            "Construyo interfaces con React, HTML5 y CSS3, con foco en diseño responsive y componentes limpios.",
        tags: ["React", "HTML5", "CSS3", "Vite"],
    },
    {
        numero: "02",
        titulo: "JavaScript",
        descripcion:
            "Doy vida a las páginas con lógica en JavaScript, interacciones y manejo de estado en el navegador.",
        tags: ["JavaScript", "ES6+", "Eventos", "DOM"],
    },
    {
        numero: "03",
        titulo: "IA Aplicada",
        descripcion:
            "Desarrollo proyectos con IA, como NeuroRisk, un prototipo que estima el riesgo de crisis epilépticas.",
        tags: ["IA", "Prototipos", "NeuroRisk"],
    },
    {
        numero: "04",
        titulo: "Git & GitHub",
        descripcion:
            "Versiono mi código, colaboro en proyectos y mantengo un flujo de trabajo ordenado.",
        tags: ["Git", "GitHub", "Workflow"],
    },
];

function desplazarA(id, evento) {
    evento.preventDefault();
    const destino = document.getElementById(id);
    if (destino) destino.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function App() {
    const [tema, setTema] = useTema();

    return (
        <>
            <div className="meteores-fondo" aria-hidden="true">
                <Meteors number={60} />
            </div>
            <main>
                <section id="sobre-mi" className="hero">
                    <div className="hero-avatar">
                        <img src="imagenes/perfil.jpg" alt="Foto de Jose" className="avatar" />
                    </div>
                    <span className="hero-etiqueta">Front-end · React</span>
                    <h2>Construyo el futuro, <span className="destacado">una línea de código a la vez</span></h2>
                    <p>Soy desarrollador web enfocado en front-end con React, HTML, CSS y JavaScript. Me apasiona construir soluciones que realmente importen — como NeuroRisk, mi app con IA para estimar el riesgo de una posible crisis epiléptica.</p>
                    <div className="hero-botones">
                        <a href="#proyectos" className="boton-primario" onClick={(e) => desplazarA("proyectos", e)}>Ver proyectos</a>
                        <a href="#contacto" className="boton-secundario" onClick={(e) => desplazarA("contacto", e)}>Contáctame</a>
                    </div>
                    <Terminal />
                </section>

                <Marquee
                    items={[
                        "REACT",
                        "HTML5",
                        "CSS3",
                        "JAVASCRIPT",
                        "VITE",
                        "IA APLICADA",
                        "NEURORISK",
                        "DISEÑO RESPONSIVE",
                    ]}
                />

                <SeccionEspecialidades />
                <SeccionProyectos />
                <SeccionContacto />
            </main>

            <Footer />

            <div className="dock-flotante">
                <Dock>
                    <DockIcon>
                        <a href="#sobre-mi" aria-label="Sobre mí" onClick={(e) => desplazarA("sobre-mi", e)}><Home size={22} /></a>
                    </DockIcon>
                    <DockIcon>
                        <a href="#habilidades" aria-label="Habilidades" onClick={(e) => desplazarA("habilidades", e)}><Layers size={22} /></a>
                    </DockIcon>
                    <DockIcon>
                        <a href="#proyectos" aria-label="Proyectos" onClick={(e) => desplazarA("proyectos", e)}><FolderKanban size={22} /></a>
                    </DockIcon>
                    <DockIcon>
                        <Link to="/neuro-risk" aria-label="NeuroRisk"><Activity size={22} /></Link>
                    </DockIcon>
                    <DockIcon>
                        <Link to="/cv" aria-label="Currículum"><FileText size={22} /></Link>
                    </DockIcon>
                    <DockIcon>
                        <a href="#contacto" aria-label="Contacto" onClick={(e) => desplazarA("contacto", e)}><Mail size={22} /></a>
                    </DockIcon>
                    <DockIcon>
                        <BotonTema tema={tema} setTema={setTema} />
                    </DockIcon>
                </Dock>
            </div>
        </>
    );
}

function SeccionEspecialidades() {
    return (
        <section id="habilidades">
            <span className="seccion-etiqueta">// S01 · Especialidades</span>
            <h2>Lo que hago</h2>
            <div className="especialidades-grid">
                {ESPECIALIDADES.map((especialidad, i) => (
                    <FadeIn key={especialidad.numero} delay={i * 0.08}>
                        <article className="especialidad-card">
                            <span className="especialidad-numero">{especialidad.numero}</span>
                            <h3>{especialidad.titulo}</h3>
                            <p>{especialidad.descripcion}</p>
                            <ul className="especialidad-tags">
                                {especialidad.tags.map((tag) => (
                                    <li key={tag}>{tag}</li>
                                ))}
                            </ul>
                        </article>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}

function SeccionProyectos() {
    return (
        <section id="proyectos">
            <span className="seccion-etiqueta">// S02 · Trabajo</span>
            <h2>Mis Proyectos</h2>
            <div className="proyectos-grid">
                {PROYECTOS.map((proyecto, i) => (
                    <FadeIn key={proyecto.slug} delay={i * 0.1}>
                        <Link
                            to={"/" + proyecto.slug}
                            className={"proyecto" + (proyecto.destacado ? " proyecto-destacado" : "")}
                        >
                            {proyecto.destacado && (
                                <ShineBorder
                                    borderWidth={1}
                                    duration={6}
                                    shineColor={["#00ff9d", "#ffd60a", "#ff2d55"]}
                                />
                            )}
                            {proyecto.imagen && (
                                <div className="proyecto-imagen">
                                    <img src={proyecto.imagen} alt={proyecto.titulo} />
                                </div>
                            )}
                            <div className="proyecto-contenido">
                                {proyecto.badge && (
                                    <span className="proyecto-badge">{proyecto.badge}</span>
                                )}
                                <h3>{proyecto.titulo}</h3>
                                <p>{proyecto.descripcion}</p>
                                {proyecto.tags && (
                                    <ul className="proyecto-tags">
                                        {proyecto.tags.map((tag) => (
                                            <li key={tag}>{tag}</li>
                                        ))}
                                    </ul>
                                )}
                                <span className="proyecto-enlace">Ver proyecto →</span>
                            </div>
                        </Link>
                    </FadeIn>
                ))}
                <FadeIn delay={0.1}>
                    <div className="proyecto proyecto-proximo">
                        <div className="proyecto-contenido">
                            <span className="proyecto-badge">Próximo</span>
                            <h3>Próximo proyecto</h3>
                            <p>Espacio reservado para futuros trabajos.</p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}

const EMAIL_CONTACTO = "jr5716413@gmail.com";

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
            <span className="seccion-etiqueta">// S03 · Contacto</span>
            <h2>Contáctame</h2>
            <p className="seccion-expl">¿Quieres hablar conmigo o trabajar juntos? Escríbeme un mensaje y te responderé lo antes posible.</p>

            <form id="formContacto" onSubmit={enviar}>
                <div className="campo">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        placeholder="Tu nombre"
                        value={nombre}
                        onChange={(evento) => setNombre(evento.target.value)}
                    />
                </div>

                <div className="campo">
                    <label htmlFor="email">Correo</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={(evento) => setEmail(evento.target.value)}
                    />
                </div>

                <div className="campo">
                    <label htmlFor="mensajeTexto">Mensaje</label>
                    <textarea
                        id="mensajeTexto"
                        placeholder="Escribe tu mensaje..."
                        value={mensajeTexto}
                        onChange={(evento) => setMensajeTexto(evento.target.value)}
                    ></textarea>
                </div>

                <button type="submit" className="enviar-boton">
                    <Mail size={16} /> Enviar mensaje
                </button>
            </form>

            {mensaje.texto && (
                <p id="mensaje" style={{ color: mensaje.color }}>{mensaje.texto}</p>
            )}
        </section>
    );
}