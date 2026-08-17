"use client"
import React, { useRef } from 'react'
import SplitText from '../components/SplitText'
import SmoothScroll from '../components/SmoothScroll'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const sections = [
    {
        id: "believe",
        title: <>We <br /> Believe</>,
        subtitle: "Doctors need to be empowered by Ai, not replaced.",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque asperiores nam, a, porro nisi fugit est nesciunt magnam laudantium laborum ex. Praesentium dolorem earum molestiae adipisci voluptas veniam quia blanditiis, temporibus, reiciendis neque asperiores consectetur itaque atque magni saepe reprehenderit accusamus? Libero expedita asperiores quibusdam neque consequuntur saepe ex earum tempora veritatis omnis! Quidem necessitatibus ducimus reprehenderit voluptas et modi iure deleniti harum rem dolores itaque explicabo, esse atque quas quos obcaecati eligendi sequi? Numquam, minima. Id quia veniam excepturi voluptatum error nostrum? Culpa, odio? Est sint voluptas delectus, tempore architecto, iure velit incidunt quaerat unde molestiae, voluptatibus nam voluptatem.",
        bg: "bg-[#050505]", // deep black
        color: "text-white"
    },
    {
        id: "culture",
        title: <>SLM <br /> Culture</>,
        subtitle: "Accuracy does not demand large models.",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque asperiores nam, a, porro nisi fugit est nesciunt magnam laudantium laborum ex. Praesentium dolorem earum molestiae adipisci voluptas veniam quia blanditiis, temporibus, reiciendis neque asperiores consectetur itaque atque magni saepe reprehenderit accusamus? Libero expedita asperiores quibusdam neque consequuntur saepe ex earum tempora veritatis omnis! Quidem necessitatibus ducimus reprehenderit voluptas et modi iure deleniti harum rem dolores itaque explicabo, esse atque quas quos obcaecati eligendi sequi? Numquam, minima. Id quia veniam excepturi voluptatum error nostrum? Culpa, odio? Est sint voluptas delectus, tempore architecto, iure velit incidunt quaerat unde molestiae, voluptatibus nam voluptatem.",
        bg: "bg-[#0f172a]", // slate 900
        color: "text-white"
    },
    {
        id: "opinion",
        title: <>Quick <br /> 2nd opinion</>,
        subtitle: "Second opinion has the potential to deliver efficient medicare.",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque asperiores nam, a, porro nisi fugit est nesciunt magnam laudantium laborum ex. Praesentium dolorem earum molestiae adipisci voluptas veniam quia blanditiis, temporibus, reiciendis neque asperiores consectetur itaque atque magni saepe reprehenderit accusamus? Libero expedita asperiores quibusdam neque consequuntur saepe ex earum tempora veritatis omnis! Quidem necessitatibus ducimus reprehenderit voluptas et modi iure deleniti harum rem dolores itaque explicabo, esse atque quas quos obcaecati eligendi sequi? Numquam, minima. Id quia veniam excepturi voluptatum error nostrum? Culpa, odio? Est sint voluptas delectus, tempore architecto, iure velit incidunt quaerat unde molestiae, voluptatibus nam voluptatem.",
        bg: "bg-[#083344]", // cyan 950
        color: "text-white"
    }
];

export default function PhilosophyPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        const cards = cardsRef.current;
        if (!cards.length) return;

        cards.forEach((card, i) => {
            // We scale down the current card as the *next* card scrolls up over it.
            if (i === cards.length - 1) return; // Last card doesn't need to scale down

            const nextCard = cards[i + 1];

            gsap.to(card, {
                scale: 0.92,
                opacity: 0.4,
                yPercent: -5,
                ease: "none",
                scrollTrigger: {
                    trigger: nextCard,
                    start: "top bottom", // When next card enters the bottom of the viewport
                    end: "top top",      // When next card reaches the top of the viewport
                    scrub: true,
                }
            });
        });
    }, { scope: containerRef });

    return (
        <SmoothScroll>
            <main className='w-full bg-background' >
                <header className='w-full top-0 left-0 z-50 flex items-center justify-center pt-5 px-4' >
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
                            <button className='bg-foreground text-background text-sm font-medium px-5 py-2 cursor-pointer transition-all hover:bg-foreground/85 rounded-full' >Apply</button>
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

                {/* Stacking Sections Container */}
                <div ref={containerRef} className="relative w-full z-10">
                    {sections.map((section, index) => (
                        <div
                            key={section.id}
                            ref={el => { cardsRef.current[index] = el }}
                            className={`w-full h-screen sticky top-0 flex items-center origin-top overflow-hidden bg-background`}
                            style={{
                                zIndex: index + 10,
                            }}
                        >
                            {/* Inner content wrapper */}
                            <div className='w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-2 flex flex-col lg:flex-row justify-between items-start lg:items-start gap-12 lg:gap-24'>
                                <div className='w-full lg:w-5/12 flex-shrink-0' >
                                    <h2 className='font-sans text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60'>
                                        {section.title}
                                    </h2>
                                </div>
                                <div className='w-full lg:w-7/12 flex flex-col gap-6' >
                                    <h3 className='font-sans text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight' >{section.subtitle}</h3>
                                    <p className='text-lg md:text-xl text-white/70 leading-relaxed font-light' >{section.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </SmoothScroll>
    )
}