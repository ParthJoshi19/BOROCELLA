"use client"
import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import type * as THREE from "three"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import 'locomotive-scroll/dist/locomotive-scroll.css'
import { Suspense } from "react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}


const canInfo = [
  {
    id: 0,
    flavor: "Red Energy",
    tagline: "Bold Berry Boost",
    description:
      "Ignite your momentum with a vibrant fusion of dark berries and clean plant-based energy. Crafted to elevate focus and keep you moving—without the crash.",
    highlights: ["Natural caffeine", "B-vitamins complex", "Zero sugar"],
    stats: { caffeine: "120mg", calories: "10", sugar: "0g", size: "355ml" },
    accent: "from-rose-500/60 to-red-500/40",
  },
  {
    id: 1,
    flavor: "Blue Energy",
    tagline: "Cool Citrus Charge",
    description:
      "A crisp wave of citrus + glacier mint clarity. Smooth sustained lift engineered for creators, gamers, and late-night problem solvers.",
    highlights: ["Electrolyte blend", "Adaptogens", "No artificial dyes"],
    stats: { caffeine: "110mg", calories: "15", sugar: "0g", size: "355ml" },
    accent: "from-sky-500/60 to-indigo-500/40",
  },
]

// Theme palette per can (used for dynamic page accents)
const themes: Record<number, { primary: string; secondary: string; glow: string; soft: string; ring: string }> = {
  0: {
    primary: "#f43f5e", // rose-500
    secondary: "#ef4444", // red-500
    glow: "rgba(244,63,94,0.55)",
    soft: "rgba(244,63,94,0.20)",
    ring: "rgba(244,63,94,0.35)",
  },
  1: {
    primary: "#3b82f6", // blue-500
    secondary: "#6366f1", // indigo-500
    glow: "rgba(59,130,246,0.55)",
    soft: "rgba(59,130,246,0.20)",
    ring: "rgba(59,130,246,0.35)",
  },
}

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About Us", href: "#about" },
  { name: "Products", href: "#products" },
  { name: "Buy Product", href: "#buy" },
  { name: "What Makes Us Different", href: "#difference" },
  { name: "Contact", href: "#contact" },
]

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {


    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <nav className="fixed m-6 border-2 font-[michroma] border-white rounded-full top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-white">EnergyBoost</h1>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-white/10"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/80 hover:text-white p-2 rounded-md"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/40 backdrop-blur-md rounded-lg mt-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white/80 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

const Page = () => {
  const bgVidPath = ["red-bg.mp4", "blue-bg(1).mp4"] // could extend
  const canModels = ["red-can.glb", "blue-can.glb"] // align with canInfo
  const [current, setCurrent] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)
  const [rotatespeed, setRotateSpeed] = useState(0.009)
  const [showInfo, setShowInfo] = useState(false) // mobile toggle

  function CanModel() {
    const { scene } = useGLTF(`/models/${canModels[current]}`)

    return (
      <group scale={1.5} position={[0, 0, 0]}>
        <primitive object={scene} />
      </group>
    )
  }

  function FloatingCan() {
    const ref = useRef<THREE.Group>(null)

    useFrame(({ clock }) => {
      if (ref.current) {
        // Rotate
        ref.current.rotation.y += rotatespeed

        ref.current.position.y = Math.sin(clock.getElapsedTime()) * 0.21
      }
    })

    return (
      <group ref={ref}>
        <CanModel />
      </group>
    )
  }

  const handleNext = () => {
    const nextIndex = (current + 1) % bgVidPath.length
    setRotateSpeed(0.09)
    setPrevious(current)
    setCurrent(nextIndex)

    setTimeout(() => {
      setPrevious(null)
      setRotateSpeed(0.009)
    }, 800)
  }

  const handlePrev = () => {
    const prevIndex = (current - 1 + bgVidPath.length) % bgVidPath.length
    setPrevious(current)
    setCurrent(prevIndex)

    // cleanup previous after transition
    setTimeout(() => setPrevious(null), 800)
  }

  const info = canInfo[current]
  const theme = themes[current]

useEffect(() => {
    let scrollInstance: LocomotiveScroll | null = null;

    const initScroll = async () => {
      if (typeof window === "undefined") return;

      const LocomotiveScroll = (await import("locomotive-scroll")).default;

      const el = document.querySelector(
        "[data-scroll-container]"
      ) as HTMLElement | null;

      if (el) {
        scrollInstance = new LocomotiveScroll({
          el,
          smooth: true,
          lerp: 0.08,
          multiplier: 1,
          class: "is-inview",
        });
      }
    };

    initScroll();

    return () => {
      if (scrollInstance) scrollInstance.destroy();
    };
  }, []);

  const cssVars: Record<string, string> = {
  "--accent-primary": theme.primary,
  "--accent-secondary": theme.secondary,
  "--accent-glow": theme.glow,
  "--accent-soft": theme.soft,
  "--accent-ring": theme.ring,
};

  return (
    <div
      data-scroll-container
      className="relative w-screen font-[michroma] overflow-hidden text-white"
      style={{ ...cssVars, transition: 'background-color 600ms, color 600ms' }}
    >
      <Navbar />

      <section id="home" className="relative min-h-screen w-screen overflow-hidden">
        {/* Background Video Current */}
        <video
          key={current}
          src={`/bg-videos/${bgVidPath[current]}`}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 opacity-100"
        />
        {/* Background Video Previous (fade out) */}
        {previous !== null && (
          <video
            key={previous}
            src={`/bg-videos/${bgVidPath[previous]}`}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 opacity-0"
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/70 via-black/35 to-black/70" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background: 'radial-gradient(circle at 30% 40%, var(--accent-primary) 0%, rgba(0,0,0,0) 55%)',
            opacity: 0.35,
            transition: 'opacity 600ms, background 600ms',
          }}
        />

        <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4 md:p-8 pt-50">
          <div className="w-full pt-20 max-w-7xl mx-auto grid md:grid-cols-12 gap-6 items-stretch">
            <div
              className="relative col-span-12 md:col-span-7 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 overflow-hidden flex flex-col"
              style={{
                boxShadow: '0 0 0 1px var(--accent-soft), 0 4px 28px -6px var(--accent-glow), 0 0 60px -10px var(--accent-soft)',
                transition: 'box-shadow 600ms',
              }}
            >
              <div className="flex items-center justify-between px-4 pt-4 md:pt-5">
                <h2 className="text-lg md:text-xl font-semibold tracking-wide uppercase">{info.flavor}</h2>
                <div className="hidden md:flex gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous flavor"
                    className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition grid place-items-center backdrop-blur-sm"
                  >
                    <span className="text-xl">‹</span>
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next flavor"
                    className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition grid place-items-center backdrop-blur-sm"
                  >
                    <span className="text-xl">›</span>
                  </button>
                </div>
              </div>
              <div className="relative flex-1 h-[50vh] sm:h-[60vh] md:h-[70vh]">
                {/* Accent radial glow behind model */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: 'radial-gradient(circle at 50% 55%, var(--accent-soft) 0%, rgba(0,0,0,0) 65%)',
                    filter: 'blur(25px)',
                    opacity: 0.9,
                    transition: 'background 600ms',
                  }}
                />
                <Canvas camera={{ fov: 15, position: [0, 1, 8] }} shadows>
                  <directionalLight position={[10, 10, 25]} intensity={8} color="white" castShadow />
                  <directionalLight position={[-10, -10, -25]} intensity={8} color="white" castShadow />
                  <ambientLight intensity={2} />
                  <pointLight position={[10, 10, 10]} />

                  <OrbitControls />

                  {/* Suspense wrapper for async models */}
                  <Suspense fallback={null}>
                    <FloatingCan /> 
                  </Suspense>
                </Canvas>
              </div>
              {/* Mobile Nav + Toggle */}
              <div className="md:hidden flex items-center justify-between px-4 pb-4 gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous flavor"
                    className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition grid place-items-center"
                  >
                    <span className="text-xl">‹</span>
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next flavor"
                    className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 transition grid place-items-center"
                  >
                    <span className="text-xl">›</span>
                  </button>
                </div>
                <button
                  onClick={() => setShowInfo((v) => !v)}
                  className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-sm font-medium tracking-wide"
                >
                  {showInfo ? "Hide Info" : "Show Info"}
                </button>
              </div>
            </div>

            <div
              className={`col-span-12 md:col-span-5 flex flex-col gap-4 transition-all duration-500 ${showInfo ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
                } overflow-hidden md:overflow-visible`}
            >
              <div
                className={`relative rounded-2xl p-5 md:p-6 border border-white/20 shadow-xl backdrop-blur-lg`}
                style={{
                  background: 'linear-gradient(135deg, var(--accent-soft), rgba(255,255,255,0.12))',
                  boxShadow: '0 0 0 1px var(--accent-soft), 0 8px 32px -8px var(--accent-glow), 0 0 40px -6px var(--accent-ring)',
                  transition: 'background 600ms, box-shadow 600ms',
                }}
              >
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-sm">{info.flavor}</h1>
                <p className="mt-1 text-sm md:text-base font-medium uppercase tracking-wider text-white/90">
                  {info.tagline}
                </p>
                <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-white/85 max-w-prose">
                  {info.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {info.highlights.map((h) => (
                    <span
                      key={h}
                      className="px-3 py-1 rounded-full bg-white/20 text-xs md:text-[13px] tracking-wide backdrop-blur-sm border border-white/25"
                    >
                      {h}
                    </span>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-xs md:text-sm">
                  {Object.entries(info.stats).map(([k, v]) => (
                    <div key={k} className="bg-white/15 rounded-lg p-3 flex flex-col border border-white/10">
                      <span className="uppercase tracking-wider text-[10px] md:text-[11px] text-white/60">{k}</span>
                      <span className="font-semibold text-sm md:text-base">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    className="group relative px-5 py-2.5 rounded-full overflow-hidden font-semibold tracking-wide text-gray-900 transition"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                      boxShadow: '0 4px 18px -4px var(--accent-glow)',
                    }}
                  >
                    <span>Buy Now</span>
                  </button>
                  <button
                    className="px-5 py-2.5 rounded-full font-semibold tracking-wide border transition"
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      borderColor: 'var(--accent-ring)',
                    }}
                  >
                    Learn More
                  </button>
                </div>
                {/* Decorative glows */}
                <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/30 blur-3xl opacity-30" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/20 blur-3xl opacity-20" />
              </div>

              <div className="hidden md:flex flex-col gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scroll">
                {canInfo.map((item) => {
                  const active = current === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrent(item.id)}
                      className={`text-left group rounded-xl p-4 border transition backdrop-blur-md`}
                      style={
                        active
                          ? {
                            background: 'linear-gradient(135deg, var(--accent-soft), rgba(255,255,255,0.15))',
                            borderColor: 'var(--accent-primary)',
                            boxShadow: '0 0 0 1px var(--accent-soft), 0 6px 24px -6px var(--accent-glow)',
                            transition: 'box-shadow 500ms, background 500ms',
                          }
                          : {
                            background: 'rgba(255,255,255,0.08)',
                            borderColor: 'rgba(255,255,255,0.15)',
                          }
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold tracking-wide">{item.flavor}</span>
                        {active && (
                          <span
                            className="text-[10px] px-2 py-1 rounded-full"
                            style={{
                              background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                            }}
                          >
                            Active
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-white/70 line-clamp-2">{item.tagline}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION (dynamic overlays) */}
      <section id="about" className="relative min-h-screen py-20 px-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div
          className="absolute inset-0 -z-10 opacity-40 transition"
          style={{
            background: 'radial-gradient(circle at 70% 30%, var(--accent-soft), transparent 60%)',
            transition: 'background 600ms'
          }}
        />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">About EnergyBoost</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              We&apos;re revolutionizing the energy drink industry with clean, sustainable ingredients and innovative flavors
              that fuel your passion without compromise.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-white/80 mb-6">
                Founded in 2020, EnergyBoost was born from a simple belief: energy drinks should energize your body, not
                compromise your health. We use only natural caffeine sources, organic ingredients, and zero artificial
                preservatives.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)', boxShadow: '0 0 0 4px var(--accent-soft)' }} />
                  <span>100% Natural Ingredients</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-secondary)', boxShadow: '0 0 0 4px var(--accent-soft)' }} />
                  <span>Sustainably Sourced</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-ring)', boxShadow: '0 0 0 4px var(--accent-soft)' }} />
                  <span>Zero Sugar Formula</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20" style={{ boxShadow: '0 0 0 1px var(--accent-soft), 0 8px 32px -10px var(--accent-glow)', transition: 'box-shadow 600ms' }}>
              <h4 className="text-xl font-bold mb-4">Our Values</h4>
              <ul className="space-y-3 text-white/80">
                <li>• Transparency in every ingredient</li>
                <li>• Environmental responsibility</li>
                <li>• Supporting active lifestyles</li>
                <li>• Innovation without compromise</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS (active product styling) */}
      <section id="products" className="relative min-h-screen py-20 px-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black to-gray-900" />
        <div
          className="absolute inset-0 -z-10 opacity-35 mix-blend-screen transition"
          style={{ background: 'radial-gradient(circle at 20% 60%, var(--accent-soft), transparent 65%)' }}
        />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Products</h2>
            <p className="text-xl text-white/80">
              Discover our range of premium energy drinks, each crafted for different moments and moods.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {canInfo.map((product) => {
              const active = product.id === current
              return (
                <div
                  key={product.id}
                  className={`relative rounded-2xl p-8 border shadow-xl backdrop-blur-lg transition-transform duration-500 ${active ? 'scale-[1.02]' : 'hover:scale-[1.01]'} bg-gradient-to-br ${product.accent}`}
                  style={active ? { boxShadow: '0 0 0 1px var(--accent-soft), 0 12px 42px -10px var(--accent-glow), 0 0 60px -8px var(--accent-glow)', borderColor: 'var(--accent-primary)' } : { borderColor: 'rgba(255,255,255,0.25)' }}
                  onClick={() => setCurrent(product.id)}
                >
                  <h3 className="text-2xl font-bold mb-2">{product.flavor}</h3>
                  <p className="text-lg font-medium uppercase tracking-wider text-white/90 mb-4">{product.tagline}</p>
                  <p className="text-white/85 mb-6">{product.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {Object.entries(product.stats).map(([k, v]) => (
                      <div key={k} className="rounded-lg p-3 border bg-white/10" style={{ borderColor: active ? 'var(--accent-ring)' : 'rgba(255,255,255,0.15)' }}>
                        <span className="uppercase tracking-wider text-xs text-white/60 block">{k}</span>
                        <span className="font-semibold text-lg">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="px-3 py-1 rounded-full bg-white/20 text-sm backdrop-blur-sm border"
                        style={{ borderColor: active ? 'var(--accent-primary)' : 'rgba(255,255,255,0.25)' }}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                  {active && (
                    <div className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full font-semibold" style={{ background: 'linear-gradient(90deg,var(--accent-primary),var(--accent-secondary))', boxShadow: '0 0 0 1px var(--accent-soft)' }}>ACTIVE</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* DIFFERENCE (cards tinted) */}
      <section id="difference" className="relative min-h-screen py-20 px-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 to-black" />
        <div className="absolute inset-0 -z-10 opacity-30" style={{ background: 'radial-gradient(circle at 50% 50%, var(--accent-soft), transparent 60%)', transition: 'background 600ms' }} />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Makes Us Different</h2>
            <p className="text-xl text-white/80">
              We&apos;re not just another energy drink. Here&apos;s what sets EnergyBoost apart from the competition.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {['100% Natural', 'Sustained Energy', 'Eco-Friendly'].map((title, i) => {
              const icons = ['🌱', '⚡', '🌍']
              return (
                <div key={title} className="backdrop-blur-md rounded-2xl p-8 border text-center transition" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'var(--accent-soft)', boxShadow: '0 0 0 1px var(--accent-soft), 0 8px 28px -8px var(--accent-glow)' }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl" style={{ background: 'linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))', boxShadow: '0 0 0 4px var(--accent-soft)' }}>{icons[i]}</div>
                  <h3 className="text-xl font-bold mb-4">{title}</h3>
                  {/* ...existing description mapping retained below original; kept semantic minimal change */}
                  {i === 0 && <p className="text-white/80">No artificial colors, flavors, or preservatives. Just pure, natural energy from organic sources.</p>}
                  {i === 1 && <p className="text-white/80">Long-lasting lift without the crash thanks to natural caffeine & synergistic B-vitamins.</p>}
                  {i === 2 && <p className="text-white/80">Recyclable packaging + carbon-neutral production for cleaner impact.</p>}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* BUY (accent text + buttons) */}
      <section id="buy" className="relative min-h-screen py-20 px-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black to-gray-900" />
        <div className="absolute inset-0 -z-10 opacity-35" style={{ background: 'radial-gradient(circle at 30% 70%, var(--accent-soft), transparent 60%)' }} />
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Boost Your Energy?</h2>
          <p className="text-xl text-white/80 mb-12">
            Choose your flavor and experience the difference of clean, natural energy.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {canInfo.map((product) => {
              const active = product.id === current
              return (
                <div key={product.id} className="backdrop-blur-md rounded-2xl p-8 border transition" style={active ? { background: 'linear-gradient(135deg,var(--accent-soft),rgba(255,255,255,0.12))', borderColor: 'var(--accent-primary)', boxShadow: '0 0 0 1px var(--accent-soft), 0 10px 36px -10px var(--accent-glow)' } : { background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)' }} onClick={() => setCurrent(product.id)}>
                  <h3 className="text-2xl font-bold mb-4">{product.flavor}</h3>
                  <p className="text-white/80 mb-6">{product.tagline}</p>
                  <div className="text-3xl font-bold mb-6 bg-clip-text text-transparent" style={{ background: 'linear-gradient(90deg,var(--accent-primary),var(--accent-secondary))' }}>$2.99</div>
                  <button className="w-full py-3 px-6 font-semibold rounded-full transition" style={{ background: 'linear-gradient(90deg,var(--accent-primary),var(--accent-secondary))', boxShadow: '0 4px 18px -6px var(--accent-glow)' }}>Add to Cart</button>
                </div>
              )
            })}
          </div>
          <div className="backdrop-blur-md rounded-2xl p-8 border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'var(--accent-soft)', boxShadow: '0 0 0 1px var(--accent-soft)' }}>
            <h3 className="text-2xl font-bold mb-4">Bulk Orders</h3>
            <p className="text-white/80 mb-6">
              Save more with our bulk packages. Perfect for offices, gyms, and events.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 rounded-full font-semibold transition" style={{ background: 'linear-gradient(90deg,var(--accent-primary),var(--accent-secondary))', boxShadow: '0 4px 16px -6px var(--accent-glow)' }}>12-Pack - $32.99</button>
              <button className="px-6 py-3 rounded-full font-semibold transition" style={{ background: 'linear-gradient(90deg,var(--accent-secondary),var(--accent-primary))', boxShadow: '0 4px 16px -6px var(--accent-glow)' }}>24-Pack - $59.99</button>
              <button className="px-6 py-3 bg-white text-black hover:bg-white/90 rounded-full font-semibold transition">Contact for Custom Orders</button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT (accent form focus styling) */}
      <section id="contact" className="relative min-h-screen py-20 px-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 to-black" />
        <div className="absolute inset-0 -z-10 opacity-30" style={{ background: 'radial-gradient(circle at 55% 45%, var(--accent-soft), transparent 60%)' }} />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
            <p className="text-xl text-white/80">
              Have questions? Want to become a retailer? We&apos;d love to hear from you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span>📧</span>
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-white/80">hello@energyboost.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span>📞</span>
                  </div>
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-white/80">8308193006</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span>📍</span>
                  </div>
                  <div>
                    <div className="font-semibold">Address</div>
                    <div className="text-white/80">
                      123 Energy Street
                      <br />
                      Boost City, BC 12345
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border" style={{ borderColor: 'var(--accent-soft)', boxShadow: '0 0 0 1px var(--accent-soft), 0 6px 24px -8px var(--accent-glow)', transition: 'box-shadow 600ms' }}>
              <h3 className="text-xl font-bold mb-6">Send us a message</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2" style={{ borderColor: 'var(--accent-ring)', boxShadow: '0 0 0 1px var(--accent-soft)' }} />
                <input type="email" placeholder="Your Email" className="w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2" style={{ borderColor: 'var(--accent-ring)', boxShadow: '0 0 0 1px var(--accent-soft)' }} />
                <textarea placeholder="Your Message" rows={4} className="w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 resize-none" style={{ borderColor: 'var(--accent-ring)', boxShadow: '0 0 0 1px var(--accent-soft)' }} />
                <button type="submit" className="w-full py-3 font-semibold rounded-lg transition text-black" style={{ background: 'linear-gradient(90deg,var(--accent-primary),var(--accent-secondary))', boxShadow: '0 4px 18px -6px var(--accent-glow)' }}>Send Message</button>
              </form>
            </div>
          </div>
        </div>
        <div><span className="text-red-500">*</span>This Product is not Exist</div>
      </section>

      <div aria-live="polite" className="sr-only">Showing {info.flavor} can variant</div>
    </div>
  )
}

export default Page
