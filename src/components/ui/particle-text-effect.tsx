import { useEffect, useRef } from "react"
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

  closeEnoughTarget = 100
  maxSpeed = 1.0
  maxForce = 0.1
  particleSize = 10
  isKilled = false

  startColor = { r: 0, g: 0, b: 0 }
  targetColor = { r: 0, g: 0, b: 0 }
  colorWeight = 0
  colorBlendRate = 0.01

  move() {
    let proximityMult = 1
    const dx = this.target.x - this.pos.x
    const dy = this.target.y - this.pos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget
    }

    const magnitude = distance || 1
    const tx = (dx / magnitude) * this.maxSpeed * proximityMult
    const ty = (dy / magnitude) * this.maxSpeed * proximityMult

    const sx = tx - this.vel.x
    const sy = ty - this.vel.y
    const steerMag = Math.sqrt(sx * sx + sy * sy) || 1
    const forceMult = Math.min(this.maxForce / steerMag, 1)

    this.acc.x += sx * forceMult
    this.acc.y += sy * forceMult

    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D, drawAsPoints: boolean) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    }

    const w = this.colorWeight
    const r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * w)
    const g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * w)
    const b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * w)

    if (drawAsPoints) {
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(this.pos.x, this.pos.y, this.particleSize, this.particleSize)
    } else {
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.beginPath()
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      const randomPos = this._randomPos(width / 2, height / 2, (width + height) / 2)
      this.target.x = randomPos.x
      this.target.y = randomPos.y

      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      }
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0
      this.isKilled = true
    }
  }

  private _randomPos(x: number, y: number, mag: number): Vector2D {
    const randomX = Math.random() * 1000
    const randomY = Math.random() * 500
    const dx = randomX - x
    const dy = randomY - y
    const magnitude = Math.sqrt(dx * dx + dy * dy) || 1
    return {
      x: x + (dx / magnitude) * mag,
      y: y + (dy / magnitude) * mag,
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
  const mouseRef = useRef({ x: 0, y: 0, isPressed: false, isRightClick: false })
  const isMobileRef = useRef(false)

  // Pause animation when not in viewport to save CPU
  const isInView = useInView(canvasRef, { margin: "200px" })
  const isInViewRef = useRef(isInView)
  useEffect(() => { isInViewRef.current = isInView }, [isInView])

  const drawAsPoints = true

  const generateRandomPos = (x: number, y: number, mag: number): Vector2D => {
    const randomX = Math.random() * 1000
    const randomY = Math.random() * 500
    const dx = randomX - x
    const dy = randomY - y
    const magnitude = Math.sqrt(dx * dx + dy * dy) || 1
    return { x: x + (dx / magnitude) * mag, y: y + (dy / magnitude) * mag }
  }

  const nextWord = (word: string, canvas: HTMLCanvasElement) => {
    const isMobile = isMobileRef.current

    const offscreenCanvas = document.createElement("canvas")
    offscreenCanvas.width = canvas.width
    offscreenCanvas.height = canvas.height
    const offscreenCtx = offscreenCanvas.getContext("2d")!

    // Original font size, scaled down slightly for mobile so text fits
    const fontSize = isMobile ? 90 : 140
    offscreenCtx.fillStyle = "white"
    offscreenCtx.font = `bold ${fontSize}px Arial`
    offscreenCtx.textAlign = "center"
    offscreenCtx.textBaseline = "middle"
    offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 2)

    const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    // Original random color (the look you loved)
    const newColor = {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    }

    const particles = particlesRef.current
    let particleIndex = 0

    // High density grid sampling for maximum readability. 
    // Uses a step of 4 to generate thousands of particles (looks perfectly smooth because of fillRect speedup)
    const step = 4

    const coordsIndexes: number[] = []
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const i = (y * canvas.width + x) * 4
        if (pixels[i + 3] > 0) coordsIndexes.push(i)
      }
    }

    // Shuffle for fluid formation (original behaviour)
    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]]
    }

    for (const coordIndex of coordsIndexes) {
      const x = (coordIndex / 4) % canvas.width
      const y = Math.floor(coordIndex / 4 / canvas.width)

      let particle: Particle

      if (particleIndex < particles.length) {
        particle = particles[particleIndex]
        particle.isKilled = false
        particleIndex++
      } else {
        particle = new Particle()

        const randomPos = generateRandomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2)
        particle.pos.x = randomPos.x
        particle.pos.y = randomPos.y

        // Original speed/force values — these create the signature slow-drift look
        particle.maxSpeed = Math.random() * 6 + 4
        particle.maxForce = particle.maxSpeed * 0.05
        particle.particleSize = Math.random() * 6 + 6  // Original large particle size
        particle.colorBlendRate = Math.random() * 0.0275 + 0.0025

        particles.push(particle)
      }

      particle.startColor = {
        r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
        g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
        b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
      }
      particle.targetColor = newColor
      particle.colorWeight = 0
      particle.target.x = x
      particle.target.y = y
    }

    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(canvas.width, canvas.height)
    }
  }

  const animate = () => {
    animationRef.current = requestAnimationFrame(animate)

    // Pause render when scrolled away — huge CPU saving
    if (!isInViewRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    const particles = particlesRef.current

    // Original motion-blur trail
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]
      particle.move()
      particle.draw(ctx, drawAsPoints)

      if (particle.isKilled) {
        if (
          particle.pos.x < 0 ||
          particle.pos.x > canvas.width ||
          particle.pos.y < 0 ||
          particle.pos.y > canvas.height
        ) {
          particles.splice(i, 1)
        }
      }
    }

    if (mouseRef.current.isPressed && mouseRef.current.isRightClick) {
      particles.forEach((particle) => {
        const distance = Math.sqrt(
          Math.pow(particle.pos.x - mouseRef.current.x, 2) +
          Math.pow(particle.pos.y - mouseRef.current.y, 2),
        )
        if (distance < 50) {
          particle.kill(canvas.width, canvas.height)
        }
      })
    }

    frameCountRef.current++
    if (frameCountRef.current % 240 === 0) {
      wordIndexRef.current = (wordIndexRef.current + 1) % words.length
      const c = canvasRef.current
      if (c) nextWord(words[wordIndexRef.current], c)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    isMobileRef.current = window.innerWidth < 768
    const isMobile = isMobileRef.current

    // Mobile: smaller canvas but same 2:1 ratio
    canvas.width = isMobile ? 700 : 1000
    canvas.height = isMobile ? 350 : 500

    nextWord(words[0], canvas)
    animationRef.current = requestAnimationFrame(animate)

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isPressed = true
      mouseRef.current.isRightClick = e.button === 2
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }
    const handleMouseUp = () => {
      mouseRef.current.isPressed = false
      mouseRef.current.isRightClick = false
    }
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }
    const handleContextMenu = (e: MouseEvent) => e.preventDefault()

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("contextmenu", handleContextMenu)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center w-full bg-[#101B38] p-4 rounded-3xl overflow-hidden shadow-2xl">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto cursor-crosshair"
      />
      <div className="mt-8 text-white text-sm text-center max-w-md pb-4">
        <p className="mb-2 uppercase tracking-widest text-[#E3C66D] font-bold">Lumina Literacy Core</p>
        <p className="text-white/60 text-xs">
          Interact with the canvas: Right-click &amp; drag to scatter particles
        </p>
      </div>
    </div>
  )
}
