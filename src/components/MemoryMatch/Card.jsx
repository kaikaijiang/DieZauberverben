import { memo } from 'react'
import { getTenseColorClass } from '../../utils/verbHelpers'

const Card = memo(function Card({ card, isFlipped, isMatched, onClick }) {
    const tenseClass = getTenseColorClass(card.tense)

    return (
        <div
            className={`memory-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
            onClick={onClick}
        >
            <div className="card-inner">
                <div className="card-front">
                    <span className="card-logo">?</span>
                </div>
                <div className={`card-back ${card.type === 'verb' ? tenseClass : ''}`}>
                    {card.type === 'verb' ? (
                        <span className="card-verb">{card.content}</span>
                    ) : (
                        <span className="card-sentence">{card.content}</span>
                    )}
                </div>
            </div>
        </div>
    )
})

export default Card
