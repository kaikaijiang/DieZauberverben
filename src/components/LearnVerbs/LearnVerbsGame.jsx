import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../common/Header'
import VerbCard from './VerbCard'
import { useSound } from '../../hooks/useSound'
import { shuffleArray } from '../../utils/verbHelpers'
import verbs from '../../data/VerbenList.json'
import './LearnVerbs.css'

function LearnVerbsGame({ soundEnabled, toggleSound, selectedVerbs }) {
    const navigate = useNavigate()
    const sound = useSound(soundEnabled)

    const [currentIndex, setCurrentIndex] = useState(0)
    const [sessionComplete, setSessionComplete] = useState(false)

    // Create verb list from selected verbs
    const verbList = useMemo(() => {
        return shuffleArray(selectedVerbs.filter(v => verbs[v]).map(verbName => ({
            name: verbName,
            data: verbs[verbName]
        })))
    }, [selectedVerbs])

    const currentVerb = verbList[currentIndex]
    const totalVerbs = verbList.length
    const isLastVerb = currentIndex === totalVerbs - 1
    const isFirstVerb = currentIndex === 0

    // Handle navigation
    const handleNext = () => {
        if (isLastVerb) {
            setSessionComplete(true)
            sound.celebration()
        } else {
            setCurrentIndex(prev => prev + 1)
            sound.flip()
        }
    }

    const handlePrevious = () => {
        if (!isFirstVerb) {
            setCurrentIndex(prev => prev - 1)
            sound.flip()
        }
    }

    // Handle exit
    const handleExit = () => {
        navigate('/')
    }

    // Handle restart
    const handleRestart = () => {
        setCurrentIndex(0)
        setSessionComplete(false)
    }

    // Handle "Jetzt üben" - go to flashcards
    const handlePractice = () => {
        navigate('/select/flashcards')
    }

    if (verbList.length === 0) {
        return (
            <div className="learn-verbs-page">
                <Header title="📖 Verben lernen" soundEnabled={soundEnabled} toggleSound={toggleSound} />
                <div className="loading">Verben werden geladen...</div>
            </div>
        )
    }

    if (sessionComplete) {
        return (
            <div className="learn-verbs-page">
                <Header title="📖 Verben lernen" soundEnabled={soundEnabled} toggleSound={toggleSound} />
                <div className="completion-screen">
                    <div className="completion-content">
                        <div className="completion-icon">🎉</div>
                        <h2>Super gemacht!</h2>
                        <p className="completion-message">Du hast alle Verben durchgesehen!</p>
                        <div className="completion-actions">
                            <button className="btn-primary" onClick={handleRestart}>
                                🔄 Nochmal durchgehen
                            </button>
                            <button className="btn-secondary" onClick={handlePractice}>
                                📚 Jetzt üben!
                            </button>
                            <button className="btn-tertiary" onClick={handleExit}>
                                🏠 Zur Startseite
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="learn-verbs-page">
            <Header title="📖 Verben lernen" soundEnabled={soundEnabled} toggleSound={toggleSound} />

            <div className="learn-header">
                <button className="exit-btn" onClick={handleExit}>
                    ← Beenden
                </button>
                <div className="progress-container">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${((currentIndex + 1) / totalVerbs) * 100}%` }}
                        />
                    </div>
                    <span className="progress-text">
                        Verb {currentIndex + 1} / {totalVerbs}
                    </span>
                </div>
            </div>

            <main className="learn-content">
                {currentVerb && (
                    <VerbCard verb={currentVerb} />
                )}

                <div className="navigation-buttons">
                    <button
                        className="nav-btn nav-prev"
                        onClick={handlePrevious}
                        disabled={isFirstVerb}
                    >
                        ← Zurück
                    </button>
                    <button
                        className="nav-btn nav-next"
                        onClick={handleNext}
                    >
                        {isLastVerb ? 'Fertig! ✓' : 'Weiter →'}
                    </button>
                </div>
            </main>
        </div>
    )
}

export default LearnVerbsGame
