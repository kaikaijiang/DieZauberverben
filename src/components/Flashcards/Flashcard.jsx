import { TENSES } from '../../utils/verbHelpers'

const TENSE_COLORS = {
    [TENSES.PRAESENS]: '#4A90D9',
    [TENSES.PRAETERITUM]: '#F5A623',
    [TENSES.PERFEKT]: '#7ED321'
}

const TENSE_NAMES = {
    [TENSES.PRAESENS]: 'Präsens',
    [TENSES.PRAETERITUM]: 'Präteritum',
    [TENSES.PERFEKT]: 'Perfekt'
}

function Flashcard({ card, isFlipped, onFlip }) {
    const tenseColor = TENSE_COLORS[card.targetTense]
    const tenseName = TENSE_NAMES[card.targetTense]

    return (
        <div
            className={`flashcard ${isFlipped ? 'flipped' : ''}`}
            onClick={!isFlipped ? onFlip : undefined}
            style={{ '--tense-color': tenseColor }}
        >
            <div className="flashcard-inner">
                {/* Front of card */}
                <div className="flashcard-front">
                    <div className="card-header" style={{ backgroundColor: tenseColor }}>
                        <span className="tense-label">{tenseName}</span>
                    </div>
                    <div className="card-body">
                        <p className="verb-infinitive">{card.verbName}</p>
                        <p className="prompt">→ {tenseName} = ?</p>
                    </div>
                    <div className="card-footer">
                        <span className="tap-hint">👆 Tippen zum Umdrehen</span>
                    </div>
                </div>

                {/* Back of card */}
                <div className="flashcard-back">
                    <div className="card-header" style={{ backgroundColor: tenseColor }}>
                        <span className="tense-label">{tenseName}</span>
                    </div>
                    <div className="card-body">
                        <p className="answer-highlight" style={{ color: tenseColor }}>
                            {card.answer}
                        </p>
                        <table className="conjugation-table">
                            <tbody>
                                {Object.entries(TENSE_NAMES).map(([key, name]) => (
                                    <tr
                                        key={key}
                                        className={key === card.targetTense ? 'highlighted' : ''}
                                    >
                                        <td className="tense-cell" style={{ color: TENSE_COLORS[key] }}>
                                            {name}:
                                        </td>
                                        <td className="form-cell">
                                            {card.allForms[key]}
                                            {key === card.targetTense && ' ←'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {card.example && (
                            <p className="example-sentence">
                                „{card.example}"
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Flashcard
