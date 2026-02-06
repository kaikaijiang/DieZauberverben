import { getTenseColorClass } from '../../utils/verbHelpers'

function DraggableVerb({ option, onClick, disabled, selected, showResult }) {
    const tenseClass = getTenseColorClass(option.tense)

    let stateClass = ''
    if (showResult) {
        if (option.isCorrect) {
            stateClass = 'correct-answer'
        } else if (selected) {
            stateClass = 'wrong-answer'
        }
    } else if (selected) {
        stateClass = 'selected'
    }

    return (
        <button
            className={`draggable-verb ${tenseClass} ${stateClass}`}
            onClick={onClick}
            disabled={disabled}
        >
            {option.conjugated}
        </button>
    )
}

export default DraggableVerb
