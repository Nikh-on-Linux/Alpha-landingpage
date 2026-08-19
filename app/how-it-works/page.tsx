"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SmoothScroll from '../components/SmoothScroll';
import VideoPlayer from '../components/VideoPlayer';

export default function HowItWorksPage() {
    return (
        <SmoothScroll>
            <main className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center pt-32 pb-24 px-6 relative">
                
                {/* Background ambient effect */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,var(--foreground)_0%,transparent_50%)] opacity-[0.03] pointer-events-none" />

                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="z-10 flex flex-col items-center w-full max-w-4xl"
                >
                    <div className="text-center mb-16">
                        <h1 className="font-sans text-3xl md:text-5xl font-bold tracking-tight text-white/90">
                            How Arogya AI Works
                        </h1>
                    </div>

                    {/* Video Player */}
                    <div className="w-full mb-12">
                        <VideoPlayer
                            src="https://ik.imagekit.io/assetstreamer/video.mp4"
                        />
                    </div>

                    {/* Small Paragraph */}
                    <p className="font-mono text-white/70 text-sm md:text-base leading-relaxed text-center max-w-2xl mb-12">
                        Arogya AI seamlessly integrates into your existing workflow, instantly organizing fragmented patient data and surfacing critical medical insights in real-time. It completely eliminates administrative friction, allowing you to focus purely on diagnosis and care.
                    </p>

                    {/* Try it Link */}
                    <Link 
                        href="/apply" 
                        className="group flex flex-col items-center gap-2"
                    >
                        <span className="bg-white text-black px-8 py-3 rounded-full font-sans font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg">
                            Try the Pilot
                        </span>
                    </Link>

                </motion.section>
            </main>
        </SmoothScroll>
    );
}
