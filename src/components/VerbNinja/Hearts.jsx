function Hearts({ total, remaining }) {
    return (
        <div className="hearts-display">
            {Array.from({ length: total }, (_, i) => (
                <span
                    key={i}
                    className={`heart ${i >= remaining ? 'lost' : ''}`}
                >
                    ❤️
                </span>
            ))}
        </div>
    )
}

export default Hearts
