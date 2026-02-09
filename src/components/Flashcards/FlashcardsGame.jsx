import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SeoWrapper from '../common/SeoWrapper'
import Header from '../common/Header'
import Flashcard from './Flashcard'
import { useSound } from '../../hooks/useSound'
import { TENSES, shuffleArray } from '../../utils/verbHelpers'
import verbs from '../../data/VerbenList.json'
import './Flashcards.css'

function FlashcardsGame({ soundEnabled, toggleSound, selectedVerbs, setGameResult }) {
    const navigate = useNavigate()
    const sound = useSound(soundEnabled)

    const [cards, setCards] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [learnedCards, setLearnedCards] = useState(new Set())
    const [reviewPile, setReviewPile] = useState([])
    const [totalReviewed, setTotalReviewed] = useState(0)
    const [sessionComplete, setSessionComplete] = useState(false)

    const cardQueueRef = useRef([])

    // Generate cards on mount
    useEffect(() => {
        const generatedCards = []
        const tenseKeys = Object.values(TENSES)

        selectedVerbs.forEach(verbName => {
            const verbData = verbs[verbName]
            if (!verbData) return

            tenseKeys.forEach(tense => {
                generatedCards.push({
                    id: `${verbName}-${tense}`,
                    verbName,
                    targetTense: tense,
                    answer: verbData[tense],
                    allForms: {
                        [TENSES.PRAESENS]: verbData[TENSES.PRAESENS],
                        [TENSES.PRAETERITUM]: verbData[TENSES.PRAETERITUM],
                        [TENSES.PERFEKT]: verbData[TENSES.PERFEKT]
                    },
                    example: verbData[`${tense}_example`]?.[0] || '',
                    learned: false
                })
            })
        })

        const shuffled = shuffleArray(generatedCards)
        setCards(shuffled)
        cardQueueRef.current = shuffled.map(c => c.id)
    }, [selectedVerbs])

    // Get current card
    const currentCard = cards.find(c => c.id === cardQueueRef.current[currentIndex])

    // Handle card flip
    const handleFlip = useCallback(() => {
        if (!isFlipped) {
            setIsFlipped(true)
            sound.flip()
        }
    }, [isFlipped, sound])

    // Handle "Wusste ich" (knew it)
    const handleKnewIt = useCallback(() => {
        if (!currentCard) return

        sound.correct()
        setTotalReviewed(prev => prev + 1)

        // Mark as learned
        setLearnedCards(prev => new Set([...prev, currentCard.id]))

        // Small chance (20%) of returning for reinforcement
        if (Math.random() < 0.2 && !learnedCards.has(currentCard.id)) {
            // Add back to queue later (after 5+ cards)
            const insertPos = Math.min(currentIndex + 5 + Math.floor(Math.random() * 3), cardQueueRef.current.length)
            cardQueueRef.current.splice(insertPos, 0, currentCard.id)
        }

        moveToNext()
    }, [currentCard, sound, learnedCards, currentIndex])

    // Handle "Nochmal üben" (study again)
    const handleStudyAgain = useCallback(() => {
        if (!currentCard) return

        sound.wrong()
        setTotalReviewed(prev => prev + 1)

        // Add back to queue after 3-5 cards
        const insertPos = Math.min(currentIndex + 3 + Math.floor(Math.random() * 3), cardQueueRef.current.length)
        cardQueueRef.current.splice(insertPos, 0, currentCard.id)

        moveToNext()
    }, [currentCard, sound, currentIndex])

    // Move to next card
    const moveToNext = useCallback(() => {
        setIsFlipped(false)

        // Check if all cards are learned
        const remainingCards = cardQueueRef.current.slice(currentIndex + 1)
        const allLearned = remainingCards.every(id => learnedCards.has(id))

        if (remainingCards.length === 0 || allLearned) {
            // Session complete!
            setTimeout(() => {
                setSessionComplete(true)
                sound.celebration()
            }, 300)
        } else {
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1)
            }, 300)
        }
    }, [currentIndex, learnedCards, sound])

    // Handle exit
    const handleExit = useCallback(() => {
        navigate('/')
    }, [navigate])

    // Handle restart
    const handleRestart = useCallback(() => {
        setCurrentIndex(0)
        setIsFlipped(false)
        setLearnedCards(new Set())
        setTotalReviewed(0)
        setSessionComplete(false)
        cardQueueRef.current = shuffleArray(cards.map(c => c.id))
    }, [cards])

    // Handle "Jetzt spielen" - go to game selection
    const handlePlayGames = useCallback(() => {
        navigate('/')
    }, [navigate])

    // Progress calculation
    const totalCards = cards.length
    const progress = totalCards > 0 ? Math.round((learnedCards.size / totalCards) * 100) : 0

    if (cards.length === 0) {
        return (
            <SeoWrapper title="Verbkarten" description="Teste dein Wissen mit interaktiven Verbkarten." canonical="/play/flashcards">
                <div className="flashcards-page">
                    <Header title="📚 Verbkarten" soundEnabled={soundEnabled} toggleSound={toggleSound} />
                    <div className="loading">Karten werden geladen...</div>
                </div>
            </SeoWrapper>
        )
    }

    if (sessionComplete) {
        return (
            <SeoWrapper title="Verbkarten - Fertig!" description="Du hast die Verbkarten gemeistert!" canonical="/play/flashcards">
                <div className="flashcards-page">
                    <Header title="📚 Verbkarten" soundEnabled={soundEnabled} toggleSound={toggleSound} />
                    <div className="completion-screen">
                        <div className="completion-content">
                            <div className="completion-icon">🎉</div>
                            <h2>Geschafft!</h2>
                            <p className="completion-stat">
                                <span className="stat-number">{totalReviewed}</span>
                                <span className="stat-label">Karten durchgearbeitet</span>
                            </p>
                            <div className="completion-actions">
                                <button className="btn-primary" onClick={handleRestart}>
                                    🔄 Nochmal üben
                                </button>
                                <button className="btn-secondary" onClick={handlePlayGames}>
                                    🎮 Jetzt spielen!
                                </button>
                                <button className="btn-tertiary" onClick={handleExit}>
                                    🏠 Zur Startseite
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </SeoWrapper>
        )
    }

    return (
        <SeoWrapper title="Verbkarten" description="Teste dein Wissen mit interaktiven Verbkarten." canonical="/play/flashcards">
            <div className="flashcards-page">
                <Header title="📚 Verbkarten" soundEnabled={soundEnabled} toggleSound={toggleSound} />

                <div className="flashcards-header">
                    <button className="exit-btn" onClick={handleExit}>
                        ← Beenden
                    </button>
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="progress-text">
                            {learnedCards.size} / {totalCards} Karten
                        </span>
                    </div>
                </div>

                <main className="flashcards-content">
                    {currentCard && (
                        <Flashcard
                            card={currentCard}
                            isFlipped={isFlipped}
                            onFlip={handleFlip}
                        />
                    )}

                    {isFlipped && (
                        <div className="assessment-buttons">
                            <button
                                className="btn-study-again"
                                onClick={handleStudyAgain}
                            >
                                ✗ Nochmal üben
                            </button>
                            <button
                                className="btn-knew-it"
                                onClick={handleKnewIt}
                            >
                                ✓ Wusste ich!
                            </button>
                        </div>
                    )}

                    {!isFlipped && (
                        <p className="flip-hint">Tippe auf die Karte zum Umdrehen</p>
                    )}
                </main>
            </div>
        </SeoWrapper>
    )
}

export default FlashcardsGame
