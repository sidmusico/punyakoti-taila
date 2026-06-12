'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

import { bottleRowAmbientFragment, bottleRowAmbientVertex } from './bottleRowShaders'

const PARTICLE_COUNT_DESKTOP = 48
const PARTICLE_COUNT_MOBILE = 24

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function BottleRowAmbientCanvas() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host || prefersReducedMotion()) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.className = 'bottle-row__ambient-canvas'
    host.appendChild(renderer.domElement)

    const ambientUniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }
    const ambientMat = new THREE.ShaderMaterial({
      vertexShader: bottleRowAmbientVertex,
      fragmentShader: bottleRowAmbientFragment,
      uniforms: ambientUniforms,
      transparent: true,
      depthWrite: false,
    })
    const ambientMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), ambientMat)
    scene.add(ambientMesh)

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2.4
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1.6
      positions[i * 3 + 2] = 0
      seeds[i] = Math.random() * Math.PI * 2
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0xdeb04d,
      size: isMobile ? 0.028 : 0.022,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: false,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    let width = 0
    let height = 0
    const setSize = () => {
      width = host.clientWidth
      height = host.clientHeight
      if (width === 0 || height === 0) return
      renderer.setSize(width, height, false)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      ambientUniforms.uResolution.value.set(width, height)
    }
    setSize()
    const ro = new ResizeObserver(setSize)
    ro.observe(host)

    let raf = 0
    let running = true
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry?.isIntersecting ?? true
      },
      { threshold: 0.05 },
    )
    io.observe(host)

    const posAttr = particleGeo.getAttribute('position') as THREE.BufferAttribute
    const start = performance.now()

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (!running || width === 0) return

      const t = (now - start) * 0.001
      ambientUniforms.uTime.value = t

      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const seed = seeds[i]!
        const y = posAttr.array[i3 + 1]!
        posAttr.array[i3]! += Math.sin(t * 0.4 + seed) * 0.00035
        posAttr.array[i3 + 1]! = y + 0.00055
        if (posAttr.array[i3 + 1]! > 1.1) {
          posAttr.array[i3 + 1]! = -1.1
          posAttr.array[i3]! = (Math.random() - 0.5) * 2.4
        }
      }
      posAttr.needsUpdate = true

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      particleGeo.dispose()
      particleMat.dispose()
      ambientMesh.geometry.dispose()
      ambientMat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div
      ref={hostRef}
      className="bottle-row__ambient"
      aria-hidden
    />
  )
}
