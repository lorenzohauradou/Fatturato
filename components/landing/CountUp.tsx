"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { animate } from "framer-motion"

interface CountUpProps {
  end: number
  duration?: number
  className?: string
}

const CountUp: React.FC<CountUpProps> = ({ end, duration = 2, className }) => {
  const [count, setCount] = useState(0)
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = elementRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const controls = animate(0, end, {
              duration: duration,
              ease: "circOut",
              onUpdate(value) {
                setCount(Math.round(value))
              },
            })
            observer.unobserve(node)
            // Cleanup function to stop animation when component unmounts or deps change
            return () => controls.stop()
          }
        })
      },
      { threshold: 0.1 },
    )

    observer.observe(node)

    // Cleanup function for the observer
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={elementRef} className={className}>
      {count}
    </span>
  )
}

export default CountUp 