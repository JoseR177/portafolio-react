import { Moon, Sun } from "lucide-react";

export default function BotonTema({ tema, setTema }) {
    const esClaro = tema === "claro";

    return (
        <button
            className="boton-tema"
            onClick={() => setTema(esClaro ? "oscuro" : "claro")}
            aria-label={esClaro ? "Cambiar a tema oscuro" : "Cambiar a tema claro"}
            title={esClaro ? "Tema oscuro" : "Tema claro"}
        >
            {esClaro ? <Moon size={18} /> : <Sun size={18} />}
        </button>
    );
}