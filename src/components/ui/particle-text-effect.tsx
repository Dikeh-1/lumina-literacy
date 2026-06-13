import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

interface Vector2D {
  x: number
  y: number
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 }
  vel: Vector2D = { x: 0, y: 0 }
  acc: Vector2D = { x: 0, y: 0 }
  target: Vector2D = { x: 0, y: 0 }

  closeEnoughTarget = 50
  maxSpeed = 8.0
  maxForce = 0.6
  particleSize = 3
  isKilled = false

  startColor = { r: 201, g: 168, b: 76 }
  targetColor = { r: 201, g: 168, b: 76 }
  colorWeight = 1
  colorBlendRate = 0.08

  move() {
    const dx = this.target.x - this.pos.x
    const dy = this.target.y - this.pos.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const proximityMult = distance < this.closeEnoughTarget ? distance / this.closeEnoughTarget : 1

    const magnitude = distance || 1
    const tx = (dx / magnitude) * this.maxSpeed * proximityMult
    const ty = (dy / magnitude) * this.maxSpeed * proximityMult

    const sx = tx - this.vel.x
    const sy = ty - this.vel.y
    const steerMag = Math.sqrt(sx * sx + sy * sy) || 1
    const scale = Math.min(this.maxForce / steerMag, 1)

    this.acc.x += sx * scale
    this.acc.y += sy * scale

    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    }
    const w = this.colorWeight
    const r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * w)
    const g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * w)
    const b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * w)
    ctx.fillStyle = `rgb(${r},${g},${b})`
    ctx.fillRect(this.pos.x, this.pos.y, this.particleSize, this.particleSize)
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      this.target.x = (Math.random() - 0.5) * width * 2 + width / 2
      this.target.y = (Math.random() - 0.5) * height * 2 + height / 2
      this.startColor = { ...this.targetColor }
      this.targetColor = { r: 16, g: 27, b: 56 }
      this.colorWeight = 0
      this.isKilled = true
    }
  }
}

interface ParticleTextEffectProps {
  words?: string[]
}

const DEFAULT_WORDS = ["LUMINA", "LITERACY", "AFRICAN", "CHILDREN"]

export function ParticleTextEffect({ words = DEFAULT_WORDS }: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<Particle[]>([])
  const frameCountRef = useRef(0)
  const wordIndexRef = useRef(0)
  const isMobileRef = useRef(false)

  const isInView = useInView(canvasRef, { margin: "100px" })
  const isInViewRef = useRef(isInView)

  useEffect(() => {
    isInViewRef.current = isInView
  }, [isInView])

  const generateWordParticles = (word: string, canvas: HTMLCanvasElement) => {
    const isMobile = isMobileRef.current
    const offscreen = document.createElement("canvas")
    offscreen.width = canvas.width
    offscreen.height = canvas.height
    const ctx2 = offscreen.getContext("2d")!

    // Choose font size based on word length and canvas width
    const baseSize = isMobile ? 100 : 140
    const fontSize = word.length > 8 ? baseSize * 0.75 : word.length > 6 ? baseSize * 0.85 : baseSize
    ctx2.font = `bold ${fontSize}px Arial, sans-serif`
    ctx2.fillStyle = "white"
    ctx2.textAlign = "center"
    ctx2.textBaseline = "middle"
    ctx2.fillText(word, canvas.width / 2, canvas.height / 2)

    const imageData = ctx2.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    // Gold color palette
    const colors = [
      { r: 227, g: 198, b: 109 },
      { r: 201, g: 168, b: 76 },
      { r: 168, g: 132, b: 38 },
      { r: 255, g: 220, b: 130 },
    ]
    const newColor = colors[wordIndexRef.current % colors.length]

    // Step size: smaller = more particles = better readability
    const step = isMobile ? 6 : 4
    const coordsIndexes: number[] = []
    for (let i = 0; i < pixels.length; i += step * 4) {
      if (pixels[i + 3] > 128) {
        coordsIndexes.push(i)
      }
    }

    // Hard cap: mobile 800, desktop 2500
    const maxParticles = isMobile ? 800 : 2500
    // Shuffle efficiently
    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]]
    }
    if (coordsIndexes.length > maxParticles) coordsIndexes.length = maxParticles

    const particles = particlesRef.current
    let particleIndex = 0

    for (const idx of coordsIndexes) {
      const x = (idx / 4) % canvas.width
      const y = Math.floor(idx / 4 / canvas.width)

      let particle: Particle
      if (particleIndex < particles.length) {
        particle = particles[particleIndex]
        particle.isKilled = false
        particleIndex++
      } else {
        particle = new Particle()
        // Start from random edge position
        const edge = Math.floor(Math.random() * 4)
        if (edge === 0) { particle.pos.x = Math.random() * canvas.width; particle.pos.y = -20 }
        else if (edge === 1) { particle.pos.x = canvas.width + 20; particle.pos.y = Math.random() * canvas.height }
        else if (edge === 2) { particle.pos.x = Math.random() * canvas.width; particle.pos.y = canvas.height + 20 }
        else { particle.pos.x = -20; particle.pos.y = Math.random() * canvas.height }

        particle.maxSpeed = isMobile ? (Math.random() * 8 + 6) : (Math.random() * 6 + 4)
        particle.maxForce = particle.maxSpeed * 0.08
        particle.particleSize = isMobile ? 4 : 3
        particle.colorBlendRate = 0.06
        particle.startColor = { ...newColor }
        particles.push(particle)
      }

      // Snapshot current blend position as new start
      const w = particle.colorWeight
      particle.startColor = {
        r: Math.round(particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * w),
        g: Math.round(particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * w),
        b: Math.round(particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * w),
      }
      particle.targetColor = newColor
      particle.colorWeight = 0
      particle.target.x = x
      particle.target.y = y
    }

    // Kill excess particles
    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(canvas.width, canvas.height)
    }
  }

  const animate = () => {
    animationRef.current = requestAnimationFrame(animate)
    if (!isInViewRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const particles = particlesRef.current

    // Fade trail: dark semi-transparent fill
    ctx.fillStyle = "rgba(16, 27, 56, 0.35)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.move()
      p.draw(ctx)
      if (p.isKilled && (p.pos.x < -30 || p.pos.x > canvas.width + 30 || p.pos.y < -30 || p.pos.y > canvas.height + 30)) {
        particles.splice(i, 1)
      }
    }

    frameCountRef.current++
    // Change word every ~4 seconds at 60fps
    if (frameCountRef.current % 240 === 0) {
      wordIndexRef.current = (wordIndexRef.current + 1) % words.length
      const canvas = canvasRef.current
      if (canvas) generateWordParticles(words[wordIndexRef.current], canvas)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    isMobileRef.current = window.innerWidth < 768
    const isMobile = isMobileRef.current

    canvas.width = isMobile ? 600 : 1000
    canvas.height = isMobile ? 300 : 500

    // Clear the canvas background first
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "#101B38"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Show first word immediately
    generateWordParticles(words[0], canvas)

    // Start animation loop
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center w-full bg-[#101B38] rounded-3xl overflow-hidden shadow-2xl">
      <canvas
        ref={canvasRef}
        className="w-full h-auto"
        style={{ display: "block", maxWidth: "100%" }}
      />
      <div className="px-4 py-5 text-center">
        <p className="uppercase tracking-widest text-[#E3C66D] font-bold text-sm">Lumina Literacy Core</p>
        <p className="text-white/50 text-xs mt-1">Words shift every 4 seconds</p>
      </div>
    </div>
  )
}
