import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Mail, MapPin, Printer } from "lucide-react";
import { CV } from "../data/cv";
import useTema from "../hooks/useTema";
import BotonTema from "../components/BotonTema";

export default function PaginaCV() {
    const [tema, setTema] = useTema();

    useEffect(() => {
        document.body.classList.add("pagina-cv");
        return () => document.body.classList.remove("pagina-cv");
    }, []);

    return (
        <>
            <Link to="/" className="cv-volver" aria-label="Volver al inicio">
                ← Volver
            </Link>

            <main className="cv">
                <header className="cv-hero brutal">
                    <div className="cv-hero-cabecera">
                        <BotonTema tema={tema} setTema={setTema} />
                        <button className="cv-imprimir brutal" onClick={() => window.print()}>
                            <Printer size={18} /> Imprimir / PDF
                        </button>
                    </div>
                    <div>
                        <p className="cv-prompt">$ whoami</p>
                        <h1 className="cv-nombre">
                            {CV.nombre}
                            {CV.apellido ? " " + CV.apellido : ""}
                            <span className="cv-cursor">_</span>
                        </h1>
                        <p className="cv-cargo">{CV.cargo}</p>
                    </div>
                    <pre className="cv-identidad brutal">
                        <code>{`> construyendo el futuro\n> una línea de código a la vez`}</code>
                    </pre>
                </header>

                <section className="cv-seccion">
                    <h2 className="cv-titulo">// Resumen</h2>
                    <p className="cv-texto">{CV.resumen}</p>
                </section>

                <section className="cv-seccion">
                    <h2 className="cv-titulo">// Educación</h2>
                    <div className="cv-lista">
                        {CV.educacion.map((item) => (
                            <article className="cv-item brutal" key={item.titulo}>
                                <div className="cv-item-cabecera">
                                    <h3>{item.titulo}</h3>
                                    <span className="cv-periodo">{item.periodo}</span>
                                </div>
                                <p className="cv-lugar">{item.institucion}</p>
                                <p className="cv-detalle">{item.detalle}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="cv-seccion">
                    <h2 className="cv-titulo">// Experiencia</h2>
                    <div className="cv-lista">
                        {CV.experiencia.map((item) => (
                            <article className="cv-item brutal" key={item.rol}>
                                <div className="cv-item-cabecera">
                                    <h3>{item.rol}</h3>
                                    <span className="cv-periodo">{item.periodo}</span>
                                </div>
                                <p className="cv-lugar">{item.lugar}</p>
                                <p className="cv-detalle">{item.detalle}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="cv-seccion">
                    <h2 className="cv-titulo">// Habilidades</h2>
                    <ul className="cv-skills">
                        {CV.habilidades.map((habilidad) => (
                            <li className="cv-skill brutal" key={habilidad.nombre}>
                                <span className="cv-skill-nombre">{habilidad.nombre}</span>
                                <span className="cv-skill-barra">
                                    <span
                                        className="cv-skill-progreso"
                                        style={{ width: habilidad.nivel + "%" }}
                                    ></span>
                                </span>
                                <span className="cv-skill-nivel">{habilidad.nivel}%</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="cv-seccion">
                    <h2 className="cv-titulo">// Proyectos</h2>
                    <div className="cv-lista">
                        {CV.proyectos.map((proyecto) => (
                            <article className="cv-item brutal" key={proyecto.slug}>
                                <div className="cv-item-cabecera">
                                    <h3>{proyecto.titulo}</h3>
                                    {proyecto.badge && (
                                        <span className="cv-badge">{proyecto.badge}</span>
                                    )}
                                </div>
                                <p className="cv-detalle">{proyecto.descripcion}</p>
                                <Link to={"/" + proyecto.slug} className="cv-enlace">
                                    ver_detalle()
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="cv-seccion">
                    <h2 className="cv-titulo">// Contacto</h2>
                    <div className="cv-contacto">
                        <a className="cv-enlace" href={"mailto:" + CV.contacto.email}>
                            <Mail size={16} /> {CV.contacto.email}
                        </a>
                        <a
                            className="cv-enlace"
                            href={CV.contacto.github}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink size={16} /> GitHub
                        </a>
                        <a
                            className="cv-enlace"
                            href={CV.contacto.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink size={16} /> LinkedIn
                        </a>
                        <span className="cv-enlace">
                            <MapPin size={16} /> {CV.contacto.ubicacion}
                        </span>
                    </div>
                </section>
            </main>
        </>
    );
}