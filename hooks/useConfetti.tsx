"use client"

import { useCallback } from "react"
import confetti from "canvas-confetti"

export function useConfetti() {
  // Confetti per completamento progetto
  const triggerProjectCompletion = useCallback(() => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    }

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    // Sequenza di esplosioni colorate
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#fef65b']
    })

    fire(0.2, {
      spread: 60,
      colors: ['#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43']
    })

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#ff6348', '#ff9f43', '#feca57', '#48dbfb', '#0abde3']
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#ff3838', '#ff9500', '#ffdd59', '#c44569', '#f8b500']
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e', '#e17055']
    })
  }, [])

  // Confetti per obiettivi raggiunti
  const triggerGoalAchievement = useCallback(() => {
    const end = Date.now() + 3000 // 3 secondi

    const colors = ['#FFD700', '#FFA500', '#FF6347', '#32CD32', '#1E90FF']

    function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        zIndex: 9999,
      })

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
        zIndex: 9999,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()

    // Esplosione centrale dopo 1 secondo
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6347'],
        zIndex: 9999,
      })
    }, 1000)
  }, [])

  // Confetti semplice per task completati
  const triggerTaskCompletion = useCallback(() => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00d2d3', '#54a0ff', '#5f27cd'],
      zIndex: 9999,
    })
  }, [])

  // Confetti esplosione laterale
  const triggerSideExplosion = useCallback((side: 'left' | 'right' = 'right') => {
    const particleCount = 50
    const spread = 55
    const startVelocity = 45

    confetti({
      particleCount,
      spread,
      startVelocity,
      origin: {
        x: side === 'left' ? 0.1 : 0.9,
        y: 0.6
      },
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#fef65b'],
      zIndex: 9999,
    })
  }, [])

  return {
    triggerProjectCompletion,
    triggerGoalAchievement,
    triggerTaskCompletion,
    triggerSideExplosion,
    // Manteniamo il metodo originale per compatibilità
    triggerConfetti: triggerProjectCompletion
  }
}
