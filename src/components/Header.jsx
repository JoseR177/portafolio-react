export default function Header({ menuAbierto, setMenuAbierto, children }) {
    return (
        <header>
            <h1>Jose<span>.dev</span></h1>
            <button
                className={"menu-hamburguesa" + (menuAbierto ? " activo" : "")}
                onClick={() => setMenuAbierto((abierto) => !abierto)}
                aria-label="Abrir menú"
                aria-expanded={menuAbierto}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav className={menuAbierto ? "abierto" : ""}>{children}</nav>
        </header>
    );
}