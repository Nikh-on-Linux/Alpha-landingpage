"use client";

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SmoothScroll from '../components/SmoothScroll';
import Link from 'next/link';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const paragraphs = [
    {
        title: "The Reality",
        content: (
            <p className="text-white/70">
                Doctors entered medicine to heal.<br /><br />
                Instead, they spend their days buried in paperwork, clicking through rigid screens, managing systems built for billing, not for thinking.{' '}
                <strong className="text-white font-bold">The art of diagnosis is losing to administration.</strong>{' '}
                The people who dedicated their lives to healing are burning out — not from treating patients, but from managing the system.
            </p>
        )
    },
    {
        title: "The Silent Cost",
        content: (
            <p className="text-white/70">
                In those lost minutes, <strong className="text-white font-bold">subtle clues get missed.</strong><br /><br />
                Chronic diseases hide until they become emergencies. Patients wait longer, anxiety deepens, and every day without the right diagnosis moves the line between manageable and critical.{' '}
                Technology, meant to help, has become the very <strong className="text-white font-bold">barrier between patient and doctor.</strong>
            </p>
        )
    },
    {
        title: "The Promise",
        content: (
            <p className="text-white/70">
                Arogya AI works quietly in the background.<br /><br />
                It unifies fragmented patient histories instantly, surfaces the right knowledge at the right moment, and dissolves the administrative burden entirely.{' '}
                One seamless workspace. One singular purpose:{' '}
                <strong className="text-white font-bold">give doctors their time back.</strong>{' '}
                No extra clicks. Just medicine.
            </p>
        )
    },
    {
        title: "Our Mission",
        content: (
            <p className="text-white/70">
                Our belief drives every line of code:<br /><br />
                Doctors must be free to do what only humans can do.{' '}
                <strong className="text-white font-bold">Listen. Think. Heal.</strong>{' '}
                Arogya AI handles everything else. We are not building software — we are fighting to bring{' '}
                <strong className="text-white font-bold">humanity back to healthcare.</strong>
            </p>
        )
    }
];

export default function WhyWeExistPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const paraRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        const q = gsap.utils.selector(containerRef);

        const ourText = q('.title-our');
        const philosophyText = q('.title-philosophy');
        const scrollInd = q('.scroll-indicator');

        const isMobile = window.innerWidth < 768;

        // --- Initial title positions are handled naturally by the CSS flex container ---
        // We only need to animate them away from their center origins.

        // --- Responsive title split ---
        const splitTl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=600",
                scrub: 1,
            }
        });

        splitTl.to(ourText, {
            x: isMobile ? 0 : '-40vw',
            y: isMobile ? '-30vh' : '-45vh',
            scale: 0.75,
            opacity: 0,
            ease: "power3.inOut",
        }, 0);

        splitTl.to(philosophyText, {
            x: isMobile ? 0 : '40vw',
            y: isMobile ? '30vh' : '45vh',
            scale: 0.75,
            opacity: isMobile ? 0 : 0.3,
            ease: "power3.inOut",
        }, 0);

        // Fade out scroll indicator on scroll
        splitTl.to(scrollInd, { opacity: 0, duration: 0.5 }, 0);

        // --- Paragraph opacity animations ---
        paraRefs.current.forEach((para) => {
            if (!para) return;
            
            // Fade completely out
            gsap.set(para, { opacity: 0 });

            // Fade to full opacity when entering the center of the viewport
            gsap.to(para, {
                opacity: 1,
                duration: 0.8,
                scrollTrigger: {
                    trigger: para,
                    start: "top 75%",
                    end: "bottom 25%",
                    toggleActions: "play reverse play reverse",
                }
            });
        });

    }, { scope: containerRef });

    return (
        <SmoothScroll>
            <main ref={containerRef} className="w-full min-h-screen bg-black text-white selection:bg-white selection:text-black relative">

                {/* Fixed Titles - Centered perfectly with flexbox */}
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center gap-4 pointer-events-none w-full">
                    <div className="title-our text-white uppercase tracking-[0.3em] text-sm md:text-base font-bold font-mono">
                        Our
                    </div>
                    <div className="title-philosophy text-white uppercase tracking-[0.3em] text-sm md:text-base font-bold font-mono">
                        Philosophy
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="scroll-indicator fixed bottom-12 left-1/2 -translate-x-1/2 text-white/40 uppercase tracking-[0.2em] text-[10px] font-mono z-30 flex flex-col items-center gap-3">
                    <span>Scroll</span>
                    <div className="w-[1px] h-8 bg-white/20 relative overflow-hidden">
                        <div className="w-full h-1/2 bg-white absolute top-0 left-0 animate-[bounce_2s_infinite]" />
                    </div>
                </div>

                {/* Spacer for initial split animation - keeps gap between text and letter */}
                <div className="h-[130vh] w-full"></div>

                {/* The Letter */}
                <div className="w-full max-w-xl mx-auto px-8 lg:px-0 flex flex-col gap-24 pb-[30vh]">
                    {paragraphs.map((para, i) => (
                        <div
                            key={i}
                            ref={(el) => { paraRefs.current[i] = el; }}
                            className="w-full flex flex-col relative"
                        >
                            {/* Desktop side label — alternating margins */}
                            <div className={`hidden lg:block absolute top-0 w-40 text-white/40 uppercase tracking-[0.2em] text-[11px] font-bold font-mono ${i % 2 === 0 ? '-left-48 text-right' : '-right-48 text-left'}`}>
                                {para.title}
                            </div>

                            {/* Mobile label (above content) */}
                            <div className="lg:hidden text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold font-mono mb-4">
                                {para.title}
                            </div>

                            {/* Body copy */}
                            <div className="text-sm sm:text-base leading-[2.0] font-mono font-light">
                                {para.content}
                            </div>
                        </div>
                    ))}
                    
                    {/* Next Action */}
                    <div className="w-full flex justify-center mt-12">
                        <Link href="/how-it-works" className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors text-xs md:text-sm font-mono uppercase tracking-[0.2em] font-bold">
                            See how Arogya AI works
                            <span className="group-hover:translate-x-2 transition-transform">→</span>
                        </Link>
                    </div>
                </div>

            </main>
        </SmoothScroll>
    );
}
