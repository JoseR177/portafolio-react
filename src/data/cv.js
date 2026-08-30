import { PROYECTOS } from "./proyectos";

export const CV = {
    nombre: "Jose",
    apellido: "",
    cargo: "Desarrollador web",
    resumen:
        "Desarrollador web enfocado en front-end con React, HTML, CSS y JavaScript. Me apasiona construir soluciones que realmente importen, como NeuroRisk, un prototipo con IA para estimar el riesgo de crisis epilépticas.",
    contacto: {
        email: "jr5716413@gmail.com",
        ubicacion: "Colombia",
        github: "https://github.com/",
        linkedin: "https://www.linkedin.com/in/",
    },
    educacion: [
        {
            titulo: "Bootcamp / Cursos de desarrollo web",
            institucion: "Autodidacta",
            periodo: "2025 — Presente",
            detalle:
                "Formación práctica en HTML5, CSS3, JavaScript, Git/GitHub y React a través de cursos y proyectos propios.",
        },
    ],
    experiencia: [
        {
            rol: "Desarrollador web — Proyecto personal",
            lugar: "Portafolio y app propia",
            periodo: "2025 — Presente",
            detalle:
                "Construyo y mantengo este portafolio con React y Vite, y desarrollo NeuroRisk, un prototipo con IA que estima el riesgo de crisis epilépticas con monitoreo simulado, alertas y SOS.",
        },
    ],
    habilidades: [
        { nombre: "HTML5", nivel: 80 },
        { nombre: "CSS3", nivel: 75 },
        { nombre: "JavaScript", nivel: 55 },
        { nombre: "Flexbox", nivel: 70 },
        { nombre: "Responsive Design", nivel: 65 },
        { nombre: "Git & GitHub", nivel: 50 },
        { nombre: "React", nivel: 30 },
        { nombre: "Vite", nivel: 30 },
    ],
    proyectos: PROYECTOS,
};