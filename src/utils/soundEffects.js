// Sound effects using Web Audio API
// No external audio files needed - all sounds generated procedurally

let audioContext = null

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }
    // Resume if suspended (required for user interaction policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume()
    }
    return audioContext
}

/**
 * Play a simple beep/tone
 */
function playTone(frequency, duration, type = 'sine', gain = 0.3) {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    gainNode.gain.setValueAtTime(gain, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
}

/**
 * Correct answer sound - cheerful ascending chime
 */
export function playCorrectSound() {
    playTone(523.25, 0.1, 'sine', 0.3) // C5
    setTimeout(() => playTone(659.25, 0.1, 'sine', 0.3), 100) // E5
    setTimeout(() => playTone(783.99, 0.2, 'sine', 0.3), 200) // G5
}

/**
 * Wrong answer sound - gentle descending tone
 */
export function playWrongSound() {
    playTone(349.23, 0.15, 'sine', 0.2) // F4
    setTimeout(() => playTone(293.66, 0.2, 'sine', 0.2), 100) // D4
}

/**
 * Card flip sound - soft click
 */
export function playFlipSound() {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05)

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.05)
}

/**
 * Match found sound - magical sparkle
 */
export function playMatchSound() {
    const notes = [784, 988, 1175, 1319] // G5, B5, D6, E6
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.15, 'sine', 0.2), i * 50)
    })
}

/**
 * Slice sound - whoosh effect
 */
export function playSliceSound() {
    const ctx = getAudioContext()

    // Create noise
    const bufferSize = ctx.sampleRate * 0.1
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(2000, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.1)

    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    noise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    noise.start(ctx.currentTime)
}

/**
 * Drop/snap sound - satisfying click
 */
export function playDropSound() {
    playTone(600, 0.05, 'square', 0.15)
    setTimeout(() => playTone(800, 0.03, 'sine', 0.1), 30)
}

/**
 * Pickup/pop sound
 */
export function playPickupSound() {
    playTone(400, 0.03, 'sine', 0.1)
    setTimeout(() => playTone(600, 0.03, 'sine', 0.1), 20)
}

/**
 * Lose heart sound - sad descending
 */
export function playLoseHeartSound() {
    playTone(440, 0.15, 'sine', 0.2) // A4
    setTimeout(() => playTone(392, 0.15, 'sine', 0.2), 100) // G4
    setTimeout(() => playTone(349.23, 0.2, 'sine', 0.2), 200) // F4
}

/**
 * Game over sound - encouraging melody
 */
export function playGameOverSound() {
    const notes = [392, 349.23, 329.63, 293.66, 329.63] // G4, F4, E4, D4, E4
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.2, 'sine', 0.25), i * 200)
    })
}

/**
 * Level complete / celebration sound
 */
export function playCelebrationSound() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5] // C5, E5, G5, C6, G5, C6
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.15, 'sine', 0.25), i * 100)
    })
}

/**
 * Badge earned sound - triumphant fanfare
 */
export function playBadgeSound() {
    const notes = [392, 523.25, 659.25, 783.99] // G4, C5, E5, G5
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.2, 'triangle', 0.3), i * 150)
    })
}

/**
 * Button click sound
 */
export function playClickSound() {
    playTone(500, 0.03, 'square', 0.08)
}

/**
 * Juicy splat sound for correct slice (Verb Ninja)
 */
export function playSplatCorrectSound() {
    const ctx = getAudioContext()

    // Create a watery splat effect
    const bufferSize = ctx.sampleRate * 0.2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate
        // Mix of noise and low frequency wobble
        data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 15) * 0.3 +
            Math.sin(2 * Math.PI * 150 * t) * Math.exp(-t * 8) * 0.4
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2)

    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

    noise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    noise.start(ctx.currentTime)

    // Add a cheerful tone on top
    setTimeout(() => playTone(600, 0.1, 'sine', 0.2), 50)
    setTimeout(() => playTone(800, 0.1, 'sine', 0.15), 100)
}
