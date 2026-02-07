import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../common/Header'
import FallingVerb from './FallingVerb'
import HintDisplay from './HintDisplay'
import SliceTrail from './SliceTrail'
import JuiceSplash from './JuiceSplash'
import { useSound } from '../../hooks/useSound'
import { TENSES, getRandomTense, shuffleArray } from '../../utils/verbHelpers'
import verbs from '../../data/VerbenList.json'
import './VerbNinja.css'

const ROUND_DURATION = 15000 // 15 seconds for slicing (slower pace)
const SPAWN_COUNT = 7 // 6-7 verbs per round (2 correct + 4-5 distractors)
const CORRECT_COUNT = 2 // Always 2 correct answers (other two tenses)

function VerbNinjaGame({ soundEnabled, toggleSound, selectedVerbs, setGameResult }) {
    const navigate = useNavigate()
    const sound = useSound(soundEnabled)

    const [score, setScore] = useState(10) // Start with 10 points
    const [gameOver, setGameOver] = useState(false)
    const [roundActive, setRoundActive] = useState(false)
    const [hintVerb, setHintVerb] = useState(null)
    const [hintTense, setHintTense] = useState(null)
    const [hintFaded, setHintFaded] = useState(false)
    const [fallingVerbs, setFallingVerbs] = useState([])
    const [splashes, setSplashes] = useState([])
    const [sliceTrail, setSliceTrail] = useState([])
    const [roundStats, setRoundStats] = useState({ correct: 0, wrong: 0 })
    const [totalStats, setTotalStats] = useState({ correct: 0, wrong: 0, perfect: 0 })

    const verbQueueRef = useRef([])
    const verbIdRef = useRef(0)
    const roundTimerRef = useRef(null)
    const gameAreaRef = useRef(null)
    const isSlicingRef = useRef(false)

    // Initialize verb queue (cycle through all selected verbs)
    useEffect(() => {
        const queue = shuffleArray([...selectedVerbs.filter(v => verbs[v])])
        verbQueueRef.current = queue
    }, [selectedVerbs])

    // Get next verb from queue
    const getNextVerb = useCallback(() => {
        return verbQueueRef.current.pop()
    }, [])

    // Start a new round
    const startRound = useCallback(() => {
        if (gameOver || score <= 0) return

        // Get next verb and random tense for hint
        const verbName = getNextVerb()

        // If no more verbs, game completed!
        if (!verbName) {
            setGameResult({
                game: 'ninja',
                score,
                correct: totalStats.correct,
                mistakes: totalStats.wrong,
                maxStreak: totalStats.perfect,
                completed: true
            })
            navigate('/result')
            return
        }

        const verbData = verbs[verbName]
        const tense = getRandomTense()
        const hintForm = verbData[tense]

        setHintVerb({ name: verbName, form: hintForm, data: verbData })
        setHintTense(tense)
        setHintFaded(false)
        setRoundStats({ correct: 0, wrong: 0 })

        // After brief hint display, fade to corner and start spawning
        setTimeout(() => {
            setHintFaded(true)
            setRoundActive(true)
            spawnVerbs(verbName, verbData, tense)

            // End round after duration
            roundTimerRef.current = setTimeout(() => {
                endRound()
            }, ROUND_DURATION)
        }, 1500) // Show hint for 1.5 seconds before fading
    }, [gameOver, score, getNextVerb, totalStats, navigate, setGameResult])

    // Spawn verbs for the round
    const spawnVerbs = useCallback((targetVerbName, targetVerbData, hintTense) => {
        const newVerbs = []
        const allTenses = Object.values(TENSES)
        const correctTenses = allTenses.filter(t => t !== hintTense)

        // Add correct verbs (other two tenses)
        correctTenses.forEach(tense => {
            newVerbs.push({
                id: verbIdRef.current++,
                verbName: targetVerbName,
                conjugated: targetVerbData[tense],
                tense,
                isCorrect: true
            })
        })

        // Add distractors (random verbs, random tenses)
        const distractorCount = SPAWN_COUNT - CORRECT_COUNT
        const availableVerbs = selectedVerbs.filter(v => v !== targetVerbName && verbs[v])

        for (let i = 0; i < distractorCount && availableVerbs.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableVerbs.length)
            const distractorName = availableVerbs.splice(randomIndex, 1)[0]
            const distractorData = verbs[distractorName]
            const randomTense = getRandomTense()

            newVerbs.push({
                id: verbIdRef.current++,
                verbName: distractorName,
                conjugated: distractorData[randomTense],
                tense: randomTense,
                isCorrect: false
            })
        }

        // Shuffle the verbs first
        for (let i = newVerbs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[newVerbs[i], newVerbs[j]] = [newVerbs[j], newVerbs[i]]
        }

        // Assign evenly distributed spawn delays (spread over 12 seconds)
        const spawnInterval = 12000 / newVerbs.length
        newVerbs.forEach((v, i) => {
            v.spawnDelay = i * spawnInterval + Math.random() * 300 // Small random offset
        })

        // Assign X positions to avoid overlap - divide screen into zones
        const zones = [15, 30, 45, 60, 75] // 5 horizontal zones
        const shuffledZones = [...zones].sort(() => Math.random() - 0.5)
        newVerbs.forEach((v, i) => {
            const zoneIndex = i % shuffledZones.length
            v.x = shuffledZones[zoneIndex] + (Math.random() * 10 - 5) // Zone + small offset
        })

        // Schedule spawning
        newVerbs.forEach(verb => {
            setTimeout(() => {
                if (!gameOver) {
                    setFallingVerbs(prev => [...prev, { ...verb, spawned: true }])
                }
            }, verb.spawnDelay)
        })
    }, [selectedVerbs, gameOver])

    // End current round
    const endRound = useCallback(() => {
        setRoundActive(false)

        // Count missed correct verbs
        setFallingVerbs(prev => {
            const missed = prev.filter(v => v.isCorrect && !v.sliced).length
            if (missed > 0) {
                setScore(s => Math.max(0, s - missed))
                setTotalStats(ts => ({ ...ts, wrong: ts.wrong + missed }))
            }
            return []
        })

        // Check for perfect round bonus
        setRoundStats(rs => {
            if (rs.correct === 2 && rs.wrong === 0) {
                setScore(s => s + 1) // Perfect bonus
                setTotalStats(ts => ({ ...ts, perfect: ts.perfect + 1 }))
                sound.celebration()
            }
            return rs
        })

        // Start next round after brief delay
        setTimeout(() => {
            if (score > 0 && !gameOver) {
                startRound()
            }
        }, 300)
    }, [score, gameOver, sound, startRound])

    // Check for early round finish (all correct verbs sliced)
    useEffect(() => {
        if (roundActive && roundStats.correct >= CORRECT_COUNT) {
            clearTimeout(roundTimerRef.current)
            // Add small delay for player to see the last slice
            const timer = setTimeout(() => {
                endRound()
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [roundActive, roundStats, endRound])

    // Handle slice on a verb
    const handleSlice = useCallback((verb, x, y) => {
        if (verb.sliced) return

        // Mark as sliced
        setFallingVerbs(prev => prev.map(v =>
            v.id === verb.id ? { ...v, sliced: true } : v
        ))

        // Add splash effect
        const splashId = Date.now()
        setSplashes(prev => [...prev, {
            id: splashId,
            x,
            y,
            isCorrect: verb.isCorrect
        }])

        // Remove splash after animation
        setTimeout(() => {
            setSplashes(prev => prev.filter(s => s.id !== splashId))
        }, 800)

        if (verb.isCorrect) {
            sound.splatCorrect()
            setScore(s => s + 1)
            setRoundStats(rs => ({ ...rs, correct: rs.correct + 1 }))
            setTotalStats(ts => ({ ...ts, correct: ts.correct + 1 }))
        } else {
            sound.wrong()
            setScore(s => Math.max(0, s - 1))
            setRoundStats(rs => ({ ...rs, wrong: rs.wrong + 1 }))
            setTotalStats(ts => ({ ...ts, wrong: ts.wrong + 1 }))
        }
    }, [sound])

    // Handle verb falling off screen
    const handleVerbFallOff = useCallback((verb) => {
        if (verb.sliced) return
        setFallingVerbs(prev => prev.filter(v => v.id !== verb.id))
    }, [])

    // Mouse/touch tracking for slice trail
    const handlePointerMove = useCallback((e) => {
        if (!isSlicingRef.current) return

        const rect = gameAreaRef.current?.getBoundingClientRect()
        if (!rect) return

        const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left
        const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top

        setSliceTrail(prev => {
            const newTrail = [...prev, { x, y, time: Date.now() }]
            // Keep only recent points
            return newTrail.filter(p => Date.now() - p.time < 100)
        })

        // Check collision with falling verbs
        fallingVerbs.forEach(verb => {
            if (verb.sliced) return
            const verbEl = document.querySelector(`[data-verb-id="${verb.id}"]`)
            if (verbEl) {
                const verbRect = verbEl.getBoundingClientRect()
                const verbX = (e.clientX || e.touches?.[0]?.clientX)
                const verbY = (e.clientY || e.touches?.[0]?.clientY)

                if (verbX >= verbRect.left && verbX <= verbRect.right &&
                    verbY >= verbRect.top && verbY <= verbRect.bottom) {
                    handleSlice(verb, verbX - rect.left, verbY - rect.top)
                }
            }
        })
    }, [fallingVerbs, handleSlice])

    const handlePointerDown = useCallback((e) => {
        isSlicingRef.current = true
        handlePointerMove(e)
    }, [handlePointerMove])

    const handlePointerUp = useCallback(() => {
        isSlicingRef.current = false
        setSliceTrail([])
    }, [])

    // Check for game over
    useEffect(() => {
        if (score <= 0 && !gameOver) {
            setGameOver(true)
            clearTimeout(roundTimerRef.current)
            sound.gameOver()

            setTimeout(() => {
                setGameResult({
                    game: 'ninja',
                    score: 0,
                    correct: totalStats.correct,
                    mistakes: totalStats.wrong,
                    maxStreak: totalStats.perfect,
                    completed: true
                })
                navigate('/result')
            }, 1500)
        }
    }, [score, gameOver, totalStats, navigate, setGameResult, sound])

    // Start first round on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            startRound()
        }, 500)
        return () => clearTimeout(timer)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="verb-ninja-page">
            <Header
                title="🥷 Verben-Ninja"
                soundEnabled={soundEnabled}
                toggleSound={toggleSound}
            />

            <div className="ninja-game-header">
                <div className="ninja-score">
                    <span className="score-icon">💎</span>
                    <span className="score-value">{score}</span>
                </div>
                {totalStats.perfect > 0 && (
                    <div className="perfect-count">
                        <span>⭐ {totalStats.perfect}</span>
                    </div>
                )}
            </div>

            <HintDisplay
                verb={hintVerb}
                tense={hintTense}
                faded={hintFaded}
            />

            <main
                ref={gameAreaRef}
                className="ninja-game-area"
                data-gameover={gameOver}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
            >
                <SliceTrail points={sliceTrail} />

                {fallingVerbs.filter(v => v.spawned && !v.sliced).map(verb => (
                    <FallingVerb
                        key={verb.id}
                        verb={verb}
                        onFallOff={() => handleVerbFallOff(verb)}
                    />
                ))}

                {splashes.map(splash => (
                    <JuiceSplash
                        key={splash.id}
                        x={splash.x}
                        y={splash.y}
                        isCorrect={splash.isCorrect}
                    />
                ))}

                {gameOver && (
                    <div className="game-over-overlay">
                        <h2>Spiel vorbei!</h2>
                        <p>Dein Ergebnis wird geladen...</p>
                    </div>
                )}
            </main>
        </div>
    )
}

export default VerbNinjaGame
