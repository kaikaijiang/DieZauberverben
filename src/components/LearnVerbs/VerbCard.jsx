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

function VerbCard({ verb }) {
    const { name, data } = verb

    return (
        <div className="verb-card">
            <div className="verb-card-header">
                <h2 className="verb-infinitive">{name}</h2>
            </div>

            <div className="verb-card-body">
                <table className="verb-table">
                    <tbody>
                        {/* Grundform row */}
                        <tr className="verb-row grundform-row">
                            <td className="label-cell">
                                <span className="tense-label grundform">Grundform:</span>
                            </td>
                            <td className="form-cell">
                                <span className="verb-form">{name}</span>
                            </td>
                            <td className="example-cell">
                                <span className="example-text">—</span>
                            </td>
                        </tr>

                        {/* Tense rows */}
                        {Object.entries(TENSES).map(([key, tenseKey]) => {
                            const form = data[tenseKey]
                            const examples = data[`${tenseKey}_example`]
                            const example = examples?.[0] || '—'
                            const color = TENSE_COLORS[tenseKey]
                            const tenseName = TENSE_NAMES[tenseKey]

                            return (
                                <tr key={tenseKey} className="verb-row">
                                    <td className="label-cell">
                                        <span
                                            className="tense-label"
                                            style={{ color }}
                                        >
                                            {tenseName}:
                                        </span>
                                    </td>
                                    <td className="form-cell">
                                        <span
                                            className="verb-form"
                                            style={{ color }}
                                        >
                                            {form}
                                        </span>
                                    </td>
                                    <td className="example-cell">
                                        <span className="example-text">„{example}"</span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default VerbCard
