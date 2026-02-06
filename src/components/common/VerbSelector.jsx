import { useState, useMemo } from 'react'
import './VerbSelector.css'

function VerbSelector({ verbs, selectedVerbs, onSelectionChange, minVerbs = 10, maxVerbs = 150 }) {
    const [searchTerm, setSearchTerm] = useState('')

    const verbList = useMemo(() => Object.keys(verbs), [verbs])

    const filteredVerbs = useMemo(() => {
        if (!searchTerm) return verbList
        return verbList.filter(verb =>
            verb.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [verbList, searchTerm])

    const isSelected = (verb) => selectedVerbs.includes(verb)

    const toggleVerb = (verb) => {
        if (isSelected(verb)) {
            // Don't allow deselecting if at minimum
            if (selectedVerbs.length <= minVerbs) return
            onSelectionChange(selectedVerbs.filter(v => v !== verb))
        } else {
            // Don't allow selecting if at maximum
            if (selectedVerbs.length >= maxVerbs) return
            onSelectionChange([...selectedVerbs, verb])
        }
    }

    const selectAll = () => {
        const toSelect = filteredVerbs.slice(0, maxVerbs)
        onSelectionChange(toSelect)
    }

    const deselectAll = () => {
        // Keep minimum required
        onSelectionChange(verbList.slice(0, minVerbs))
    }

    const canSelectMore = selectedVerbs.length < maxVerbs
    const canDeselectMore = selectedVerbs.length > minVerbs

    return (
        <div className="verb-selector">
            <div className="verb-selector-header">
                <div className="verb-count">
                    <span className="count-number">{selectedVerbs.length}</span>
                    <span className="count-label">von {verbList.length} Verben ausgewählt</span>
                </div>

                <div className="verb-search">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Verb suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="verb-selector-actions">
                <button
                    className="btn-select-action"
                    onClick={selectAll}
                    disabled={!canSelectMore}
                >
                    Alle auswählen
                </button>
                <button
                    className="btn-select-action"
                    onClick={deselectAll}
                    disabled={!canDeselectMore}
                >
                    Minimum behalten
                </button>
            </div>

            <div className="verb-grid">
                {filteredVerbs.map(verb => (
                    <button
                        key={verb}
                        className={`verb-chip ${isSelected(verb) ? 'selected' : ''}`}
                        onClick={() => toggleVerb(verb)}
                        disabled={!isSelected(verb) && !canSelectMore}
                    >
                        <span className="verb-name">{verb}</span>
                        {isSelected(verb) && (
                            <svg className="check-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>

            {selectedVerbs.length < minVerbs && (
                <p className="verb-warning">
                    Bitte wähle mindestens {minVerbs} Verben aus.
                </p>
            )}
        </div>
    )
}

export default VerbSelector
