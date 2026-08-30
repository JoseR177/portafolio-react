import { Link, useLocation } from "react-router-dom";

function desplazarA(id, evento) {
    evento.preventDefault();
    const destino = document.getElementById(id);
    if (destino) destino.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Footer() {
    const ubicacion = useLocation();
    const esInicio = ubicacion.pathname === "/";

    return (
        <footer>
            <p>Jose<span className="footer-logo">{".dev"}</span> — Portafolio personal</p>
            <div className="footer-enlaces">
                <Link to="/">Inicio</Link>
                <Link to="/cv">Currículum</Link>
                {esInicio && <a href="#proyectos" onClick={(e) => desplazarA("proyectos", e)}>Proyectos</a>}
                {esInicio && <a href="#contacto" onClick={(e) => desplazarA("contacto", e)}>Contacto</a>}
            </div>
            <p><small>&copy; {new Date().getFullYear()} Jose. Construido con React y Vite.</small></p>
        </footer>
    );
}