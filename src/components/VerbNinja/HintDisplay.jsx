import { getTenseDisplayName, getTenseColorClass } from '../../utils/verbHelpers'

function HintDisplay({ verb, tense, faded }) {
    if (!verb) return null

    const tenseName = getTenseDisplayName(tense)
    const tenseClass = getTenseColorClass(tense)

    return (
        <div className={`hint-display ${faded ? 'faded' : ''}`}>
            <div className="hint-content">
                <div className="hint-label">Finde die anderen Formen von:</div>
                <div className={`hint-verb ${tenseClass}`}>
                    {verb.form}
                </div>
                <div className="hint-tense">({tenseName})</div>
            </div>
        </div>
    )
}

export default HintDisplay
