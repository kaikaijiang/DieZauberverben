import { Link } from 'react-router-dom'
import SeoWrapper from '../components/common/SeoWrapper'
import SoundToggle from '../components/common/SoundToggle'
import OwlMascot from '../components/common/OwlMascot'
import './HomePage.css'

function HomePage({ soundEnabled, toggleSound }) {
    const games = [
        {
            id: 'learn',
            title: 'Verben lernen',
            emoji: '📖',
            description: 'Schau dir die Verben an!',
            color: '#9B59B6'
        },
        {
            id: 'flashcards',
            title: 'Verbkarten',
            emoji: '📚',
            description: 'Test mal!',
            color: '#8E44AD'
        },
        {
            id: 'memory',
            title: 'Gedächtnisspiel',
            emoji: '🧠',
            description: 'Finde die passenden Paare!',
            color: '#4A90D9'
        },
        {
            id: 'ninja',
            title: 'Verben-Ninja',
            emoji: '🥷',
            description: 'Schnell und geschickt!',
            color: '#F5A623'
        },
        {
            id: 'fill',
            title: 'Lückenfüller',
            emoji: '🎯',
            description: 'Finde das richtige Verb!',
            color: '#7ED321'
        }
    ]

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Die Zauberverben',
        'url': 'https://diezauberverben.de/',
        'description': 'Lerne starke deutsche Verben mit Spaß! Interaktive Spiele wie Verben-Ninja, Memory und mehr für Schüler.',
        'potentialAction': {
            '@type': 'SearchAction',
            'target': 'https://diezauberverben.de/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
        }
    }

    return (
        <SeoWrapper
            title="Home"
            description="Lerne starke deutsche Verben mit Spaß! Interaktive Spiele wie Verben-Ninja, Memory und mehr für Schüler."
            canonical="/"
            jsonLd={jsonLd}
        >
            <div className="home-page">
                <header className="home-header">
                    <div className="header-spacer" />
                    <div className="home-title">
                        <h1>Die Zauberverben</h1>
                        <p className="subtitle">Lerne starke Verben spielerisch! ✨</p>
                    </div>
                    <div className="header-actions">
                        <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
                    </div>
                </header>

                <main className="home-content">
                    <div className="mascot-section">
                        <OwlMascot expression="happy" size="xlarge" />
                        <div className="speech-bubble">
                            <p>Hallo! Ich bin Uhu, deine Lernbegleitung! 🦉</p>
                            <p>Wähle ein Spiel und los geht's!</p>
                        </div>
                    </div>

                    <div className="games-grid">
                        {games.map(game => (
                            <Link
                                key={game.id}
                                to={`/select/${game.id}`}
                                className="game-card"
                                style={{ '--game-color': game.color }}
                            >
                                <div className="game-emoji">{game.emoji}</div>
                                <h2 className="game-title">{game.title}</h2>
                                <p className="game-description">{game.description}</p>
                                <div className="game-play-btn">
                                    {['learn', 'flashcards'].includes(game.id) ? 'Lernen' : 'Spielen'}
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </main>

                <footer className="home-footer">
                    <p>🌟 Viel Spaß beim Lernen! 🌟</p>
                </footer>
            </div>
        </SeoWrapper>
    )
}

export default HomePage
