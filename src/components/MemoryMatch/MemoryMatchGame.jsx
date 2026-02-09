import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SeoWrapper from '../common/SeoWrapper'
import Header from '../common/Header'
import Card from './Card'
import { useSound } from '../../hooks/useSound'
import { generateMemoryPairs, shuffleArray, getTenseColorClass } from '../../utils/verbHelpers'
import verbs from '../../data/VerbenList.json'
import './MemoryMatch.css'

const DIFFICULTY_CONFIG = {
    easy: { pairs: 6, columns: 4, columnsPortrait: 3 },
    medium: { pairs: 8, columns: 4, columnsPortrait: 4 },
    hard: { pairs: 12, columns: 6, columnsPortrait: 4 }
}

function MemoryMatchGame({ soundEnabled, toggleSound, selectedVerbs, setGameResult }) {
    const navigate = useNavigate()
    const sound = useSound(soundEnabled)

    const difficulty = sessionStorage.getItem('memoryDifficulty') || 'easy'
    const config = DIFFICULTY_CONFIG[difficulty]

    const [cards, setCards] = useState([])
    const [flippedIndices, setFlippedIndices] = useState([])
    const [matchedPairs, setMatchedPairs] = useState([])
    const [score, setScore] = useState(0)
    const [moves, setMoves] = useState(0)
    const [isChecking, setIsChecking] = useState(false)
    const [gameStartTime, setGameStartTime] = useState(null)
    const [streak, setStreak] = useState(0)
    const [maxStreak, setMaxStreak] = useState(0)

    // Initialize game
    useEffect(() => {
        const pairs = generateMemoryPairs(verbs, selectedVerbs, config.pairs)

        // Create card deck - each pair creates 2 cards (verb + sentence)
        const deck = []
        pairs.forEach((pair, pairIndex) => {
            // Verb card
            deck.push({
                id: `verb-${pairIndex}`,
                pairId: pairIndex,
                type: 'verb',
                content: pair.conjugated,
                tense: pair.tense,
                verbName: pair.verbName
            })
            // Sentence card
            deck.push({
                id: `sentence-${pairIndex}`,
                pairId: pairIndex,
                type: 'sentence',
                content: pair.example,
                tense: pair.tense,
                verbName: pair.verbName
            })
        })

        setCards(shuffleArray(deck))
        setGameStartTime(Date.now())
    }, [selectedVerbs, config.pairs])

    const handleCardClick = useCallback((index) => {
        // Ignore if already flipped, matched, or checking
        if (isChecking) return
        if (flippedIndices.includes(index)) return
        if (matchedPairs.includes(cards[index]?.pairId)) return

        sound.flip()

        const newFlipped = [...flippedIndices, index]
        setFlippedIndices(newFlipped)

        // If we now have 2 flipped cards, check for match
        if (newFlipped.length === 2) {
            setMoves(m => m + 1)
            setIsChecking(true)

            const [firstIndex, secondIndex] = newFlipped
            const firstCard = cards[firstIndex]
            const secondCard = cards[secondIndex]

            if (firstCard.pairId === secondCard.pairId) {
                // Match found!
                setTimeout(() => {
                    sound.match()
                    setMatchedPairs(prev => [...prev, firstCard.pairId])
                    setFlippedIndices([])
                    setScore(s => s + 10 + streak * 2)
                    setStreak(s => {
                        const newStreak = s + 1
                        setMaxStreak(m => Math.max(m, newStreak))
                        return newStreak
                    })
                    setIsChecking(false)
                }, 600)
            } else {
                // No match
                setTimeout(() => {
                    sound.wrong()
                    setFlippedIndices([])
                    setStreak(0)
                    setIsChecking(false)
                }, 1000)
            }
        }
    }, [cards, flippedIndices, matchedPairs, isChecking, sound, streak])

    // Check for game completion
    useEffect(() => {
        if (matchedPairs.length > 0 && matchedPairs.length === config.pairs) {
            const endTime = Date.now()
            const timeSeconds = Math.floor((endTime - gameStartTime) / 1000)

            sound.celebration()

            setTimeout(() => {
                setGameResult({
                    game: 'memory',
                    score,
                    correct: matchedPairs.length,
                    mistakes: moves - matchedPairs.length,
                    timeSeconds,
                    maxStreak,
                    completed: true
                })
                navigate('/result')
            }, 1500)
        }
    }, [matchedPairs, config.pairs, gameStartTime, moves, score, maxStreak, navigate, setGameResult, sound])

    const isCardFlipped = (index) => {
        return flippedIndices.includes(index) || matchedPairs.includes(cards[index]?.pairId)
    }

    const isCardMatched = (index) => {
        return matchedPairs.includes(cards[index]?.pairId)
    }

    return (
        <SeoWrapper title="Gedächtnisspiel" description="Finde die passenden Verben-Paare." canonical="/play/memory">
            <div className="memory-match-page">
                <Header
                    title="🧠 Gedächtnisspiel"
                    soundEnabled={soundEnabled}
                    toggleSound={toggleSound}
                />

                <div className="game-stats">
                    <div className="stat-box">
                        <span className="stat-icon">🎯</span>
                        <span className="stat-value">{score}</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-icon">🔄</span>
                        <span className="stat-value">{moves}</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-icon">✨</span>
                        <span className="stat-value">{matchedPairs.length}/{config.pairs}</span>
                    </div>
                    {streak >= 2 && (
                        <div className="stat-box streak">
                            <span className="stat-icon">🔥</span>
                            <span className="stat-value">{streak}</span>
                        </div>
                    )}
                </div>

                <main className="memory-game-area">
                    <div
                        className="card-grid"
                        style={{
                            '--columns': config.columns,
                            '--columns-portrait': config.columnsPortrait
                        }}
                    >
                        {cards.map((card, index) => (
                            <Card
                                key={card.id}
                                card={card}
                                isFlipped={isCardFlipped(index)}
                                isMatched={isCardMatched(index)}
                                onClick={() => handleCardClick(index)}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </SeoWrapper>
    )
}

export default MemoryMatchGame
