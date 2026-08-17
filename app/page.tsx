"use client"
import Header from './components/header'
import SpecularButton from './components/button'
import MedicalParticles from "@/app/components/MedicalParticles"
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function Homepage() {
  const router = useRouter()
  return (
    <main className='w-full min-h-screen overflow-hidden flex flex-col items-center justify-center relative' >
      <Header />
      
      {/* Interactive Medical Particle Background */}
      <div className='absolute w-full h-full left-0 top-0 overflow-hidden' >
        <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_100%)] opacity-90 pointer-events-none" />
        <MedicalParticles />
      </div>

      <section className='w-full z-10 h-full flex flex-col items-center justify-center gap-10 px-4' >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className='font-sans font-medium text-4xl md:text-6xl lg:text-7xl tracking-tighter text-center max-w-5xl leading-[1.1] text-foreground/90' 
        >
          We provide <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/60 relative inline-block">AI assistants<div className="absolute -bottom-1 left-0 w-full h-[4px] bg-gradient-to-r from-teal-400 to-blue-500 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)]" /></span> for <span className="font-bold">every doctor</span> in the world.
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className='flex flex-row items-center gap-10 mt-4 z-10' 
        >
          <SpecularButton
            size="md"
            radius={60}
            tint="#ffffff"
            tintOpacity={0}
            blur={10}
            textColor="#f5f5f5"
            lineColor="#ffffff"
            baseColor="#525252"
            intensity={0.8}
            shineSize={5}
            shineFade={40}
            thickness={1.2}
            speed={0.8}
            followMouse
            proximity={190}
            autoAnimate
            onClick={() => router.push('/why-we-exist')}
          >
            Why we exist?
          </SpecularButton>
        </motion.div>
      </section>
    </main>
  )
}