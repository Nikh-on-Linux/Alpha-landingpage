"use client"
import React from 'react'
import Input from '../components/Input'
import { motion } from 'framer-motion'
import SmoothScroll from '../components/SmoothScroll'

export default function ApplyPage() {
    return (
        <SmoothScroll>
            <main className='w-full min-h-screen flex flex-col items-center justify-center relative pt-32 pb-16 px-6' >
                
                {/* Background ambient effect */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,var(--foreground)_0%,transparent_50%)] opacity-[0.03] pointer-events-none" />

                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className='z-10 flex flex-col items-center w-full max-w-lg' 
                >
                    <div className="text-center mb-12">
                        <h1 className='font-sans text-3xl md:text-5xl font-bold tracking-tight text-foreground/90' >
                            Join the Pilot
                        </h1>
                        <p className='font-sans text-foreground/60 text-sm md:text-base mt-4 leading-relaxed' >
                            Apply for early access to our intelligent medical workspace. Partner with us to shape the future of clinical diagnosis.
                        </p>
                    </div>

                    <div className='w-full flex flex-col gap-6 bg-background/50 backdrop-blur-xl border border-foreground/10 p-8 rounded-3xl shadow-2xl' >
                        <div className='flex flex-col md:flex-row items-center gap-6 w-full' >
                            <Input placeholder='First Name' className="w-full" />
                            <Input placeholder='Last Name' className="w-full" />
                        </div>
                        <Input placeholder='Email Address' className="w-full" />
                        <Input placeholder='Medical License Number / Clinic Name' className="w-full" />
                        
                        <button className='mt-4 bg-foreground text-background font-semibold text-sm md:text-base px-6 py-4 rounded-xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md' >
                            Submit Application
                        </button>
                    </div>

                    <div className="mt-12 flex flex-col items-center text-center gap-3 font-mono text-xs text-foreground/50">
                        <span className="uppercase tracking-[0.1em]">Or reach out directly</span>
                        <div className="flex flex-row items-center gap-4">
                            <a href="tel:+919561894119" className="hover:text-foreground transition-colors font-bold">+91 9561894119</a>
                            <span className="text-foreground/20">|</span>
                            <a href="mailto:info@arogyai.tech" className="hover:text-foreground transition-colors font-bold">info@arogyai.tech</a>
                        </div>
                    </div>
                </motion.section>
            </main>
        </SmoothScroll>
    )
}
