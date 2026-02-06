import { Routes, Route } from 'react-router-dom'
import { useState, useCallback } from 'react'
import HomePage from './pages/HomePage'
import VerbSelectPage from './pages/VerbSelectPage'
import MemoryMatchGame from './components/MemoryMatch/MemoryMatchGame'
import VerbNinjaGame from './components/VerbNinja/VerbNinjaGame'
import FillTheGapGame from './components/FillTheGap/FillTheGapGame'
import GameResultPage from './pages/GameResultPage'
import LandscapeWarning from './components/common/LandscapeWarning'

function App() {
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [selectedVerbs, setSelectedVerbs] = useState([])
    const [gameResult, setGameResult] = useState(null)

    const toggleSound = useCallback(() => {
        setSoundEnabled(prev => !prev)
    }, [])

    return (
        <div className="app">
            <LandscapeWarning />
            <div className="app-content">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <HomePage
                                soundEnabled={soundEnabled}
                                toggleSound={toggleSound}
                            />
                        }
                    />
                    <Route
                        path="/select/:game"
                        element={
                            <VerbSelectPage
                                soundEnabled={soundEnabled}
                                toggleSound={toggleSound}
                                setSelectedVerbs={setSelectedVerbs}
                            />
                        }
                    />
                    <Route
                        path="/play/memory"
                        element={
                            <MemoryMatchGame
                                soundEnabled={soundEnabled}
                                toggleSound={toggleSound}
                                selectedVerbs={selectedVerbs}
                                setGameResult={setGameResult}
                            />
                        }
                    />
                    <Route
                        path="/play/ninja"
                        element={
                            <VerbNinjaGame
                                soundEnabled={soundEnabled}
                                toggleSound={toggleSound}
                                selectedVerbs={selectedVerbs}
                                setGameResult={setGameResult}
                            />
                        }
                    />
                    <Route
                        path="/play/fill"
                        element={
                            <FillTheGapGame
                                soundEnabled={soundEnabled}
                                toggleSound={toggleSound}
                                selectedVerbs={selectedVerbs}
                                setGameResult={setGameResult}
                            />
                        }
                    />
                    <Route
                        path="/result"
                        element={
                            <GameResultPage
                                soundEnabled={soundEnabled}
                                toggleSound={toggleSound}
                                gameResult={gameResult}
                            />
                        }
                    />
                </Routes>
            </div>
        </div>
    )
}

export default App
