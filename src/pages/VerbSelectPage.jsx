import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SeoWrapper from '../components/common/SeoWrapper'
import Header from '../components/common/Header'
import VerbSelector from '../components/common/VerbSelector'
import OwlMascot from '../components/common/OwlMascot'
import verbs from '../data/VerbenList.json'
import './VerbSelectPage.css'

const GAME_INFO = {
    learn: {
        title: 'Verben lernen',
        emoji: '📖',
        path: '/play/learn',
        hasDifficulty: false
    },
    flashcards: {
        title: 'Verbkarten',
        emoji: '📚',
        path: '/play/flashcards',
        hasDifficulty: false
    },
    memory: {
        title: 'Gedächtnisspiel',
        emoji: '🧠',
        path: '/play/memory',
        hasDifficulty: true
    },
    ninja: {
        title: 'Verben-Ninja',
        emoji: '🥷',
        path: '/play/ninja',
        hasDifficulty: false
    },
    fill: {
        title: 'Lückenfüller',
        emoji: '🎯',
        path: '/play/fill',
        hasDifficulty: false
    }
}

const DIFFICULTIES = [
    { id: 'easy', label: 'Leicht', pairs: 6, grid: '3×4' },
    { id: 'medium', label: 'Mittel', pairs: 8, grid: '4×4' },
    { id: 'hard', label: 'Schwer', pairs: 12, grid: '4×6' }
]

function VerbSelectPage({ soundEnabled, toggleSound, setSelectedVerbs }) {
    const { game } = useParams()
    const navigate = useNavigate()
    const gameInfo = GAME_INFO[game]

    const verbList = useMemo(() => Object.keys(verbs), [])
    const [selected, setSelected] = useState(() => verbList.slice(0, Math.min(10, verbList.length)))
    const [difficulty, setDifficulty] = useState('easy')

    useEffect(() => {
        if (!gameInfo) {
            navigate('/')
        }
    }, [gameInfo, navigate])

    const handleStartGame = () => {
        if (selected.length < 10) return

        setSelectedVerbs(selected)

        // Store difficulty for memory game
        if (gameInfo.hasDifficulty) {
            sessionStorage.setItem('memoryDifficulty', difficulty)
        }

        navigate(gameInfo.path)
    }

    if (!gameInfo) return null

    return (
        <SeoWrapper
            title={`Wähle dein Spiel - ${gameInfo.title}`}
            description={`Wähle Verben für ${gameInfo.title} und beginne zu üben.`}
            canonical={`/select/${game}`}
        >
            <div className="verb-select-page">
                <Header
                    title={`${gameInfo.emoji} ${gameInfo.title}`}
                    soundEnabled={soundEnabled}
                    toggleSound={toggleSound}
                />

                <main className="verb-select-content">
                    <div className="verb-select-layout">
                        <div className="mascot-helper">
                            <OwlMascot expression="thinking" size="medium" />
                            <div className="helper-text">
                                <p>Wähle die Verben aus, die du üben möchtest!</p>
                            </div>
                        </div>

                        <div className="selection-card">
                            <VerbSelector
                                verbs={verbs}
                                selectedVerbs={selected}
                                onSelectionChange={setSelected}
                                minVerbs={10}
                                maxVerbs={verbList.length}
                            />
                        </div>
                    </div>

                    {gameInfo.hasDifficulty && (
                        <div className="difficulty-section">
                            <h3>Schwierigkeit wählen:</h3>
                            <div className="difficulty-options">
                                {DIFFICULTIES.map(diff => (
                                    <button
                                        key={diff.id}
                                        className={`difficulty-btn ${difficulty === diff.id ? 'active' : ''}`}
                                        onClick={() => setDifficulty(diff.id)}
                                    >
                                        <span className="diff-label">{diff.label}</span>
                                        <span className="diff-info">{diff.pairs} Paare ({diff.grid})</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="start-section">
                        <button
                            className="btn btn-success start-btn"
                            onClick={handleStartGame}
                            disabled={selected.length < 10}
                        >
                            Spiel starten! 🚀
                        </button>
                        {selected.length < 10 && (
                            <p className="start-warning">
                                Mindestens 10 Verben auswählen
                            </p>
                        )}
                    </div>
                </main>
            </div>
        </SeoWrapper>
    )
}

export default VerbSelectPage
