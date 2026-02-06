import { useMemo } from 'react'

function JuiceSplash({ x, y, isCorrect }) {
    // Generate random splash particles
    const particles = useMemo(() => {
        const colors = isCorrect
            ? ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
            : ['#E74C3C', '#C0392B', '#FF6B6B', '#E55039', '#FC427B']

        return Array.from({ length: 12 }, (_, i) => ({
            id: i,
            color: colors[Math.floor(Math.random() * colors.length)],
            angle: (i * 30) + Math.random() * 20 - 10,
            distance: 40 + Math.random() * 60,
            size: 8 + Math.random() * 12,
            delay: Math.random() * 0.1
        }))
    }, [isCorrect])

    return (
        <div
            className={`juice-splash ${isCorrect ? 'correct' : 'wrong'}`}
            style={{ left: x, top: y }}
        >
            {particles.map(p => (
                <div
                    key={p.id}
                    className="splash-particle"
                    style={{
                        '--angle': `${p.angle}deg`,
                        '--distance': `${p.distance}px`,
                        '--size': `${p.size}px`,
                        '--color': p.color,
                        '--delay': `${p.delay}s`
                    }}
                />
            ))}
            <div className="splash-center" style={{ backgroundColor: isCorrect ? '#FFD700' : '#E74C3C' }} />
        </div>
    )
}

export default JuiceSplash
