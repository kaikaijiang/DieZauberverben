import './LandscapeWarning.css'

function LandscapeWarning() {
    return (
        <div className="landscape-warning">
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h1.5C23.44 4.84 18.29 0 12 0l-.66.03 3.81 3.81 1.33-1.32zM10.14 1.85L8.68 0.39C5.36 1.64 2.66 4.25 1.28 7.52l1.44.63c1.18-2.8 3.48-4.99 6.42-6.3zM7.52 21.48C4.25 19.94 1.91 16.76 1.55 13H.05c.51 6.16 5.66 11 11.95 11l.66-.03-3.81-3.81-1.33 1.32zm6.34.67l1.46 1.46c3.32-1.25 6.02-3.86 7.4-7.13l-1.44-.63c-1.18 2.8-3.48 4.99-6.42 6.3z" />
                <path d="M17 8H7c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 6H8v-4h8v4z" />
            </svg>
            <h2>Bitte drehe dein Gerät!</h2>
            <p>Dieses Spiel funktioniert am besten im Querformat.</p>
        </div>
    )
}

export default LandscapeWarning
