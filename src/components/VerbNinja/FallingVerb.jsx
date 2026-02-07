import { useEffect, useRef } from 'react'

function FallingVerb({ verb, onFallOff }) {
    const elementRef = useRef(null)

    // Handle falling off screen
    useEffect(() => {
        const timer = setTimeout(() => {
            onFallOff()
        }, 15000) // Falls completely in 15 seconds (slower pace)

        return () => clearTimeout(timer)
    }, [onFallOff])

    // Random fruit colors for container
    const fruitColors = [
        'linear-gradient(135deg, #FF6B6B, #EE5A5A)',
        'linear-gradient(135deg, #4ECDC4, #44B3AB)',
        'linear-gradient(135deg, #45B7D1, #3AA5C0)',
        'linear-gradient(135deg, #96CEB4, #85BDA3)',
        'linear-gradient(135deg, #FFEAA7, #F0DB98)',
        'linear-gradient(135deg, #DDA0DD, #CC8FCC)',
        'linear-gradient(135deg, #F39C12, #E08E0B)',
    ]
    const fruitColor = fruitColors[verb.id % fruitColors.length]

    return (
        <div
            ref={elementRef}
            className="falling-verb fruit-style"
            data-verb-id={verb.id}
            style={{
                left: `${verb.x}%`,
                background: fruitColor
            }}
        >
            <span className="verb-text">{verb.conjugated}</span>
        </div>
    )
}

export default FallingVerb
