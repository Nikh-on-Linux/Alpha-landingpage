"use client"
import Header from './components/header'
import SpecularButton from './components/button'

import Beams from "@/app/components/Beams"


function Homepage() {
  return (
    <main className='w-screen h-screen overflow-hidden flex flex-col items-center justify-center' >
      <Header />
      <div className='absolute w-full h-full left-0' >
        <Beams
          beamWidth={3}
          beamHeight={30}
          beamNumber={20}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={30}
        />

      </div>
      <section className='w-full z-10 h-full flex flex-col items-center justify-center gap-10' >
        <h1 className='font-sans font-bold text-5xl text-shadow-xl text-shadow-black' >We provide Ai assistant for every doctor in the world.</h1>
        <div className='flex flex-row items-center gap-10' >
          {/* <button className='select-none cursor-pointer font-sans text-lg font-medium px-4.5 py-1.5 border-2 border-foreground/10 bg-foreground/20 rounded-full transition-all hover:bg-background/15' >
            why we exist?
          </button> */}
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
            onClick={() => console.log('clicked')}
          >
            Why we exist?
          </SpecularButton>

        </div>
      </section>
    </main>
  )
}

export default Homepage