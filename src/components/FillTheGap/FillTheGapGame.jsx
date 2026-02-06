import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../common/Header'
import Sentence from './Sentence'
import DraggableVerb from './DraggableVerb'
import { useSound } from '../../hooks/useSound'
import {
    TENSES,
    getRandomExampleSentence,
    generateDistractors,
    shuffleArray,
    getTenseColorClass
} from '../../utils/verbHelpers'
import verbs from '../../data/VerbenList.json'
import './FillTheGap.css'

const QUESTIONS_PER_ROUND = 10

function FillTheGapGame({ soundEnabled, toggleSound, selectedVerbs, setGameResult }) {
    const navigate = useNavigate()
    const sound = useSound(soundEnabled)

    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [correct, setCorrect] = useState(0)
    const [mistakes, setMistakes] = useState(0)
    const [streak, setStreak] = useState(0)
    const [maxStreak, setMaxStreak] = useState(0)
    const [answered, setAnswered] = useState(false)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(null)

    // Generate questions
    useEffect(() => {
        const generatedQuestions = []
        const availableVerbs = selectedVerbs.filter(v => verbs[v])
        const shuffledVerbs = shuffleArray(availableVerbs)

        for (let i = 0; i < QUESTIONS_PER_ROUND && i < shuffledVerbs.length * 3; i++) {
            const verbName = shuffledVerbs[i % shuffledVerbs.length]
            const verbData = verbs[verbName]
            const tense = Object.values(TENSES)[i % 3]

            const sentence = getRandomExampleSentence(verbData, tense)
            if (!sentence) continue

            const conjugated = verbData[tense]

            // Generate distractors (different verbs, same tense)
            const distractors = generateDistractors(verbs, verbName, tense, 3)

            // Create answer options
            const options = shuffleArray([
                { id: 'correct', verbName, conjugated, tense, isCorrect: true },
                ...distractors.map((d, idx) => ({
                    id: `distractor-${idx}`,
                    verbName: d.verbName,
                    conjugated: d.conjugatedForm,
                    tense: d.tense,
                    isCorrect: false
                }))
            ])

            generatedQuestions.push({
                id: i,
                verbName,
                tense,
                sentence,
                conjugated,
                options
            })
        }

        setQuestions(generatedQuestions.slice(0, QUESTIONS_PER_ROUND))
    }, [selectedVerbs])

    const currentQuestion = questions[currentIndex]

    // Handle answer selection via drag-and-drop or click
    const handleAnswer = useCallback((option) => {
        if (answered) return

        setAnswered(true)
        setSelectedAnswer(option.id)

        if (option.isCorrect) {
            setIsCorrectAnswer(true)
            sound.correct()
            sound.drop()
            setScore(s => s + 10 + streak * 2)
            setCorrect(c => c + 1)
            setStreak(s => {
                const newStreak = s + 1
                setMaxStreak(m => Math.max(m, newStreak))
                return newStreak
            })
        } else {
            setIsCorrectAnswer(false)
            sound.wrong()
            setMistakes(m => m + 1)
            setStreak(0)
        }

        // Auto-advance after delay
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(i => i + 1)
                setAnswered(false)
                setSelectedAnswer(null)
                setIsCorrectAnswer(null)
            } else {
                // Game complete
                sound.celebration()
                setTimeout(() => {
                    setGameResult({
                        game: 'fill',
                        score: score + (option.isCorrect ? 10 + streak * 2 : 0),
                        correct: correct + (option.isCorrect ? 1 : 0),
                        mistakes: mistakes + (option.isCorrect ? 0 : 1),
                        maxStreak: Math.max(maxStreak, option.isCorrect ? streak + 1 : streak),
                        completed: true
                    })
                    navigate('/result')
                }, 500)
            }
        }, 1500)
    }, [answered, currentIndex, questions.length, sound, streak, score, correct, mistakes, maxStreak, setGameResult, navigate])

    // Create sentence with blank
    const sentenceWithBlank = useMemo(() => {
        if (!currentQuestion) return { before: '', after: '' }

        const { sentence, conjugated } = currentQuestion
        const index = sentence.toLowerCase().indexOf(conjugated.toLowerCase())

        if (index === -1) {
            // Verb not found literally, just show sentence with blank at end
            return { before: sentence.replace(/[.!?]$/, ''), after: '.' }
        }

        return {
            before: sentence.slice(0, index),
            after: sentence.slice(index + conjugated.length)
        }
    }, [currentQuestion])

    if (!currentQuestion) {
        return (
            <div className="fill-gap-page">
                <Header
                    title="🎯 Lückenfüller"
                    soundEnabled={soundEnabled}
                    toggleSound={toggleSound}
                />
                <main className="fill-loading">
                    <p>Fragen werden geladen...</p>
                </main>
            </div>
        )
    }

    return (
        <div className="fill-gap-page">
            <Header
                title="🎯 Lückenfüller"
                soundEnabled={soundEnabled}
                toggleSound={toggleSound}
            />

            <div className="fill-game-header">
                <div className="progress-indicator">
                    <span className="progress-current">{currentIndex + 1}</span>
                    <span className="progress-sep">/</span>
                    <span className="progress-total">{questions.length}</span>
                </div>
                <div className="fill-score">
                    <span className="score-icon">🎯</span>
                    <span className="score-value">{score}</span>
                </div>
                {streak >= 2 && (
                    <div className="fill-streak">
                        <span>🔥 {streak}</span>
                    </div>
                )}
            </div>

            <main className="fill-game-area">
                <Sentence
                    before={sentenceWithBlank.before}
                    after={sentenceWithBlank.after}
                    answer={answered ? currentQuestion.conjugated : null}
                    isCorrect={isCorrectAnswer}
                    tense={currentQuestion.tense}
                />

                <div className="options-area">
                    <p className="options-instruction">Wähle das richtige Verb:</p>
                    <div className="options-grid">
                        {currentQuestion.options.map(option => (
                            <DraggableVerb
                                key={option.id}
                                option={option}
                                onClick={() => handleAnswer(option)}
                                disabled={answered}
                                selected={selectedAnswer === option.id}
                                showResult={answered}
                            />
                        ))}
                    </div>
                </div>

                {answered && (
                    <div className={`feedback-message ${isCorrectAnswer ? 'correct' : 'wrong'}`}>
                        {isCorrectAnswer ? (
                            <span>✅ Richtig! Super gemacht!</span>
                        ) : (
                            <span>❌ Leider falsch. Die Antwort war: <strong>{currentQuestion.conjugated}</strong></span>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

export default FillTheGapGame
