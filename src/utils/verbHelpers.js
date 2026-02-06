// Verb helper utilities for Die Zauberverben game

/**
 * Get all verb names from the verb data
 */
export function getVerbNames(verbs) {
    return Object.keys(verbs)
}

/**
 * Get a random subset of verbs
 */
export function getRandomVerbs(verbs, count) {
    const names = getVerbNames(verbs)
    const shuffled = [...names].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, names.length))
}

/**
 * Get verb data for selected verbs
 */
export function getVerbData(verbs, selectedNames) {
    return selectedNames.reduce((acc, name) => {
        if (verbs[name]) {
            acc[name] = verbs[name]
        }
        return acc
    }, {})
}

/**
 * Tense types
 */
export const TENSES = {
    PRAESENS: 'Praesens',
    PRAETERITUM: 'Praeteritum',
    PERFEKT: 'Perfekt'
}

/**
 * Get tense display name in German
 */
export function getTenseDisplayName(tense) {
    const names = {
        [TENSES.PRAESENS]: 'Präsens',
        [TENSES.PRAETERITUM]: 'Präteritum',
        [TENSES.PERFEKT]: 'Perfekt'
    }
    return names[tense] || tense
}

/**
 * Get tense color class
 */
export function getTenseColorClass(tense) {
    const classes = {
        [TENSES.PRAESENS]: 'tense-praesens',
        [TENSES.PRAETERITUM]: 'tense-praeteritum',
        [TENSES.PERFEKT]: 'tense-perfekt'
    }
    return classes[tense] || ''
}

/**
 * Get tense border class
 */
export function getTenseBorderClass(tense) {
    const classes = {
        [TENSES.PRAESENS]: 'tense-border-praesens',
        [TENSES.PRAETERITUM]: 'tense-border-praeteritum',
        [TENSES.PERFEKT]: 'tense-border-perfekt'
    }
    return classes[tense] || ''
}

/**
 * Get a random tense
 */
export function getRandomTense() {
    const tenses = Object.values(TENSES)
    return tenses[Math.floor(Math.random() * tenses.length)]
}

/**
 * Determine what tense a conjugated verb is (by matching against verb data)
 */
export function identifyTense(verbs, conjugatedForm) {
    for (const [verbName, verbData] of Object.entries(verbs)) {
        for (const tense of Object.values(TENSES)) {
            if (verbData[tense] === conjugatedForm) {
                return { verbName, tense, conjugatedForm }
            }
        }
    }
    return null
}

/**
 * Get all conjugated forms for a verb
 */
export function getConjugatedForms(verbData) {
    return {
        [TENSES.PRAESENS]: verbData.Praesens,
        [TENSES.PRAETERITUM]: verbData.Praeteritum,
        [TENSES.PERFEKT]: verbData.Perfekt
    }
}

/**
 * Get example sentences for a verb and tense
 */
export function getExampleSentences(verbData, tense) {
    const exampleKey = `${tense}_example`
    return verbData[exampleKey] || []
}

/**
 * Get a random example sentence for a verb and tense
 */
export function getRandomExampleSentence(verbData, tense) {
    const examples = getExampleSentences(verbData, tense)
    if (examples.length === 0) return null
    return examples[Math.floor(Math.random() * examples.length)]
}

/**
 * Generate distractors - different verbs in the same tense
 */
export function generateDistractors(verbs, correctVerb, tense, count = 3) {
    const verbNames = Object.keys(verbs).filter(name => name !== correctVerb)
    const shuffled = [...verbNames].sort(() => Math.random() - 0.5)

    return shuffled.slice(0, count).map(name => ({
        verbName: name,
        conjugatedForm: verbs[name][tense],
        tense
    }))
}

/**
 * Shuffle an array
 */
export function shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

/**
 * Generate pairs for memory match game
 * Each pair is: conjugated form ↔ example sentence
 */
export function generateMemoryPairs(verbs, selectedVerbs, pairsCount) {
    const pairs = []
    const usedCombinations = new Set()

    const availableVerbs = selectedVerbs.filter(name => verbs[name])
    const shuffledVerbs = shuffleArray(availableVerbs)

    let verbIndex = 0

    while (pairs.length < pairsCount && verbIndex < shuffledVerbs.length) {
        const verbName = shuffledVerbs[verbIndex]
        const verbData = verbs[verbName]

        // Try each tense for this verb
        for (const tense of Object.values(TENSES)) {
            if (pairs.length >= pairsCount) break

            const comboKey = `${verbName}-${tense}`
            if (usedCombinations.has(comboKey)) continue

            const conjugated = verbData[tense]
            const example = getRandomExampleSentence(verbData, tense)

            if (conjugated && example) {
                usedCombinations.add(comboKey)
                pairs.push({
                    id: pairs.length,
                    verbName,
                    tense,
                    conjugated,
                    example
                })
            }
        }

        verbIndex++

        // If we've gone through all verbs but need more pairs, loop back
        if (verbIndex >= shuffledVerbs.length && pairs.length < pairsCount) {
            verbIndex = 0
        }
    }

    return pairs.slice(0, pairsCount)
}
