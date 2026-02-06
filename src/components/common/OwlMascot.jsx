import './OwlMascot.css'

function OwlMascot({ expression = 'happy', size = 'medium', animate = true }) {
    const getBodyColor = () => {
        switch (expression) {
            case 'excited': return '#8B5A2B';
            case 'thinking': return '#6B4423';
            case 'sad': return '#5C4033';
            default: return '#7B4B2A';
        }
    }

    const getEyeStyle = () => {
        switch (expression) {
            case 'excited': return { scaleY: 1.2 };
            case 'thinking': return { transform: 'translateX(3px)' };
            case 'sad': return { scaleY: 0.7 };
            case 'wink': return {};
            default: return {};
        }
    }

    const sizeMap = {
        small: 60,
        medium: 100,
        large: 150,
        xlarge: 200
    }

    const dimension = sizeMap[size] || sizeMap.medium

    return (
        <div
            className={`owl-mascot ${animate ? 'animate' : ''}`}
            style={{ width: dimension, height: dimension }}
        >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Body */}
                <ellipse cx="50" cy="60" rx="35" ry="35" fill={getBodyColor()} />

                {/* Belly */}
                <ellipse cx="50" cy="68" rx="22" ry="22" fill="#D4A574" />
                <ellipse cx="50" cy="72" rx="16" ry="16" fill="#E8C9A0" />

                {/* Ear tufts */}
                <path d="M25 30 L30 45 L20 42 Z" fill={getBodyColor()} />
                <path d="M75 30 L70 45 L80 42 Z" fill={getBodyColor()} />

                {/* Head */}
                <circle cx="50" cy="35" r="28" fill={getBodyColor()} />

                {/* Face disc */}
                <circle cx="50" cy="38" r="22" fill="#E8D4B8" />

                {/* Eyes */}
                <g style={getEyeStyle()}>
                    {/* Left eye white */}
                    <circle cx="38" cy="35" r="10" fill="white" />
                    {/* Right eye white */}
                    <circle cx="62" cy="35" r="10" fill="white" />

                    {/* Left pupil */}
                    <circle cx="39" cy="36" r="5" fill="#2C1810" />
                    {/* Right pupil */}
                    {expression === 'wink' ? (
                        <path d="M56 36 Q62 33 68 36" stroke="#2C1810" strokeWidth="2" fill="none" />
                    ) : (
                        <circle cx="61" cy="36" r="5" fill="#2C1810" />
                    )}

                    {/* Eye shine */}
                    <circle cx="40" cy="34" r="2" fill="white" />
                    {expression !== 'wink' && <circle cx="62" cy="34" r="2" fill="white" />}
                </g>

                {/* Beak */}
                <path d="M45 42 L50 52 L55 42 Z" fill="#F5A623" />

                {/* Eyebrows based on expression */}
                {expression === 'thinking' && (
                    <>
                        <path d="M28 28 Q38 25 45 28" stroke="#5C4033" strokeWidth="2" fill="none" />
                        <path d="M55 28 Q62 25 72 28" stroke="#5C4033" strokeWidth="2" fill="none" />
                    </>
                )}
                {expression === 'excited' && (
                    <>
                        <path d="M28 26 Q38 22 45 26" stroke="#5C4033" strokeWidth="2" fill="none" />
                        <path d="M55 26 Q62 22 72 26" stroke="#5C4033" strokeWidth="2" fill="none" />
                    </>
                )}

                {/* Wings */}
                <ellipse cx="22" cy="60" rx="8" ry="18" fill="#6B4423" />
                <ellipse cx="78" cy="60" rx="8" ry="18" fill="#6B4423" />

                {/* Feet */}
                <ellipse cx="40" cy="92" rx="8" ry="4" fill="#F5A623" />
                <ellipse cx="60" cy="92" rx="8" ry="4" fill="#F5A623" />

                {/* Graduation cap for 'smart' expression */}
                {expression === 'smart' && (
                    <>
                        <rect x="30" y="8" width="40" height="5" fill="#2C3E50" />
                        <polygon points="50,0 25,12 50,17 75,12" fill="#2C3E50" />
                        <line x1="70" y1="12" x2="75" y2="25" stroke="#F5A623" strokeWidth="2" />
                        <circle cx="76" cy="27" r="3" fill="#F5A623" />
                    </>
                )}
            </svg>
        </div>
    )
}

export default OwlMascot
