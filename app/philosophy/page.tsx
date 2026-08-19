"use client"
import React from 'react'
import SplitText from '../components/SplitText'
import SmoothScroll from '../components/SmoothScroll'
import PhilosophyGraph from '../components/PhilosophyGraph'
import Link from 'next/link';
import { useRouter } from 'next/navigation'

export default function PhilosophyPage() {
    const router = useRouter();
    return (
        <SmoothScroll>
            <main className='w-full bg-background' >
                {/* Hero Section */}
                <section className='w-full h-screen flex items-center justify-center relative z-0' >
                    <SplitText
                        text="Our Philosophy"
                        className="text-5xl md:text-7xl lg:text-8xl font-semibold font-sans text-center tracking-tighter"
                        delay={20}
                        duration={0.7}
                        ease="power3.out"
                        splitType="chars"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                        textAlign="center"
                        onLetterAnimationComplete={() => { }}
                    />
                </section>

                {/* Interactive Node Graph */}
                <PhilosophyGraph />
            </main>
        </SmoothScroll>
    )
}