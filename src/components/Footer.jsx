import { Link, useLocation } from "react-router-dom";

export default function Footer() {
    const ubicacion = useLocation();
    const esInicio = ubicacion.pathname === "/";

    return (
        <footer>
            <p>Jose<span className="footer-logo">{".dev"}</span> — Portafolio personal</p>
            <div className="footer-enlaces">
                <Link to="/">Inicio</Link>
                <Link to="/cv">Currículum</Link>
                {esInicio && <a href="#proyectos">Proyectos</a>}
                {esInicio && <a href="#contacto">Contacto</a>}
            </div>
            <p><small>&copy; {new Date().getFullYear()} Jose. Construido con React y Vite.</small></p>
        </footer>
    );
}