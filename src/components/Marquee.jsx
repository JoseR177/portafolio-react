export default function Marquee({ items = [], className = "" }) {
    const duplicados = [...items, ...items];

    return (
        <div className={`marquee${className ? ` ${className}` : ""}`} aria-hidden="true">
            <div className="marquee-pista">
                {duplicados.map((item, i) => (
                    <span className="marquee-item" key={i}>
                        {item}
                        <span className="marquee-separador">✦</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
