import { useNavigate } from 'react-router-dom'
import Header from '../components/common/Header'
import OwlMascot from '../components/common/OwlMascot'
import './GameResultPage.css'

const BADGES = [
    { id: 'beginner', icon: '⭐', label: 'Anfänger', condition: (r) => r.completed },
    { id: 'fast', icon: '🌟', label: 'Schnell', condition: (r) => r.timeSeconds && r.timeSeconds < 120 },
    { id: 'streak', icon: '🔥', label: 'Strähne', condition: (r) => r.maxStreak >= 5 },
    { id: 'perfect', icon: '💯', label: 'Perfekt!', condition: (r) => r.mistakes === 0 },
    { id: 'master', icon: '🏆', label: 'Meister', condition: (r) => r.score >= 100 },
    { id: 'friend', icon: '🦉', label: 'Eulenfreund', condition: (r) => r.gamesPlayed >= 3 }
]

function GameResultPage({ soundEnabled, toggleSound, gameResult }) {
    const navigate = useNavigate()

    if (!gameResult) {
        return (
            <div className="result-page">
                <Header
                    title="Ergebnis"
                    soundEnabled={soundEnabled}
                    toggleSound={toggleSound}
                    showBack={false}
                />
                <main className="result-content">
                    <p>Kein Spielergebnis vorhanden.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Zur Startseite
                    </button>
                </main>
            </div>
        )
    }

    const earnedBadges = BADGES.filter(badge => badge.condition(gameResult))
    const owlExpression = gameResult.mistakes === 0 ? 'excited' : gameResult.score > 50 ? 'happy' : 'thinking'

    return (
        <div className="result-page">
            <Header
                title="🎉 Geschafft!"
                soundEnabled={soundEnabled}
                toggleSound={toggleSound}
                showBack={false}
            />

            <main className="result-content">
                <div className="result-card animate-slideUp">
                    <div className="result-mascot">
                        <OwlMascot expression={owlExpression} size="large" />
                    </div>

                    <div className="result-message">
                        {gameResult.mistakes === 0 ? (
                            <h2>Fantastisch! Perfekte Runde! 🌟</h2>
                        ) : gameResult.score > 50 ? (
                            <h2>Super gemacht! 👏</h2>
                        ) : (
                            <h2>Gut gespielt! Weiter so! 💪</h2>
                        )}
                    </div>

                    <div className="result-stats">
                        <div className="stat-item">
                            <span className="stat-icon">🎯</span>
                            <span className="stat-value">{gameResult.score}</span>
                            <span className="stat-label">Punkte</span>
                        </div>

                        {gameResult.correct !== undefined && (
                            <div className="stat-item">
                                <span className="stat-icon">✅</span>
                                <span className="stat-value">{gameResult.correct}</span>
                                <span className="stat-label">Richtig</span>
                            </div>
                        )}

                        {gameResult.mistakes !== undefined && (
                            <div className="stat-item">
                                <span className="stat-icon">❌</span>
                                <span className="stat-value">{gameResult.mistakes}</span>
                                <span className="stat-label">Fehler</span>
                            </div>
                        )}

                        {gameResult.timeSeconds !== undefined && (
                            <div className="stat-item">
                                <span className="stat-icon">⏱️</span>
                                <span className="stat-value">
                                    {Math.floor(gameResult.timeSeconds / 60)}:{String(gameResult.timeSeconds % 60).padStart(2, '0')}
                                </span>
                                <span className="stat-label">Zeit</span>
                            </div>
                        )}
                    </div>

                    {earnedBadges.length > 0 && (
                        <div className="result-badges">
                            <h3>Verdiente Abzeichen:</h3>
                            <div className="badges-list">
                                {earnedBadges.map(badge => (
                                    <div key={badge.id} className="badge animate-bounce">
                                        <span className="badge-icon">{badge.icon}</span>
                                        <span className="badge-label">{badge.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="result-actions">
                        <button
                            className="btn btn-success"
                            onClick={() => navigate(-2)}
                        >
                            🔄 Nochmal spielen
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/')}
                        >
                            🏠 Zur Startseite
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default GameResultPage
