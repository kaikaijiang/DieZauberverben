import { useNavigate } from 'react-router-dom'
import SoundToggle from './SoundToggle'
import './Header.css'

function Header({ title, soundEnabled, toggleSound, showBack = true }) {
    const navigate = useNavigate()

    return (
        <header className="header">
            <div className="header-left">
                {showBack && (
                    <button
                        className="btn-back"
                        onClick={() => navigate(-1)}
                        aria-label="Zurück"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                        </svg>
                    </button>
                )}
            </div>

            <h1 className="header-title">{title}</h1>

            <div className="header-right">
                <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
            </div>
        </header>
    )
}

export default Header
