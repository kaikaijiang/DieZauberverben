import { useCallback, useMemo } from 'react'
import * as sounds from '../utils/soundEffects'

/**
 * Hook for playing sound effects with respect to enabled state
 */
export function useSound(enabled) {
    const playSound = useCallback((soundFn) => {
        if (enabled && typeof soundFn === 'function') {
            try {
                soundFn()
            } catch (e) {
                console.warn('Sound playback failed:', e)
            }
        }
    }, [enabled])

    const soundActions = useMemo(() => ({
        correct: () => playSound(sounds.playCorrectSound),
        wrong: () => playSound(sounds.playWrongSound),
        flip: () => playSound(sounds.playFlipSound),
        match: () => playSound(sounds.playMatchSound),
        slice: () => playSound(sounds.playSliceSound),
        drop: () => playSound(sounds.playDropSound),
        pickup: () => playSound(sounds.playPickupSound),
        loseHeart: () => playSound(sounds.playLoseHeartSound),
        gameOver: () => playSound(sounds.playGameOverSound),
        celebration: () => playSound(sounds.playCelebrationSound),
        badge: () => playSound(sounds.playBadgeSound),
        click: () => playSound(sounds.playClickSound),
        splatCorrect: () => playSound(sounds.playSplatCorrectSound),
    }), [playSound])

    return soundActions
}
