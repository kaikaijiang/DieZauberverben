import { getTenseColorClass } from '../../utils/verbHelpers'

function Sentence({ before, after, answer, isCorrect, tense }) {
    const tenseClass = getTenseColorClass(tense)

    return (
        <div className="sentence-container">
            <p className="sentence-text">
                <span className="sentence-before">{before}</span>
                <span className={`sentence-blank ${answer ? 'filled' : ''} ${answer ? tenseClass : ''} ${isCorrect === true ? 'correct' : ''} ${isCorrect === false ? 'wrong' : ''}`}>
                    {answer || '___________'}
                </span>
                <span className="sentence-after">{after}</span>
            </p>
        </div>
    )
}

export default Sentence
