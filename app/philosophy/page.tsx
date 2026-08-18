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
                <header className='w-full fixed top-0 left-0 z-50 flex items-center justify-center pt-5 px-4' >
                    <div className='flex flex-row max-w-7xl w-full items-center justify-between px-6 py-4' >
                        <div className='flex flex-row items-center justify-center gap-8' >
                            <div className='flex-shrink-0' >
                                <Link href={"/"} className='font-sans text-xl md:text-2xl text-foreground font-semibold tracking-tight select-none' >Arogya AI</Link>
                            </div>
                            <nav className='hidden md:block'>
                                <ul className='flex flex-row text-sm font-medium items-center gap-6 select-none cursor-pointer text-foreground/70' >
                                    <Link href={"/philosophy"} className='navitem' >Philosophy</Link>
                                    <li className='navitem' >How it works</li>
                                    <li className='navitem'>Contact Us</li>
                                </ul>
                            </nav>
                        </div>
                        <div>
                            <button onClick={()=>router.push("/apply")} className='bg-foreground text-background text-sm font-medium px-5 py-2 cursor-pointer transition-all hover:bg-foreground/85 rounded-full' >Apply</button>
                        </div>
                    </div>
                </header>

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